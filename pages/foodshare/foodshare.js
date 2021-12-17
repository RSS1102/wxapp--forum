// pages/foodshare/foodshare.js
const db_share = wx.cloud.database().collection('foodshare')
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    fileList: [],
    shareTit: '',
    shaerPage: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // van提供能力，将选中图片push到数组内，然后渲染图片数组
  afterRead(event) {
    const {
      file
    } = event.detail;
    this.data.fileList.push({
      ...file,
      url: file.url
    });
    console.log(this.data.fileList)
    this.setData({
      fileList: this.data.fileList
    });
  },
  // 清空图片
  deleteImg(event) {
    this.setData({
      fileList: []
    })
  },

  /*
  1.用户未登陆不能分享
  2.添加二次确定按钮，防止用户操作失误发布
   */
  shareDialog() {
    // 当三个内容有未填写的，应拒绝发布，并提示
    if (!Boolean(this.data.shaerPage) || !Boolean(this.data.shareTit) || !this.data.fileList.length) {
      wx.showToast({
        title: '不能为空',
        icon: 'error',
      })
      return
    }
    //二次确认
    Dialog.confirm({
        title: 'Share',
        message: '你要和大家分享你的美食吗？',
      })
      .then(() => {
        // on confirm
        this.shareFood()
      })
      .catch(() => {
        // on cancel
        wx.showToast({
          title: '取消分享',
          icon: 'none'
        })
      });

  },



  // 将图片上传到云储存，并且将其他的内容添加到数据库内
  shareFood() {
    let shareTit = this.data.shareTit;
    let shaerPage = this.data.shaerPage;
    let cloudPath = "Photo/" + Date.now() + ".jpg"; //云储存
    wx.cloud.uploadFile({
      cloudPath, //云储存地址
      filePath: this.data.fileList[0].url,//本地图片地址
    }).then((res) => {
      console.log(res.fileID)
      db_share.add({
        data: {
          shareTit: shareTit,
          shaerPage: shaerPage,
          // 将云储存的内容地址添加到数据库内
          fileImg: res.fileID
        }
      }).then(res => {
        console.log(res)
        wx.showToast({
          title: '分享成功',
          icon: 'success'
        })
      }).catch(console.catch)
    }).catch(console.catch)
  }





})