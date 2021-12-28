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
    console.log(len)
    wx.cloud.callFunction({
      name: 'getList',
      data: {
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
  /*跳转详情页 */
  goTopics(event) {
    // 如果未登录应该提示
    let userinfo = wx.getStorageSync('userinfo')
    if (!userinfo) {
      wx.showToast({
        title: '您还未登录...',
        icon: 'error',
      })
      return
    }
    console.log(event)
    let arrindex = event.currentTarget.dataset.arrindex
    console.log(arrindex)
    let pages = this.data.ListTemp[arrindex]
    // 对象转为字符串
    let str = JSON.stringify(pages);
    console.log(str)
    wx.navigateTo({
      url: '/pages/indexitems/topics/topics?str=' + str,
    })
  },
  //查看图片
  previewImage(event) {
    console.log(event),
      console.log(this.data.ListTemp)
    wx.previewImage({
      current: this.data.ListTemp[event.target.dataset.arrindex].fileTemp[event.target.dataset.indindex], // 当前显示图片的http链接
      urls: this.data.ListTemp[event.target.dataset.arrindex].fileTemp // 需要预览的图片http链接列表
    })
  },
  // 点赞事件
  setPraise(event) {
    // 如果未登录应该提示
    let userinfo = wx.getStorageSync('userinfo')
    if (!userinfo) {
      wx.showToast({
        title: '您还未登录...',
        icon: 'error',
      })
      return
    }
    console.log(event)

  }
})