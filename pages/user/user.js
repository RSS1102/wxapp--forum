// pages/user/user.js
const db = wx.cloud.database()
const db_users = db.collection("users")
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({
  data: {
    userinfo: {},
    login: false,
  },
  onLoad() {

    // 本地渲染用户
    const userinfo = wx.getStorageSync('userinfo')
    let Login = false
    userinfo ? Login = true : Login = false
    this.setData({
      login: Login,
      userinfo: userinfo
    })
  },

  /* 用户登录*/
  async onLogin() {
    // 获取用户
    await wx.getUserProfile({
      desc: '请登录',
    }).then(res => {
      console.log(res)
      this.data.userinfo = res.userInfo
      this.setData({
        login: true,
        userinfo: this.data.userinfo
      })
    }).catch(console.error)
    //调用云函数"getopenid"获取用户openID
    await wx.cloud.callFunction({
      name: "getopenid"
    }).then(res => {
      console.log(res.result.openid)
      // Object.assign合并json对象
      let userinfo = Object.assign(this.data.userinfo, {
        openid: res.result.openid
      })
      // 储存在本地
      wx.setStorageSync('userinfo', userinfo)
    })
    console.log(this.data.userinfo)
    /* 
        // 添加添加用户到数据库
        //应先判断数据库是否包含此用户openid
    */
    //  获取本地用户信息（openid）
    const openid = wx.getStorageSync('userinfo').openid
    db_users.where({
        _openid: openid
      }).count()
      .then(res => {
        console.log(res)
        if (!res.total) {
          // 添加用户到数据库
          db_users.add({
            data: {
              nickName: this.data.userinfo.nickName,
              avatarUrl: this.data.userinfo.avatarUrl
            }
          }).then(() => {
            console.log('成功')
          }).catch(console.error)
        } else {
          // 更新用户信息
          db_users.where({
              _openid: openid
            })
            .update({
              data: {
                nickName: this.data.userinfo.nickName,
                avatarUrl: this.data.userinfo.avatarUrl
              }
            }).then(() => {
              console.log('更新成功')
            }).catch(console.error)
        }
      })
  },


  /*个人内容页 */
  myShare() {
    wx.navigateTo({
      url: '/pages/useritems/usershare/usershare',
    })
  },
  // 退出登陆
  backLogin() {
    Dialog.confirm({
        title: '退出登陆',
        message: '您是否确定退出登陆，如果退出则不能享受服务！',
      })
      .then(() => {
        // on confirm
        wx.removeStorageSync('userinfo')
        this.setData({
          login: false
        })
      })
      .catch(() => {
        // on cancel
      });

  }
})