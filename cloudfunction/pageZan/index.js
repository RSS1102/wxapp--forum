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
    let _openid = cloud.getWXContext().OPENID
    let zanType;
    let pageId = event.pageId;
    let isZan = event.isZan;
    // let pageId = '123456789'
    // let isZan = true
    let arrs = [];
    // 判断是否含有
    await db_pagezan.where({
            _openid: _openid,
            pageId: pageId
        }).get()
        .then(res => {
            console.log(res)
            arrs = res.data
        }).catch(console.error())
    if (arrs.length === 0) {
        // 添加
        db_pagezan.add({
            data: {
                _openid: _openid,
                pageId: pageId,
                isZan: isZan
            }
        }).then(res => {
            console.log(res)
            zanType = 'addSuc'
        }).catch(err => {
            console.log(err)
            zanType = 'addErr'
        })
    } else {
        // 更新
        db_pagezan.where({
                _openid: _openid,
                pageId: pageId,
            }).update({
                data: {
                    isZan: isZan
                }
            })
            .then(res => {
                console.log(res)
                zanType = 'updataSuc'
            }).catch(err => {
                console.log(err)
                zanType = 'updataErr'
            })
    }
    return zanType
}