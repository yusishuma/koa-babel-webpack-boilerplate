'use strict';

import 'babel-polyfill';

import Koa from 'koa';
import Router from 'koa-router';
import BodyParser from 'koa-bodyparser';
import { Exceptions, ExceptionHandler } from './exceptions';
import AliMNS from 'ali-mns';
import mongoose from 'mongoose';
import strategySchema from './model/strategy'
import dotenv from 'dotenv';
import variableExpansion from 'dotenv-expand';
const myEnv = dotenv.config();
variableExpansion(myEnv);
mongoose.connect(myEnv.Mongodb);
mongoose.Promise = require('q').Promise;
const app = new Koa();
const router = Router();
const Strategy = mongoose.model('Strategy', strategySchema);
import ALY from 'aliyun-sdk'
import Q from 'q';
const  AliAccount = new AliMNS.Account(myEnv.AliAccount, myEnv.accessKeyId, myEnv.accessKeySecret);
const mq = new AliMNS.MQ(myEnv.QueueName, AliAccount, myEnv.MQLocation);
import fetch from 'node-fetch';

/**
 Middlewares
 **/

app
// Counting time
	.use(async (ctx, next) => {
		let start = Date.now();
		await next();
		console.log(`[${ctx.request.method}][${ctx.request.url}] ${Date.now() - start} ms.`);
	})
	.use(async (ctx, next) => {
		try {
			await next();
			if (!ctx.body)
				throw new Exceptions.NotFound(`Endpoint [${ctx.request.url}] not found.`);
			ctx.body = {
				ok: true,
				content: ctx.body
			};
		} catch (e) {
			ctx.body = ExceptionHandler(e);
		}
	})
	// Body parser
	.use(BodyParser())
	.use(async (ctx, next) => {
		ctx.state = {};
		ctx.state.query = ctx.request.query;
		ctx.state.body = ctx.request.body;
		await next();
	})
	// routes
	.use(router.routes())
	// Allowed methods
	.use(router.allowedMethods());

/**
 Routes
 **/

router.get('/', (ctx, next) => {

	ctx.body = { hello: "world" };

});
/**
 * 发送消息
 */
router.get('/sendP', async (ctx, next) => {
	let strategy = ctx.request.query.strategy;
	Strategy.findById(strategy).then(function (json) {
		mq.sendP(JSON.stringify({"strategy": strategy}), 8, 0).then(function (err, result) {
			ctx.body = {message:'successed'};
		});
	}).catch(function (err) {
		ctx.body = {message:'没有该妙招'}
	})

});
/**
 * 转码、水印
 */
const updateStrategy = (Id) =>{
	let jsonData = {};
	let objectPath = "";
	Strategy.findById(Id).then(function (json) {
		jsonData = json.toJSON();
		if(!jsonData && !jsonData.video && jsonData.video.split('com/').length < 0){
			return null
		}

		objectPath = 'users/'+jsonData.owner+'/strategies/vcr';
		let inputJSON = {
			"Bucket": myEnv.Bucket,
			"Location": myEnv.Location,
			"Object": jsonData.video.split('com/')[1]
		};
		let outputsJSON = [{
			"OutputObject": objectPath+'/'+Id,
			"TemplateId": "S00000001-100020",
			"WaterMarks": [{
				"InputFile": {
					"Bucket": myEnv.Bucket,
					"Location": myEnv.Location,
					"Object": "photo/watermark.png"
				},
				"WaterMarkTemplateId": myEnv.WaterMarkTemplateId,
				"UserData": "testwatermark"
			}],
		}];
		let mts = new ALY.MTS({
			"accessKeyId": myEnv.accessKeyId,
			"secretAccessKey": myEnv.accessKeySecret,
			"apiVersion": "2014-06-18",
			"region": myEnv.region,
			"endpoint": myEnv.endpoint,
		});
		return Q.fcall(function () {
			mts.submitSnapshotJob({
				Action: "SubmitSnapshotJob",
				Input: JSON.stringify(inputJSON),
				SnapshotConfig: JSON.stringify({
					"OutputFile": {
						"Bucket": myEnv.Bucket,
						"Location": myEnv.Location,
						"Object": objectPath+'/'+Id + ".jpg"
					},
					"Time": "2000"
				}),
				PipelineId: myEnv.PipelineId,
				UserData: 'snapshot success'
			}, function (err, data) {
				if (err) {
					console.log(err)
				}
				console.log("snapshot", data)
				return data
			});
		}).then(function () {
			console.log("=======转码、水印=======")
			mts.submitJobs({// 转码、水印
				Action: "SubmitJobs",
				Input: JSON.stringify(inputJSON),
				Outputs: JSON.stringify(outputsJSON),
				OutputBucket: myEnv.Bucket,
				OutputLocation: myEnv.Location,
				PipelineId: myEnv.PipelineId
			}, function (err, data) {
				if (err) {
					console.log(err);
				}
				console.log("SubmitJobs", data)
				return data
			});
		}).then(function () {
			return json;
		})
	}).then(function (json) {
		var url = myEnv.urlPrefix +objectPath+'/'+Id;
		return Strategy.findByIdAndUpdate(json._id, {'$set': { video: url + '.m3u8','videoPoster': url+'.jpg'}})
	}).then(function (result) {
		return result;
	}).catch((err) => {
		if(err){console.log(err)}
	});
};

/**
 launch
 */
app.listen(3210, () => {
	mq.notifyRecv(function(err, message){
		if(err){
			// Best to restart the process when this occursthrow err;
		}else {
			let messageBody = JSON.parse(message.Message.MessageBody);
			console.log('notify===', messageBody);
			if(messageBody && messageBody.strategy){
				Strategy.findById(messageBody.strategy).then(function (json) {
					let jsonData = json.toJSON();
					if(!json || !json.video || jsonData.video.search('.m3u8') > 0){
						return true;
					}
					fetch(jsonData.video, {
						method: 'GET',
					}).then(function (response) {
						console.log(response.ok)
						if(response.ok){
							updateStrategy(messageBody.strategy);
							return true;
						}else {
							if(jsonData.video.search('aliyuncs.com') > 0 && jsonData.video.search('yuanzi-') > 0 && !jsonData.video.search('.m3u8') > 0){
								console.log("---")
								return false;
							}else{
								return true;
							}
						}

					})
				})
			}else{
				return true;
			}
		}
	});
	console.log('Listening on port 3210');
});
