// 云函数入口文件
// 查询所有用户发布的内容
const cloud = require('wx-server-sdk')
cloud.init({
    env: "rss-mysql-0ggtqs6y79588e4f"
})
const db = cloud.database()
const _ = db.command;
const $ = db.command.aggregate
const db_list = db.collection('myshare')
const _openid = cloud.getWXContext().OPENID;
// 云函数入口函数a
exports.main = async (event, context) => {
    // let len = 0
    let len = event.len
    return await db_list.aggregate()
        // .match({
        //     _openid: ''
        // })
        /**
         * 联表查询userinfo
         * 联表查询本文章点赞人员
         */
        .lookup({
            // from: < 要连接的集合名 > ,
            // localField: < 输入记录的要进行相等匹配的字段 > ,
            // foreignField: < 被连接集合的要进行相等匹配的字段 > ,
            // as: < 输出的数组字段名 >
            from: 'users',
            localField: '_openid',
            foreignField: '_openid',
            as: 'userinfo',
        })
        .lookup({
            from: 'pagezan',
            localField: '_id',
            foreignField: 'pageId',
            as: 'pageZan',
        })
        /**
         * 聚合阶段。添加新字段到输出的记录。
         * 本文章，本人是否点赞
         * 本文中点赞人数
         * 格式化时间
         */
        .addFields({
            isZan: $.cond({ // cond计算布尔表达式 true/false
                if: $.gt([$.size($.filter({
                    input: '$pageZan',
                    as: 'item',
                    //cond计算布尔表达式 true/false  
                    //用于表示逻辑 "与" 的关系
                    //eq表示字段等于某个值。 
                    cond: $.and([$.eq(['$$item._openid', _openid]), $.eq(['$$item.isZan', true])])
                })), 0]),
                then: true,
                else: false
            }),
            zanNum:$.size($.filter({
                input: '$pageZan',
                as: 'item',
                cond: $.eq(['$$item.isZan', true])
            })),      
            time: $.dateToString({
                // date: <日期表达式>,
                // format: <格式化表达式>,
                // timezone: <时区表达式>,
                // onNull: <空值表达式>
                date: '$time',
                format: '%Y-%m-%d %H:%M:%S',
                onNull: '时间出问题了...',
            })
        })
        // 去除pagezan数组的输出
        .project({
            pageZan:0,  
        })
        .sort({
            time: -1
        })
        // 指定查询返回结果时从指定序列后的结果开始返回
        .skip(len)
        // 每次10个
        .limit(10)
        .end()
        // .then(res => {
        //     console.log(res)
        // })
}