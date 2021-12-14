// pages/user/user.js
const db = wx.cloud.database()
const db_users = db.collection("users")
const db_share = db.collection('foodshare')
Page({
  data: {
    userinfo: {},
    login: false,
  },
  onLoad() {
    //获取用户openID
    wx.cloud.callFunction({
      name: "getopenid"
    }).then(res => {
      console.log(res.result.openid)
      wx.setStorageSync('openid', {
        openid: res.result.openid
      })
    })
 // 本地渲染
 const userinfo = wx.getStorageSync('userinfo')
 let Login=false
 userinfo? Login=true:Login=false
 this.setData({
   login: Login,
   userinfo: userinfo
 })
  },

  async onLogin() {
    // 获取用户新
    await wx.getUserProfile({
      desc: '请登录',
    }).then(res => {
      console.log(res)
      this.data.userinfo = res.userInfo
      this.setData({
        login: true,
        userinfo: this.data.userinfo
      })
      wx.setStorageSync('userinfo', this.data.userinfo)
    }).catch(console.error)
    console.log(this.data.userinfo)
/* 
    // 添加添加用户到数据库
    //应先判断数据库是否包含此用户openid
*/
    db_users.add({
      data: {
        nickName: this.data.userinfo.nickName,
        avatarUrl: this.data.userinfo.avatarUrl
      }
    }).then(() => {
      console.log('成功')
    }).catch(console.error)
  },
  // 个人发布的内容
  myShare(){
    const openid=wx.getStorageSync('openid').openid
    console.log(openid)
    db_share.where({
      _openid:openid
    }).get()
    .then(res=>{
      console.log(res)
      this.getUserShare(res)
    })
  },
 /*个人内容页 */
 getUserShare(event) {
    console.log(event)
    // 对象转为字符串
    let str = JSON.stringify(event);
    console.log(str)
    wx.navigateTo({
      url: '/pages/usershare/usershare?str=' + str,
    })
  }
})