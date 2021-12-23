// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: "rss-mysql-0ggtqs6y79588e4f"
})
const db = cloud.database()
const _ = db.command;
const db_list = db.collection('share')
const db_user=db.collection('users')

// 云函数入口函数
exports.main = async (event, context) => {
    db_list.aggregate()
    .lookup({
        
    })
}