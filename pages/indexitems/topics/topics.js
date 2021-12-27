// pages/topics/topics.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 字符串转为对象
    let pages = JSON.parse(options.str)
    this.setData({
      ListTemp: pages
    })
    console.log(pages)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

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
  //查看图片
  previewImage(event) {
    console.log(event),
      console.log(this.data.ListTemp)
    wx.previewImage({
      current: this.data.ListTemp.fileTemp[event.target.dataset.indindex], // 当前显示图片的http链接
      urls: this.data.ListTemp.fileTemp // 需要预览的图片http链接列表
    })
  }
})