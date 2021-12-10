// pages/User/User.js
// index.js
// 获取应用实例
const app = getApp()
var DBUser = wx.cloud.database().collection("user");
var that;
let kingdom = 0
let userInfo = {}
let id = ""
let openId = ""

Page({
  data: {
    motto: '您还没有登录，请登录',
    userInfo: {},
    hasUserInfo: false, //用户是否授权
    canIUseGetUserProfile: false,
    Userupdate: false,

    //1,提示更新用户信息成功
    showOneButtonDialog1: false,
    oneButton1: [{
      text: '确定'
    }],
    //2,提示用户信息已经是最新信息
    showOneButtonDialog2: false,
    oneButton2: [{
      text: '确定'
    }],
  },
  //页面监听，
  onLoad() {
    let userinfo = wx.getStorageSync('userinfo')
    console.log(userinfo)
    console.log(Object.keys(userinfo))
    if (!Object.keys(userinfo) == []) {
      this.setData({
        hasUserInfo: true,
        userInfo: userinfo
      })
    }



  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        let userInfo = res.userInfo
        this.adduser(userInfo)
      }
    })
  },

  //添加数据到user
  adduser(userInfo) {
    wx.cloud.callFunction({
      name: "adduser",
      success(res) {
        // 授权用户的openid
        openId = res.result.openid
        let obj = Object.assign({ openid: openId }, userInfo)
        console.log("obj", obj)
        wx.setStorageSync('userinfo', obj)
        // 判断openid是否存在于数据库
        console.log(res)
        DBUser.where({
          _openid: openId
        }).get().then(res => {
          // 判断返回的data长度是否为0，如果为0的话就证明数据库中没有存在该数据，然后进行添加操作
          if (res.data.length == 0) {
            //通过判断data数组长度是否为0来进行下一步的逻辑处理
            DBUser.add({
              data: {
                userInfo: true,
                nickName: userInfo.nickName,
                avatarUrl: userInfo.avatarUrl,
                gender: userInfo.gender,
                kingdom: "0",
              }
            })
          } else {
            console.log("你已经添加了此用户")
          }
        })
      },
      fail(res) {
        console.log(res, "云函数adduser调用失败")
      }
    })
  },

  //更新用户信息
  async updateuser() {
    var that = this
    await wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
    }).then(res => {
      console.log(res)
      this.setData({
        userInfo: res.userInfo,
      })
      userInfo = res.userInfo
    })
      .catch(res => {
        console.log(res)
      })

    await DBUser.where({
      _openid: openId
    })
      .get()
      .then(res => {
        console.log("res", res)
        id = res.data[0]._id
        console.log("_id", id)
      })
      .catch(console.error)
    console.log("id2", id)
    console.log("userInfo", userInfo)

    DBUser.doc(id).update({
      // data 传入需要局部更新的数据
      data: {
        nickName: userInfo.nickName,
        avatarUrl: userInfo.avatarUrl,
        gender: userInfo.gender,
      },
      success: (res) => {
        console.log("成功", res)
        //显示明天更新
        this.setData({
          Userupdate: true,
        }),
          // 提示用户信息已经更改 
          wx.showToast({
            title: '用户信息已更新成功',
            icon: 'none',
          })
        wx.hideLoading()
        //本地储存key
        wx.setStorage({
          key: "Userupdate",
          data: true
        })

        // 更新用户信息的本地储存


        that.upUsersettime();
      },
      fail(res) {
        console.log("失败", res)
      }
    })
  },
  //倒计时一天后更新
  upUsersettime() {
    console.log("开始计时")
    let that = this
    setTimeout(function () {
      //本地储存key
      wx.setStorage({
        key: "Userupdate",
        data: false
      })
      that.setData({
        nchange: false
      })
    }, 36000000);



  },



  //跳转更改king
  goking() {
    wx.navigateTo({
      url: '/pages/user_page_index/sitkingdom/sitkingdom'
    })

  },
  //跳转到隐私声明界面
  goprvacy() {
    wx.navigateTo({
      url: '/pages/user_page_index/prvacy/prvacy'
    })
  },

  //跳转程序说明
  goqueston() {
    wx.navigateTo({
      url: '/pages/user_page_index/queston/queston'
    })
  },
  unLogin(){
    wx.removeStorageSync('userinfo')
    this.setData({
      hasUserInfo:false
    })
    wx.showToast({
      title: '退出登陆',
    })
  }
})