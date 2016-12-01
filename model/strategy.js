import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
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

var userScoreSchema = new Schema({// 图片 + 描述
    user: {
        type: ObjectId,
        ref: 'UserV2',
        required: true
    },
    score: {
        type: String,
        default: 'level5',
        enum: [
            'level1',
            'level2',
            'level3',
            'level4',
            'level5'
        ]
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
var collectSchema = new Schema({// 图片 + 描述
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
var reportSchema = new Schema({// 图片 + 描述
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
var toolSchema = new Schema({// 图片 + 描述
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
var materialSchema = new Schema({// 图片 + 描述
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
        type: [
            {
                type: ObjectId,
                ref: 'label'
            }
        ]
    },
    scope: {//该妙招适用范围
        type: Number,
        default: 0,
        enum: [0, 1, 2, 3, 4, 5]
    },
    degree: {//难度系数 分为5级
        type: Number,
        enum: [1, 2, 3, 4, 5]
    },
    consumingTime: {//改妙招耗时
        type: Number,
        enum: [1, 2, 3]
    },
    tools: {//工具
        type: [toolSchema]
    },
    materials: {//用料
        type: [materialSchema]
    },
    content: {// 正文
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
        type: [
            stepSchema
        ]

    },
    praiseUsers: { // 收藏（点赞）者
        type: [
            {
                type: ObjectId,
                ref: 'UserV2'

            }
        ]

    },
    playUsers: { // 播放者
        type: [
            {
                type: ObjectId,
                ref: 'UserV2'
            }
        ]
    },
    collectUsers: { // 收藏者
        type: [
            collectSchema
        ]
    },
    sharedUsers: { // 分享者
        type: [
            {
                type: ObjectId,
                ref: 'UserV2'
            }
        ]
    },
    reportUsers: { // 举报者
        type: [
            reportSchema
        ]
    },
    isRecommended: { // 推荐
        stateType: {
            type: String,
            default: 'undone',
            enum: [
                'done',//通过审核
                'undone',//待审核
                'rejected',//未通过审核的
                'delete'
            ] // 推荐，未被推荐
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
        type: [
            userScoreSchema
        ]
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
