// pages/mainPage/index/index.js
const db_share = wx.cloud.database().collection('myshare')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ListTemp: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 先清空数组，再重新赋值
    this.data.ListTemp = []
    this.getShare()
    // 获取本分区的文章数量
    db_share.count()
      .then(res => {

      })

  },
  // 下拉刷新
  onPullDownRefresh() {
    this.onLoad()
  },
  // 上拉请求数据
  onReachBottom() {


  },

  /* 云函数 获取数据*/
  getShare() {
    wx.showLoading({
      title: '加载中...',
      mask: true,
    })
    // db_share.get()
    let len = this.data.ListTemp.length
    let openid = wx.getStorageSync('userinfo').openid
    console.log(len)
    wx.cloud.callFunction({
      name: 'getuserList',
      data: {
        openid: openid,
        len: len
      }
    }).then(res => {
      console.log(res)
      //拼接数组
      this.setData({
        ListTemp: this.data.ListTemp.concat(res.result.list)
      })
      console.log(this.data.ListTemp)
      wx.hideLoading()
    }).catch(console.error, wx.hideLoading())
  },
})