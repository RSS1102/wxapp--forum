// 云函数入口文件
// 查询用户个人发布的内容
const cloud = require('wx-server-sdk')
cloud.init({
    env: "rss-mysql-0ggtqs6y79588e4f"
})
const db = cloud.database()
const _ = db.command;
const $ = db.command.aggregate
const db_list = db.collection('myshare')

// 云函数入口函数a
exports.main = async (event, context) => {
    // event.len
    let len = event.len
    let _openid = event.openid
    return await db_list.aggregate()
        .match({
            _openid: _openid
        })
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
        // 格式化时间
        .addFields({
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
        .sort({
            time: -1
        })
        // 指定查询返回结果时从指定序列后的结果开始返回
        .skip(len)
        // 每次10个
        .limit(10)
        .end()
}