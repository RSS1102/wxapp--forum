// app.js

App({
  onLaunch() {
    wx.cloud.init({
      env:"cloudbase-prepaid-3e43w9675b457b"
    })
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
       // console.log(res)
      }
    })
  },
  globalData: {
    userInfo: null
  }
})
