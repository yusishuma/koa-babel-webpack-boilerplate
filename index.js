'use strict';

import 'babel-polyfill';

import Koa from 'koa';
import Router from 'koa-router';
import BodyParser from 'koa-bodyparser';
import { Exceptions, ExceptionHandler } from './exceptions';
import AliMNS from 'ali-mns';
import oss from 'ali-oss';
import mongoose from 'mongoose';
import strategySchema from './model/strategy'
import co from 'co';
import request from 'request';
mongoose.connect('mongodb://yuanzi-test:yuanzi@101.200.89.240:3717/yuanzi-test');
const  AliAccount = new AliMNS.Account("1365198494842746", "LTAIxbipLqf28JI3", "5kwqCDVAkxyf9G5zE5fMUX3ZHsF74C");
const mq = new AliMNS.MQ('MyTestQueue', AliAccount, "beijing-internal");
var mns = new AliMNS.MNS(AliAccount, "beijing-internal");
const app = new Koa();
const router = Router();
const Strategy = mongoose.model('strategy', strategySchema);
const AliClient = new oss({
  region: 'oss-cn-beijing',
  accessKeyId: 'LTAIxbipLqf28JI3',
  accessKeySecret: '5kwqCDVAkxyf9G5zE5fMUX3ZHsF74C'
});

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
  const Strategy = mongoose.model('Strategy', strategySchema);
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
  var message = ctx.params.messages || 'Hello Ali-MNS';
  ctx.body = await mq.sendP(message, 8, 0).then(console.log, console.error);

});
/**
 * 接收消息
 */
router.get('/recvP', async (ctx, next) => {
  var message = ctx.params.messages || 'Hello Ali-MNS';
  ctx.body = await mq.recvP(5).then(console.log, console.error);

});

const updateStrate = (Id, ) =>{
  Strategy.update({_id: Id}, {}){

  }
};

/**
 launch
**/

app.listen(3210, () => {
  console.log('==============start==============');
  mns.listP("My", 20).then(function(data){
    console.log(data);
    return mns.listP("My", 20, data.Queues.NextMarker);
  }).then(function(dataP2){
    console.log(dataP2);
  }, console.error);
  mq.notifyRecv(function(err, message){
    console.log('notify===', message);
    if(err && err.message === "NetworkBroken"){
    // Best to restart the process when this occursthrow err;
    }
    return true; // this will cause message to be deleted automatically});
  };
  console.log('Listening on port 3000');
});
