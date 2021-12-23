// pages/mainPage/index/index.js
const db_share = wx.cloud.database().collection('myshare')
const util =require('../../utils/util')
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
    this.getFooedShare()
    
  },
  onPullDownRefresh() {
    this.onLoad()
  },

  /* 应在发布页面添加时间，进行orderBy排序 */
  getFooedShare() {
    wx.showLoading({
      title: '加载中...',
      cion: 'loading'
    })
    db_share.get()
      .then(res => {
        console.log(res)
        this.data.ListTemp = res.data
        this.setData({
          ListTemp: res.data
        })
        wx.hideLoading()
      })
  },
  /*跳转详情页 */
  goTopics(event) {
    console.log(event)
    let bindex = event.currentTarget.dataset.bindex
    console.log(bindex)
    let pages = this.data.ListTemp[bindex]
    // 对象转为字符串
    let str = JSON.stringify(pages);
    console.log(str)
    wx.navigateTo({
      url: '/pages/indexitems/topics/topics?str=' + str,
    })
  }

})