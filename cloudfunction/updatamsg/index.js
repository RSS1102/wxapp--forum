// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  if (event.action == "leavevmsg") {
    return await cloud.database().collection("sendmessage").doc(event.id)
      .update({
        data: {
          leavevmsg: event.leavevmsg
        }
      })
      .then(res => {
        console.log("成功", res)
      })
  }

}