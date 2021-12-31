// 文章点赞
const cloud = require('wx-server-sdk')
cloud.init({
    env: "rss-mysql-0ggtqs6y79588e4f"
})
const db = cloud.database()
const _ = db.command;
const $ = db.command.aggregate
const db_pagezan = db.collection('pagezan')
// 云函数入口函数
exports.main = async (event, context) => {
    let pageId = event.pageId
    let isZan = event.isZan

    db_pagezan.add({
        data: {
            pageId: pageId,
            isZan: !isZan
        }
    })



}