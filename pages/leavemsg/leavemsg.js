// pages/leavemsg/leavemsg.js，留言发布处
var util = require('../../utils/util.js');
const db2 = wx.cloud.database().collection("sendmessage")
const DB5 = wx.cloud.database().collection("user")
let leave_msg = "";
let nickName = "";
let avatarUrl = "";
let king = "";
let leavevmsg = [];
let leave_time = "";
let ID = ""; //文章id
//let change = false;
let gender=""//性别


Page({
  data: {
    // 输入未符合内容，提示框
    showOneButtonDialog: false,
    oneButton: [{
      text: '确定'
    }],

  },


  // 未符合输入内容提示
  tapDialogButton(e) {
    this.setData({
      showOneButtonDialog: false
    })
  },
  //用户输入的内容
  sendleavemasg(event) {
    leave_msg = event.detail.value
  },
  onLoad() {


  },
  //获取表以方便 添加数组
  onLoad(options) {
    let that = this
    wx.getStorage({
      key: 'key1',
      success(res) {
        that.setData({
          change: res.data
        })

        console.log(res.data)
      }
    }) 
    ID = options.id
    console.log("(options)", options.id)
    db2.doc(options.id)
      .get()
      .then(res => {
        console.log("详情页成功", res)
        //重新把这些数据加入到数组里
        if (res.data.leavevmsg) {

          leavevmsg = res.data.leavevmsg
          console.log(" leavevmsg ", leavevmsg)
        }
      })
      .catch(res => {
        console.log("请求失败", res)
      })
    //获取评论的用户信息
    wx.cloud.callFunction({
      name: "adduser",
      success(res) {
        // 授权用户的openid

        let openId = res.result.openid
        console.log(openId)
        // 判断openid是否存在于数据库
        DB5.where({
          _openid: openId
        }).get().then(res => {
          console.log("DB5", res)
          nickName = res.data[0].nickName
          avatarUrl = res.data[0].avatarUrl
          king = res.data[0].kingdom
          gender=res.data[0].gender
          leave_time = util.formatTime(new Date())
        })
      }
    })
  },

  //倒计时60s可以发送消息
  startsend() {
    let that = this
    setTimeout(function () {
      that.setData({
        change: false
      })
      wx.setStorage({
        key: "key1",
        data: false
      })
    }, 60000);

  },

    //发布按钮
    addsendbtn() {
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
                that.addsendmge()
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



  
  sendmsg() {
    console.log(" leavevmsg ", leavevmsg)

    //判断字符是否大于4
    if (leave_msg.length < 4) {
      this.setData({
        showOneButtonDialog: true
      })
      return
    }
    let leavemsgitem = {}
    leavemsgitem.nickName = nickName
    leavemsgitem.avatarUrl = avatarUrl
    leavemsgitem.king = king
    leavemsgitem.leave_time = leave_time
    leavemsgitem.leave_msg = leave_msg
    leavemsgitem.gender = gender
    leavevmsg.push(leavemsgitem)
    console.log("leavevmsg", leavevmsg)
    //更新评论
    wx.cloud.callFunction({
      name: "updatamsg",
      data: {
        action: "leavevmsg",
        id: ID,
        leavevmsg: leavevmsg
      }
    }).then(res => {
      console.log("1成功", res)
      wx.showToast({
        title: '留言成功!',
      })
      //禁止发送
     
      wx.setStorage({
        key: "key1",
        data: true
      })
      //读取key用来改变btn状态
      let that = this
      wx.getStorage({
        key: 'key1',
        success(res) {
          that.setData({
            change: res.data
          })
          console.log(res.data)
          that.changeParentData(ID);
        }
      }) 
       //60倒计时方法，可以发布
      this .startsend()
    }).catch(res => {
      console.log("1失败", res)
    })
  },
  changeParentData: function (ops) {
   let opt=ops
    var pages =getCurrentPages();//当前页面栈
    if (pages.length >1) {
        var beforePage = pages[pages.length- 2];//获取上一个页面实例对象
        beforePage.changeData(opt);//触发父页面中的方法
    }
}

})