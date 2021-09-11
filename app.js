// app.js

App({
  onLaunch() {
    wx.cloud.init({
      env:"cloud1-1gwuqx9124efb084"
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
