// pages/sendpage/semdpage.js，发布文章

//import '../../miniprogram_npm/@vant/weapp/dialog/dialog'
var util = require('../../utils/util.js');
const db1 = wx.cloud.database().collection("sendmessage")
const db2 = wx.cloud.database().collection("water-talk")
const DBuser = wx.cloud.database().collection("user")
let tit = ""
let pag = ""
let setitle = "" //点击发布的标题
let sepage = "" //点击发布的文章
let seopendid = "" //用户的openid
let kings = "" //用户的王国号
let nickName = "" //用户的名字
let avatarUrls = "" //用户的头像
let gender = "" //性别
// let zannum = 0 //点赞次数
// let replynum = 0 //留言人数
// let sharenum = 0 //分享次数


Page({
  //初始数据

  data: {
    nchange: false,
    //上传图片
    show: false,
    uploaderList: [],
    uploaderNum: 0,
    showUpload: true,
    //提示标题填写
    showOneButtonDialog1: false,
    oneButton1: [{
      text: '确定'
    }],
    //提示内容填写
    showOneButtonDialog2: false,
    oneButton2: [{
      text: '确定'
    }],
    //提示登录
    showOneButtonDialog3: false,
    oneButton3: [{
      text: '确定'
    }],

    //确认取消按钮
    dialogShow: false,
    buttons: [{
      text: '取消'
    }, {
      text: '前往'
    }],

  },



  onLoad() {
    let that = this
    wx.getStorage({
      key: "sendnchange",
      success(res) {
        console.log(res.data)
        that.setData({
          nchange: res.data
        })
      }
    })
  },
  // 删除图片
  clearImg: function (e) {
    var nowList = []; //新数据
    var uploaderList = this.data.uploaderList; //原数据

    for (let i = 0; i < uploaderList.length; i++) {
      if (i == e.currentTarget.dataset.index) {
        continue;
      } else {
        nowList.push(uploaderList[i])
      }
    }
    this.setData({
      uploaderNum: this.data.uploaderNum - 1,
      uploaderList: nowList,
      showUpload: true
    })
  },
  //展示图片
  showImg: function (e) {
    var that = this;
    wx.previewImage({
      urls: that.data.uploaderList,
      current: that.data.uploaderList[e.currentTarget.dataset.index]
    })
  },
  //上传图片
  upload: function (e) {
    var that = this;
    wx.chooseImage({
      count: 3 - that.data.uploaderNum, // 默认3
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res, uploaderList)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片

        let tempFilePaths = res.tempFilePaths[0];
        let uploaderList = that.data.uploaderList.concat(tempFilePaths);
        console.log("uploaderList", uploaderList)

        let cloudPath = "Photo/" + Date.now() + ".jpg";
        wx.cloud.uploadFile({
          cloudPath,
          filePath: tempFilePaths
        }).then((res) => {
          //console.log(res);
          let fileID = res.fileID;
          if (fileID) {
            let tempFilePaths = fileID;
            let uploaderList = that.data.uploaderList.concat(tempFilePaths);
            that.setData({
              uploaderList: uploaderList,
              uploaderNum: uploaderList.length,
            })

          }
        })
        if (uploaderList.length == 3) {
          that.setData({
            showUpload: false
          })
        }

      }
    })
  },
  // 确认的Kingdon的按钮的事件
  tapDialogButton(e) {
    if (e.detail.index == 1) {
      console.log("跳转Kingdom设置")
      this.setData({
        dialogShow: false,
      })
      //跳转到Kingdom设置
      wx.navigateTo({
        url: '/pages/user_page_index/sitkingdom/sitkingdom'
      })
    } else {
      console.log("取消设置")
      this.setData({
        dialogShow: false,
      })
    }
  },

  //空标题提示
  tapDialogButton1(e) {
    this.setData({
      showOneButtonDialog1: false
    })
  },
  //空文章提示
  tapDialogButton2(e) {
    this.setData({
      showOneButtonDialog2: false
    })
  },
  //未登录提示
  tapDialogButton3(e) {
    this.setData({
      showOneButtonDialog3: false
    })
  },

  //倒计时60s可以发送消息
  startsend() {
    let that = this
    setTimeout(function () {
      that.setData({
        nchange: false
      })
      //本地储存key
      wx.setStorage({
        key: "sendnchange",
        data: false
      })
    }, 60000);
  },

  //获取标题
  sendtitle(event) {
    tit = event.detail.value
  },
  //获取内容
  sendpage(event) {
    pag = event.detail.value
  },
  //检测用户发布内容是否合规
  //文本安全检测
  MsgCheckText() {
    wx.cloud.callFunction({
        name: 'MsgCheckText',
        data: {
          contenttit: tit,
          contentpag: pag,
        }
      })
      .then(res => {
        console.log("文本检测", res)
        var code = res.result.code
        var msg = res.result.msg
        console.log("文本检测", code, msg)
        //非正常
        if (code == 500 || code == 502) {
          wx.showToast({
            title: "内容含有违法违规内容",
            duration: 2000,
            icon: 'error',
          })
          //使用倒计时60s
          this.startsend()
          this.setData({
            nchange: true,
          });
          //本地储存key
          wx.setStorage({
            key: "sendnchange",
            data: true
          })


        }
        //正常
        if (code == 200) {
          this.addsendbtn()
        }

      })
      .catch(console.log)


  },




  //发布按钮
  addsendbtn() {
    let that = this
    // 判断用户是否授权登录
    wx.cloud.callFunction({
      name: "adduser",
      success(res) {
        // 授权用户的openid
        let openId = res.result.openid
        // 判断openid是否存在于数据库
        console.log(res)
        DBuser.where({
          _openid: openId
        }).get().then(res => {
          // 判断返回的data长度是否为0，如果为0的话就证明数据库中没有存在该数据，然后进行添加操作
          if (res.data.length == 0) {
            //获取用户信息
            console.log("用户未授权", res.authSetting)
            //如果没有  /不能发文章
            console.log("没有登录")
            that.setData({
              showOneButtonDialog3: true,
            })
          } else {
            //用户已经授权过，添加用户信息
            console.log("用户授权", res)
            that.addsendmge()
          }

        })
      }
    })
  },







  //标题，内容 ，openid（关联用户） 加入到 sendpage数据库
  addsendmge() {
    //获取openid
    let that = this
    wx.cloud.callFunction({
      name: 'adduser',
      success(res) {
        console.log("openid获取成功", res)
        seopendid = res.result.openid
        DBuser.where({
          _openid: seopendid,
        }).get({
          success: function (res) {
            console.log("获取成功", res)
            kings = res.data[0].kingdom
            console.log("kings", kings)
            //如果没有kingdom，则不能发文章
            if (kings == 0

            ) {
              that.setData({
                dialogShow: true,
              })
            } else {
              //判断标题内容是否问空
              if (tit.length == 0) {
                that.setData({
                  showOneButtonDialog1: true
                })
              } else {
                //判断文章内容是否问空
                if (pag.length == 0) {
                  that.setData({
                    showOneButtonDialog2: true
                  })
                } else {
                  sepage = pag
                  setitle = tit

                  //打开 Dialog 弹出框
                  that.setData({
                    show: true
                  })
                  // this.setData({
                  //   dialogShow: true
                  // })
                }
              }
            }
          }
        })

      },
      fail(res) {
        console.log("openid获取失败")
      }
    })


  },
  //添加数据到数据库
  async btn1() {
    //利用集合"user" 获取当前openid的作者信息（name,king 等）
    //这里存在一个异步问题：，用async await解决，我用了一个嵌套，限制了流程顺序。
    var that = this
    await DBuser.where({
        _openid: seopendid,
      }).get()
      .then(res => {
        nickName = res.data[0].nickName,
          kings = res.data[0].kingdom,
          avatarUrls = res.data[0].avatarUrl,
          gender = res.data[0].gender
        console.log("user内容获取成功了", nickName)
      })
      .catch(res => {
        console.log("user内容获取失败", res)
      })
    db1.add({
        data: {
          title: setitle,
          page: sepage,
          king: kings,
          nickName: nickName,
          avatarUrl: avatarUrls,
          gender: gender,
          uploaderList: that.data.uploaderList,
          time: util.formatTime(new Date()),
          //点赞次数
          zannum: 0,
          //  zanboolean: false,
          //留言人数
          replynum: 0,
          //分享人数
          sharenum: 0,
        }
      })
      .then(res => {
        console.log("“sendpage”内容添加成功", res)
        //使用倒计时60s
        that.startsend()
        that.setData({
          nchange: true,
          show: false,
        });
        //本地储存key
        wx.setStorage({
          key: "sendnchange",
          data: true
        })

        //提示
        wx.showToast({
          title: '发送成功',
          icon: 'none',
        })

      })
      .catch(res => {
        console.log("打印失败", res)
      })
    db1
      .where({
        _openid: seopendid // 填入当前用户 openid
      }).count()
      .then(res => {
        console.log('总共写了几个文章', res.total)
        that.setData({
          usercount: res.total
        })
      })
      .catch(res => {
        console.log("次数失败")
      })
  },
  async btn2() {
    //利用集合"user" 获取当前openid的作者信息（name,king 等）
    //这里存在一个异步问题：，用async await解决，我用了一个嵌套，限制了流程顺序。
    var that = this
    await DBuser.where({
        _openid: seopendid,
      }).get()
      .then(res => {
        nickName = res.data[0].nickName,
          kings = res.data[0].kingdom,
          avatarUrls = res.data[0].avatarUrl,
          gender = res.data[0].gender
        console.log("user内容获取成功了", nickName)
      })
      .catch(res => {
        console.log("user内容获取失败", res)
      })
    db2.add({
        data: {
          title: setitle,
          page: sepage,
          king: kings,
          nickName: nickName,
          avatarUrl: avatarUrls,
          gender: gender,
          uploaderList: that.data.uploaderList,
          time: util.formatTime(new Date()),
          //点赞次数
          zan: "../../images/icon/zan.png",
          zannum: 0,
          //  zanboolean: false,
          //留言人数
          replynum: 0,
          //分享人数
          sharenum: 0,
        }
      })
      .then(res => {
        console.log("“sendpage”内容添加成功", res)
        that.setData({
          nchange: true,
          show: false
        });
        //提示
        wx.showToast({
          title: '发送成功',
          icon: 'none',
        })
        //本地储存key
        wx.setStorage({
          key: "sendnchange",
          data: true
        })
        //使用倒计时60s
        that.startsend()
      })
      .catch(res => {
        console.log("打印失败", res)
      })
    db2
      .where({
        _openid: seopendid // 填入当前用户 openid
      }).count()
      .then(res => {
        console.log('总共写了几个文章', res.total)
        that.setData({
          usercount: res.total
        })
      })
      .catch(res => {
        console.log("次数失败")
      })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },



})