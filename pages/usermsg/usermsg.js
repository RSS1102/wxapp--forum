// pages/usermsg/usermsg.js
const db1 = wx.cloud.database().collection('sendmessage')
const db2 = wx.cloud.database().collection("water-talk")
let useropenid = "";
let totaNum1 = "";
let totaNum2 = "";
let id = "" //文章id
let activeTab
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pagelist: [],
    //弹出提示确认删除
    dialogShow1: false,
    buttons1: [{
      text: '取消'
    }, {
      text: '确认'
    }],
    //tabs组件
    tabs: [],
    activeTab: 0,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  //分页加载'灌水中心'
  async getmsg1() {
    //获取列表长度
    let openId = ""
    let len1 = this.data.pagelist.length
    console.log(len1)
    if (len1 >= totaNum1) {
      wx.showToast({
        title: '数据已经加载完',
      })
      return
    }
    //提示加载中...
    wx.showLoading({
      title: '加载中',
    })
    let that = this
    //获取改openid
    await wx.cloud.callFunction({
        name: 'adduser',
      }).then(res => {
        console.log(res)
        openId = res.result.openid
        // 获取openid用户的信息
      })
      .catch(console.catch)
    db1.where({
        _openid: openId
      })
      .orderBy('time', 'desc')
      .skip(len1)
      .get()
      .then(res => {
        console.log(res)
        that.setData({
          pagelist: that.data.pagelist.concat(res.data)
        })
        //提示加载成功 
        wx.showToast({
          title: '加载成功',
        })
      })
      .catch(res => {
        console.log(res)
        wx.showToast({
          title: '加载失败',
        })
      })
  },
   //分页加载'技术攻略'
   async getmsg2() {
    //获取列表长度
    let openId = ""
    let len2 = this.data.pagelist.length
    console.log(len2)
    if (len2 >= totaNum2) {
      wx.showToast({
        title: '数据已经加载完',
      })
      return
    }
    //提示加载中...
    wx.showLoading({
      title: '加载中',
    })
    let that = this
    //获取改openid
    await wx.cloud.callFunction({
        name: 'adduser',
      }).then(res => {
        console.log(res)
        openId = res.result.openid
        // 获取openid用户的信息
      })
      .catch(console.catch)
    db2.where({
        _openid: openId
      })
      .orderBy('time', 'desc')
      .skip(len2)
      .get()
      .then(res => {
        console.log(res)
        that.setData({
          pagelist: that.data.pagelist.concat(res.data)
        })
        //提示加载成功 
        wx.showToast({
          title: '加载成功',
        })
      })
      .catch(res => {
        console.log(res)
        wx.showToast({
          title: '加载失败',
        })
      })
  },
  //页面初始化
  onLoad: function (options) {
    //tabs组件
    activeTab = 0
    const titles = ['灌水中心', '技术攻略']
    const tabs = titles.map(item => ({
      title: item
    }))
    this.setData({
      tabs
    })
    let that = this
    //查询总共有多少个数据
    wx.cloud.callFunction({
      name: 'adduser',
      success(res) {
        console.log(res)
        let openId = res.result.openid
        db1.where({
            _openid: openId
          })
          .count()
          .then(res => {
            console.log("总共有多少个数据", res)
            totaNum1 = res.total
            that.getmsg1()
          })
      }
    })
  
   
  },

  //页面触底
  onReachBottom() {
    console.log('加载完毕')

  },
  //前往详情页：topics
  gotopics(event) {
    console.log("EVE", event.currentTarget.dataset.item._id)
    wx.navigateTo({
      url: '/pages/topics/topics?id=' + event.currentTarget.dataset.item._id,
    })

  },
  // 删除文章
  btndele(event) {
    var that = this
    console.log("删除", event.currentTarget.dataset.item._id)
    id = event.currentTarget.dataset.item._id
    that.setData({
      dialogShow1: true,
    })
  },
  //确认删除文章
  tapDialogButton1(e) {
    console.log(e)
    if (e.detail.index == 1) {
      if(activeTab==0){
      db1.doc(id).remove()
        .then(res => {
          console.log(res)
          //关闭弹窗
          this.setData({
            dialogShow1: false
          })
          //删除成功
          wx.showToast({
            title: '删除成功',
            icon: 'none',
          })
          wx.navigateTo({
            url: '/pages/usermsg/usermsg',
          })
        })
        .catch(console.error)
    } else {
      //关闭弹窗
      this.setData({
        dialogShow1: false
      })
      //取消删除
      wx.showToast({
        title: '取消删除',
        icon: 'none',
      })
    }

    if(activeTab==1){
      db2.doc(id).remove()
        .then(res => {
          console.log(res)
          //关闭弹窗
          this.setData({
            dialogShow1: false
          })
          //删除成功
          wx.showToast({
            title: '删除成功',
            icon: 'none',
          })
          wx.navigateTo({
            url: '/pages/usermsg/usermsg',
          })
        })
        .catch(console.error)
    } else {
      //关闭弹窗
      this.setData({
        dialogShow1: false
      })
      //取消删除
      wx.showToast({
        title: '取消删除',
        icon: 'none',
      })
    }
  }
  },
  //tabs选项卡
  onTabCLick(e) {
    activeTab = e.detail.index
    console.log("e", e)
    //0,热度推荐
    if (activeTab == 0) {
      //初始化页面
      this.setData({
        pagelist: []
      })
      this. getmsg1()
      console.log("0", activeTab)
    }
    //1,灌水中心
    if (activeTab == 1) {
      //初始化页面
      this.setData({
        pagelist: []
      })
      this. getmsg2()
      console.log("1", activeTab)
      let that = this
      //查询总共有多少个数据
      wx.cloud.callFunction({
        name: 'adduser',
        success(res) {
          console.log(res)
          let openId = res.result.openid
          db1.where({
              _openid: openId
            })
            .count()
            .then(res => {
              console.log("总共有多少个数据", res)
              totaNum2 = res.total
              that.getmsg2()
            })
        }
      })
  
    }
  },
  onChange(e) {
    const activeTab = e.detail.index
    this.setData({
      activeTab: activeTab
    })
  },
})