// pages/mainPage/index/index.js
const db_share = wx.cloud.database().collection('myshare')
const db_pagezan = wx.cloud.database().collection('pagezan')
import tools from '../../utils/tools/tools'

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
    // this.debounce = this.debounce()
    // 先清空数组，再重新赋值
    this.data.ListTemp = []
    this.getShare()
    // // 获取本分区的文章数量
    // db_share.count()
    //   .then(res => {

    //   })

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
    /*
     ** 赋值
     * @param Page 点赞按钮触发
     * @param item:文章信息
     * @param openid：用户id
     * @param index:文章下标
     * @param isZan:是否点赞
     * @param zanNumber:点赞数量
     */
    // let openId = userinfo.openid;
    let Page = event.currentTarget.dataset;
    let index = Page.index;
    let item = Page.item;
    let pageId = item._id;
    let zanNum = item.zanNum
    let Zan, isZan;
    console.log(zanNum)
    // 对值得操作
    try {
      Zan = wx.getStorageSync('Zan')
    } catch (e) {
      console.log(e)
    }
    if (!Object.keys(Zan).length) {
      wx.setStorageSync('Zan', {
        isZan: item.isZan,
        zanNum: item.zanNum
      })
      Zan = wx.getStorageSync('Zan')
      Zan.isZan ? zanNum =zanNum - 1 : zanNum =zanNum + 1
    }else{
      Zan.isZan ? zanNum = Zan.zanNum - 1 : zanNum = Zan.zanNum + 1
    }
    isZan = !Zan.isZan
    console.log(zanNum)
    wx.setStorageSync('Zan', {
      isZan: isZan,
      zanNum: zanNum
    })
    // 视图更新
    this.setData({
      [`ListTemp[${index}].isZan`]: isZan,
      [`ListTemp[${index}].zanNum`]: zanNum
    })
    // 防抖 wx.removeStorageSync('Zan')
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.timer = setTimeout(() => {
      wx.removeStorageSync('Zan')
      // 点赞云函数
      wx.cloud.callFunction({
        name: 'pagezan',
        data: {
          pageId: pageId,
          isZan: isZan
        }
      }).then(res => {
        console.log(res)
      }).catch(console.error())
    }, 500)
  },


  sharePage() {}
})