/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(1);

	var _koa = __webpack_require__(2);

	var _koa2 = _interopRequireDefault(_koa);

	var _koaRouter = __webpack_require__(3);

	var _koaRouter2 = _interopRequireDefault(_koaRouter);

	var _koaBodyparser = __webpack_require__(4);

	var _koaBodyparser2 = _interopRequireDefault(_koaBodyparser);

	var _exceptions = __webpack_require__(5);

	var _aliMns = __webpack_require__(6);

	var _aliMns2 = _interopRequireDefault(_aliMns);

	var _aliOss = __webpack_require__(7);

	var _aliOss2 = _interopRequireDefault(_aliOss);

	var _mongoose = __webpack_require__(8);

	var _mongoose2 = _interopRequireDefault(_mongoose);

	var _strategy = __webpack_require__(9);

	var _strategy2 = _interopRequireDefault(_strategy);

	var _co = __webpack_require__(10);

	var _co2 = _interopRequireDefault(_co);

	var _request = __webpack_require__(11);

	var _request2 = _interopRequireDefault(_request);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

	_mongoose2.default.connect('mongodb://yuanzi-test:yuanzi@101.200.89.240:3717/yuanzi-test');
	var AliAccount = new _aliMns2.default.Account("1365198494842746", "LTAIxbipLqf28JI3", "5kwqCDVAkxyf9G5zE5fMUX3ZHsF74C");
	var mq = new _aliMns2.default.MQ('MyTestQueue', AliAccount, "beijing-internal");
	var mns = new _aliMns2.default.MNS(AliAccount, "beijing-internal");
	var app = new _koa2.default();
	var router = (0, _koaRouter2.default)();
	var Strategy = _mongoose2.default.model('strategy', _strategy2.default);
	var AliClient = new _aliOss2.default({
	  region: 'oss-cn-beijing',
	  accessKeyId: 'LTAIxbipLqf28JI3',
	  accessKeySecret: '5kwqCDVAkxyf9G5zE5fMUX3ZHsF74C'
	});

	/**
	  Middlewares
	**/

	app
	// Counting time
	.use(function () {
	  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx, next) {
	    var start;
	    return regeneratorRuntime.wrap(function _callee$(_context) {
	      while (1) {
	        switch (_context.prev = _context.next) {
	          case 0:
	            start = Date.now();
	            _context.next = 3;
	            return next();

	          case 3:
	            console.log('[' + ctx.request.method + '][' + ctx.request.url + '] ' + (Date.now() - start) + ' ms.');

	          case 4:
	          case 'end':
	            return _context.stop();
	        }
	      }
	    }, _callee, undefined);
	  }));

	  return function (_x, _x2) {
	    return _ref.apply(this, arguments);
	  };
	}()).use(function () {
	  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(ctx, next) {
	    return regeneratorRuntime.wrap(function _callee2$(_context2) {
	      while (1) {
	        switch (_context2.prev = _context2.next) {
	          case 0:
	            _context2.prev = 0;
	            _context2.next = 3;
	            return next();

	          case 3:
	            if (ctx.body) {
	              _context2.next = 5;
	              break;
	            }

	            throw new _exceptions.Exceptions.NotFound('Endpoint [' + ctx.request.url + '] not found.');

	          case 5:
	            ctx.body = {
	              ok: true,
	              content: ctx.body
	            };
	            _context2.next = 11;
	            break;

	          case 8:
	            _context2.prev = 8;
	            _context2.t0 = _context2['catch'](0);

	            ctx.body = (0, _exceptions.ExceptionHandler)(_context2.t0);

	          case 11:
	          case 'end':
	            return _context2.stop();
	        }
	      }
	    }, _callee2, undefined, [[0, 8]]);
	  }));

	  return function (_x3, _x4) {
	    return _ref2.apply(this, arguments);
	  };
	}())
	// Body parser
	.use((0, _koaBodyparser2.default)()).use(function () {
	  var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(ctx, next) {
	    return regeneratorRuntime.wrap(function _callee3$(_context3) {
	      while (1) {
	        switch (_context3.prev = _context3.next) {
	          case 0:
	            ctx.state = {};
	            ctx.state.query = ctx.request.query;
	            ctx.state.body = ctx.request.body;
	            _context3.next = 5;
	            return next();

	          case 5:
	          case 'end':
	            return _context3.stop();
	        }
	      }
	    }, _callee3, undefined);
	  }));

	  return function (_x5, _x6) {
	    return _ref3.apply(this, arguments);
	  };
	}())
	// routes
	.use(router.routes())
	// Allowed methods
	.use(router.allowedMethods());

	/**
	  Routes
	**/

	router.get('/', function (ctx, next) {
	  var Strategy = _mongoose2.default.model('Strategy', _strategy2.default);
	  Strategy.count().exec(function (err, result) {
	    console.log(result);
	  });
	  /**
	   * 订阅
	   */
	  _request2.default.get({ url: 'http://1365198494842746.mns.cn-beijing.aliyuncs.com/queues/MyTestQueue', headers: {
	      "AccessKey": 'LTAIxbipLqf28JI3',
	      "Signature": 'mns-en-topics-oss-strategyvideo-1480420013112927'
	    } });
	  ctx.body = { hello: "world" };
	});
	/**
	 * 发送消息
	 */
	router.post('/sendP', function () {
	  var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(ctx, next) {
	    var message;
	    return regeneratorRuntime.wrap(function _callee4$(_context4) {
	      while (1) {
	        switch (_context4.prev = _context4.next) {
	          case 0:
	            message = ctx.params.messages || 'Hello Ali-MNS';
	            _context4.next = 3;
	            return mq.sendP(message, 8, 0).then(console.log, console.error);

	          case 3:
	            ctx.body = _context4.sent;

	          case 4:
	          case 'end':
	            return _context4.stop();
	        }
	      }
	    }, _callee4, undefined);
	  }));

	  return function (_x7, _x8) {
	    return _ref4.apply(this, arguments);
	  };
	}());
	/**
	 * 接收消息
	 */
	router.get('/recvP', function () {
	  var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(ctx, next) {
	    var message;
	    return regeneratorRuntime.wrap(function _callee5$(_context5) {
	      while (1) {
	        switch (_context5.prev = _context5.next) {
	          case 0:
	            message = ctx.params.messages || 'Hello Ali-MNS';
	            _context5.next = 3;
	            return mq.recvP(5).then(console.log, console.error);

	          case 3:
	            ctx.body = _context5.sent;

	          case 4:
	          case 'end':
	            return _context5.stop();
	        }
	      }
	    }, _callee5, undefined);
	  }));

	  return function (_x9, _x10) {
	    return _ref5.apply(this, arguments);
	  };
	}());

	var updateStrate = function updateStrate(Id, options) {
	  return Strategy.update({ _id: Id }, {});
	};

	/**
	 launch
	**/

	app.listen(3210, function () {
	  console.log('==============start==============');
	  mns.listP("My", 20).then(function (data) {
	    console.log(data);
	    return mns.listP("My", 20, data.Queues.NextMarker);
	  }).then(function (dataP2) {
	    console.log(dataP2);
	  }, console.error);
	  mq.notifyRecv(function (err, message) {
	    console.log('notify===', message);
	    if (err && err.message === "NetworkBroken") {
	      // Best to restart the process when this occursthrow err;
	    }
	    return true; // this will cause message to be deleted automatically});
	  });
	  console.log('Listening on port 3000');
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("babel-polyfill");

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("koa");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("koa-router");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("koa-bodyparser");

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	exports.ExceptionHandler = ExceptionHandler;

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var HTTPException = function () {
	  function HTTPException(type) {
	    _classCallCheck(this, HTTPException);

	    this.error = true;
	  }

	  _createClass(HTTPException, [{
	    key: "status",
	    get: function get() {
	      return this._status;
	    },
	    set: function set(status) {
	      this._status = status;
	    }
	  }, {
	    key: "message",
	    get: function get() {
	      return this._message;
	    },
	    set: function set(message) {
	      this._message = message;
	    }
	  }]);

	  return HTTPException;
	}();

	var BadRequest = function (_HTTPException) {
	  _inherits(BadRequest, _HTTPException);

	  function BadRequest(message) {
	    _classCallCheck(this, BadRequest);

	    var _this = _possibleConstructorReturn(this, (BadRequest.__proto__ || Object.getPrototypeOf(BadRequest)).call(this));

	    _this.type = "Bad Request";
	    _this.message = message;
	    _this.status = 400;
	    return _this;
	  }

	  return BadRequest;
	}(HTTPException);

	var DatabaseError = function (_HTTPException2) {
	  _inherits(DatabaseError, _HTTPException2);

	  function DatabaseError(message) {
	    _classCallCheck(this, DatabaseError);

	    var _this2 = _possibleConstructorReturn(this, (DatabaseError.__proto__ || Object.getPrototypeOf(DatabaseError)).call(this));

	    _this2.type = "Internal Server Error";
	    _this2.message = message;
	    _this2.status = 500;
	    return _this2;
	  }

	  return DatabaseError;
	}(HTTPException);

	var NotFound = function (_HTTPException3) {
	  _inherits(NotFound, _HTTPException3);

	  function NotFound(message) {
	    _classCallCheck(this, NotFound);

	    var _this3 = _possibleConstructorReturn(this, (NotFound.__proto__ || Object.getPrototypeOf(NotFound)).call(this));

	    _this3.type = "Not found";
	    _this3.message = message;
	    _this3.status = 404;
	    return _this3;
	  }

	  return NotFound;
	}(HTTPException);

	var Exceptions = exports.Exceptions = {
	  BadRequest: BadRequest,
	  DatabaseError: DatabaseError,
	  NotFound: NotFound
	};

	function ExceptionHandler(exception) {
	  if (exception instanceof HTTPException) return { ok: false, error: true, message: exception.message, status: exception.status, type: exception.type };
	  throw exception;
	}

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("ali-mns");

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("ali-oss");

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = require("mongoose");

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _mongoose = __webpack_require__(8);

	var _mongoose2 = _interopRequireDefault(_mongoose);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Schema = _mongoose2.default.Schema;
	var ObjectId = Schema.Types.ObjectId;
	var stepSchema = new Schema({ // 加载图片
	    imgUrl: {
	        type: String,
	        default: ''

	    },
	    description: {
	        type: String,
	        default: ''
	    },
	    timePoint: { // 截止时间节点
	        type: Number,
	        default: 0
	    }

	}, {
	    id: false,
	    toObject: {
	        getters: true

	    },
	    toJSON: {
	        getters: true

	    }

	});

	var userScoreSchema = new Schema({ // 图片 + 描述
	    user: {
	        type: ObjectId,
	        ref: 'UserV2',
	        required: true
	    },
	    score: {
	        type: String,
	        default: 'level5',
	        enum: ['level1', 'level2', 'level3', 'level4', 'level5']
	    }

	}, {
	    id: false,
	    toObject: {
	        getters: true

	    },
	    toJSON: {
	        getters: true

	    }

	});
	var collectSchema = new Schema({ // 图片 + 描述
	    user: {
	        type: ObjectId,
	        ref: 'UserV2'
	    },
	    collectedAt: {
	        type: Date,
	        required: true,
	        default: Date.now
	    }

	}, {
	    id: false,
	    toObject: {
	        getters: true

	    },
	    toJSON: {
	        getters: true

	    }

	});
	var reportSchema = new Schema({ // 图片 + 描述
	    user: {
	        type: ObjectId,
	        ref: 'UserV2'
	    },
	    operatedAt: {
	        type: Date,
	        required: true,
	        default: Date.now
	    },
	    reason: {
	        type: String,
	        default: ''
	    }

	}, {
	    id: false,
	    toObject: {
	        getters: true

	    },
	    toJSON: {
	        getters: true

	    }

	});
	var toolSchema = new Schema({ // 图片 + 描述
	    title: {
	        type: String,
	        default: ''
	    },
	    amount: {
	        type: String,
	        default: ''
	    }

	}, {
	    id: false,
	    toObject: {
	        getters: true

	    },
	    toJSON: {
	        getters: true

	    }

	});
	var materialSchema = new Schema({ // 图片 + 描述
	    title: {
	        type: String,
	        default: ''
	    },
	    amount: {
	        type: String,
	        default: ''
	    }

	}, {
	    id: false,
	    toObject: {
	        getters: true

	    },
	    toJSON: {
	        getters: true

	    }

	});
	var strategySchema = new Schema({
	    cover: {
	        type: String,
	        default: ''
	    },
	    owner: { // 妙招作者
	        type: ObjectId,
	        ref: 'UserV2'

	    }, // own user id
	    title: { // 标题
	        type: String,
	        default: ''

	    },
	    labels: {
	        type: [{
	            type: ObjectId,
	            ref: 'label'
	        }]
	    },
	    scope: { //该妙招适用范围
	        type: Number,
	        default: 0,
	        enum: [0, 1, 2, 3, 4, 5]
	    },
	    degree: { //难度系数 分为5级
	        type: Number,
	        enum: [1, 2, 3, 4, 5]
	    },
	    consumingTime: { //改妙招耗时
	        type: Number,
	        enum: [1, 2, 3]
	    },
	    tools: { //工具
	        type: [toolSchema]
	    },
	    materials: { //用料
	        type: [materialSchema]
	    },
	    content: { // 正文
	        type: String,
	        default: ''
	    },
	    subTitle: { // 副标题
	        type: String,
	        default: ''

	    },
	    good: { // 购买链接
	        type: String
	    },
	    description: { // 描述
	        type: String,
	        default: ''

	    },
	    /**
	     * 视频
	     */
	    video: {
	        type: String
	    },
	    /**
	     * 音频
	     */
	    soundStory: {
	        type: String,
	        default: ''

	    },
	    /**
	     * 音频时长
	     */
	    soundStoryLength: {
	        type: Number,
	        default: 0

	    },
	    steps: { // 图片顺序及播放时间、
	        type: [stepSchema]

	    },
	    praiseUsers: { // 收藏（点赞）者
	        type: [{
	            type: ObjectId,
	            ref: 'UserV2'

	        }]

	    },
	    playUsers: { // 播放者
	        type: [{
	            type: ObjectId,
	            ref: 'UserV2'
	        }]
	    },
	    collectUsers: { // 收藏者
	        type: [collectSchema]
	    },
	    sharedUsers: { // 分享者
	        type: [{
	            type: ObjectId,
	            ref: 'UserV2'
	        }]
	    },
	    reportUsers: { // 举报者
	        type: [reportSchema]
	    },
	    isRecommended: { // 推荐
	        stateType: {
	            type: String,
	            default: 'undone',
	            enum: ['done', //通过审核
	            'undone', //待审核
	            'rejected', //未通过审核的
	            'delete'] // 推荐，未被推荐
	        },
	        recommendAt: {
	            type: Date,
	            default: Date.now
	        }
	    },
	    photoCount: { //作品数
	        type: Number,
	        default: 0
	    },
	    userScores: { // 用户评分
	        type: [userScoreSchema]
	    },
	    scores: {
	        level1: {
	            type: Number,
	            default: 0
	        },
	        level2: {
	            type: Number,
	            default: 0
	        },
	        level3: {
	            type: Number,
	            default: 0
	        },
	        level4: {
	            type: Number,
	            default: 0
	        },
	        level5: {
	            type: Number,
	            default: 0
	        }
	    },
	    createdAt: {
	        type: Date,
	        required: true,
	        default: Date.now

	    },
	    updatedAt: {
	        type: Date,
	        required: true,
	        default: Date.now
	    },
	    //虚拟数
	    artificialCount: {
	        type: Number,
	        default: 0
	    },
	    artificialdata: {
	        artificialtrycount: {
	            type: Number
	        },
	        artificialscore: {
	            type: Number
	        }
	    }
	});

	exports.strategySchema = strategySchema;

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = require("co");

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = require("request");

/***/ }
/******/ ]);