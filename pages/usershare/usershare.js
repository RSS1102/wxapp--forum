// pages/mainPage/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    foodList: [],

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    //字符串转换为json
    let pages = JSON.parse(options.str)
    // 进行渲染
    this.setData({
      foodList: pages.data
    })
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.onLoad()
  },


})