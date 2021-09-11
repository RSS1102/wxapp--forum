// pages/topics/topics.js,详情页
//引用util.js   
var util = require('../../utils/util.js');
const db = wx.cloud.database().collection('sendmessage')
const db4 = wx.cloud.database().collection('user')
let leavevmsg = "";
let times = "";
let msgopenid = "";
let msgid = "" //集合id
let zanboolean = false //是否点赞
Page({

  /**
   * 页面的初始数据
   */

  data: {
    // 是否点赞
    zanboolean:false,
    /* 临时储存详细内容的*/
    topicsdata: "",
    leavevmsg: [], //留言数组
    //提示登录
    showOneButtonDialog3: false,
    oneButton3: [{
      text: '确定'
    }],
    //点赞,留言，分享 默认
    zan: "../../images/icon/zan.png",
    reply: "../../images/icon/reply.png",
    share: "../../images/icon/share.png"

  },
  //未登录提示
  tapDialogButton3(e) {
    this.setData({
      showOneButtonDialog3: false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    //获取文章的id
    console.log("options", options.id)
    msgid = options.id
    db
      .doc(msgid)
      .get()
      .then(res => {
        console.log("详情页成功", res)
        this.setData({
          topicsdata: res.data,
          leavevmsg: res.data.leavevmsg,
        })
      })
      .catch(res => {
        console.log("请求失败", res)
      })
    //获取改openid用户的信息
    // db4.where({
    //   _openid: msgopenid,
    // }).get({
    // })
  },

  //留言跳转按钮
  btnleavems() {
    let that = this
    // 判断用户是否授权登录
    wx.getSetting({
      success: function (res) {
        // 判断是否授权
        if (res.authSetting['scope.userInfo']) {
          //获取用户信息
          wx.getUserInfo({
            success: function (res) {
              //用户已经授权过，添加用户信息
              console.log("用户授权", res)
              that.addsendbtn()
            }
          });
        } else {
          console.log("用户未授权", res.authSetting)
          //如果没有  /不能发文章
          console.log("没有登录")
          that.setData({
            showOneButtonDialog3: true,
          })
        }
      }
    })
  },





  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //点赞
    btnzan() {
      var  zanboolean=this.data.zanboolean
      if (zanboolean) {
        db
        .doc("cbddf0af60ba1f540e348a9054a73f97")
        .update({
          data: {
            //自+1
            zannum: wx.cloud.database().command.inc(+1),
            zan: "../../images/icon/zanHL.png",
          }
        })
        .then("zan", console.log)
        .catch("zan", console.error)
      this.setData({

      })
      } else {
        db
        .doc("cbddf0af60ba1f540e348a9054a73f97")
        .update({
          data: {
            //自-1
            zannum: wx.cloud.database().command.inc(-1),
            zan: "../../images/icon/zan.png",
          }
        })
        .then("zan", console.log)
        .catch("zan", console.error)
      this.setData({
      })
      }
   
      console.log(" zanboolean", zanboolean)

  },
  // 留言的设置
  //留言跳转功能
  addsendbtn() {

    console.log(" msgid", msgid)
    wx.navigateTo({
      url: '/pages/leavemsg/leavemsg?id=' + msgid,
    })
  },



})