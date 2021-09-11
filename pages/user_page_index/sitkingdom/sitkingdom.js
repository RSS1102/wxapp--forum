// pages/sitkingdom/sitkingdom.js
const DB1 = wx.cloud.database().collection("user")
const DB3 = wx.cloud.database().collection("sendmessage")

let useropenid = "" //用户的openid
let userid = "" // 字段id
let kingchane = "" //已经设置的king
let inputking = "" //键盘输入的king
let nchange = false
Page({

  //  //获取输入的King
  inputdking(event) {
    inputking = event.detail.value
  },

  //定时返回可以修改
  startsend() {
    let that = this
    setTimeout(function () {
      that.setData({
        nchange: false
      })
      wx.setStorage({
        key: "key1",
        data: false
      })
    }, 86400000);

  },

  //页面加载读取
  onLoad(options) {
    let that = this
    wx.getStorage({
      key: 'sitkingdom',
      success(res) {
        that.setData({
          nchange: res.data
        })
        console.log('nchange', res.data)
      }
    })
  },




  //点击事件
  upking() {
    //获取openid
    let that = this
    wx.cloud.callFunction({
      name: 'adduser',
      success(res) {
        useropenid = res.result.openid
        console.log("openid获取成功", useropenid)
      },
      fail(res) {
        console.log("openid获取失败")
      }
    })
    //查询user表的字段_id
    DB1.where({
        _openid: useropenid
      })
      .update({
        data: {
          kingdom: inputking
        }
      })
      .then(res => {
        console.log("user更新成功", res)
        //设置为不可修改
        this.setData({
          nchange: true
        })
        //定时返回可以修改
        that.startsend()

      })


    //批量更改"sendmessage"数据库的值
    //user更新king
    DB3.where({
      _openid: useropenid
    }).update({
      data: {
        king: inputking
      },
      success(res) {
        console.log("pageking更新成功", res)
        //设置为不可修改
        wx.setStorage({
          key: "sitkingdom",
          data: true
        })
        //读取key用来改变btn状态
        wx.getStorage({
          key: 'sitkingdom',
          success(res) {
            that.setData({
              nchange: res.data
            })
            console.log('nchane1', res.data)
          }
        })
        //60倒计时方法，可以发布
        this.startsend()
      },
      fail(err) {
        console.log("pageking更新失败", err)
      }
    })

  },
})