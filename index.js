'use strict';

import 'babel-polyfill';

import Koa from 'koa';
import Router from 'koa-router';
import BodyParser from 'koa-bodyparser';
import { Exceptions, ExceptionHandler } from './exceptions';
import AliMNS from 'ali-mns';
import mongoose from 'mongoose';
import strategySchema from './model/strategy'
import request from 'request';
import dotenv from 'dotenv';
import variableExpansion from 'dotenv-expand';
const myEnv = dotenv.config();
variableExpansion(myEnv);
mongoose.connect(myEnv.Mongodb);
const app = new Koa();
const router = Router();
const Strategy = mongoose.model('strategy', strategySchema);
import ALY from 'aliyun-sdk'
import Q from 'q';
const  AliAccount = new AliMNS.Account(myEnv.AliAccount, myEnv.accessKeyId, myEnv.accessKeySecret);
const mq = new AliMNS.MQ('MyTestQueue', AliAccount, "beijing-internal");

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
  Strategy.count().exec((err, result) => {
    console.log(result)
  });
  /**
   * 订阅
   */
  request.get({url:'http://1365198494842746.mns.cn-beijing.aliyuncs.com/queues/MyTestQueue', headers: {
    "AccessKey":'LTAIxbipLqf28JI3',
    "Signature": 'mns-en-topics-oss-strategyvideo-1480420013112927'
  }})
  ctx.body = { hello: "world" };

});
/**
 * 发送消息
 */
router.post('/sendP', async (ctx, next) => {
  let message = ctx.params.messages || 'Hello Ali-MNS';
  ctx.body = await mq.sendP(message, 8, 0).then(console.log, console.error);

});
/**
 * 接收消息
 */
router.get('/recvP', async (ctx, next) => {
  let message = ctx.params.messages || 'Hello Ali-MNS';
  ctx.body = await mq.recvP(5).then(console.log, console.error);

});
/**
 * 转码、水印
 */
const transcoding = (inputFile, outputFile) => {
  let inputJSON = {
    "Bucket": myEnv.Bucket,
    "Location": myEnv.Location,
    "Object": inputFile
  };
  let outputsJSON = [{
    "OutputObject": outputFile,
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
    "secretAccessKey": myEnv.secretAccessKey,
    "apiVersion": "2014-06-18",
    "region": "mts.cn-beijing.aliyuncs.com",
    "endpoint": "http://mts.cn-beijing.aliyuncs.com",
  });
  Q.all([function () {
    mts.submitSnapshotJob({
      Action: "SubmitSnapshotJob",
      Input: JSON.stringify(inputJSON),
      SnapshotConfig: JSON.stringify({
        "OutputFile": {
          "Bucket": "yuanzi-assets",
          "Location": "oss-cn-beijing",
          "Object": outputFile + ".jpg"
        },
        "Time": "12500"
      }),
      PipelineId: "a22e34ad874349f4b375b2762a4712df",
      UserData: 'testsnapshot'
    }, function (err, data) {
      if (err) {
        console.log(err)
      }
      console.log('data', data);
      return data
    })
  }, function () {
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
      console.log(data);
      return data
    });
  }
  ]).then(function (results) {
    return results;
  });
};
/**
 * 更新strategy
 */
const updateStrategy = (Id) =>{
  Strategy.findById(Id).then(function (json) {
    console.log(json);
    return transcoding(json.video, 'users/'+json.owner+'/strategies/vcr/'+Id)
  }).then(function (results) {
    console.log('=====results====');
    var url = myEnv.urlPrefix + 'users/'+json.owner+'/strategies/vcr/'+Id;
    return Strategy.update({_id: Id}, {'$set': {video: url, videoPoster: url + '.jpg' }})
  })
};

/**
 launch
 */
app.listen(3210, () => {
  console.log('==============start==============');
  mq.notifyRecv(function(err, message){
    console.log('notify===', message);
    if(err && err.message === "NetworkBroken"){
      // Best to restart the process when this occursthrow err;
    }
     updateStrategy('583e37e7b90601482c1f613e');
    return true; // this will cause message to be deleted automatically});
  });
  console.log('Listening on port 3210');
});
