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
  /**
   * 
   * 1.添加图片：van提供能力，将选中图片push到数组内，然后渲染图片数组
   * --- 通过切换 2.添加视频：发布一个视频
   *  */ 
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
  // 删除图片
  deleteImg(event) {
    console.log(event)
    var nowList = []; //新数据
    var fileList = this.data.fileList; //原数据
    for (let i = 0; i < fileList.length; i++) {
      if (i == event.detail.index) {
        continue;
      } else {
        nowList.push(fileList[i])
      }
    }
    this.setData({
      fileList: nowList,
    })
    console.log('fileList',this.data.fileList)
  },

  /*
  1.用户未登陆不能分享
  2.添加二次确定按钮，防止用户操作失误发布
   */
  shareDialog() {
    // 当文字内容有未填写的，应拒绝发布，并提示
    //废弃图片限制|| !this.data.fileList.length
    if (!Boolean(this.data.shaerPage) || !Boolean(this.data.shareTit) ) {
      wx.showToast({
        title: '内容不能为空',
        icon: 'error',
      })
      return
    }
    //二次确认
    let msg =''
    this.data.fileList.length? msg='你要和大家一起分享属于你的故事吗？': msg='你要和大家一起分享属于你的故事吗？ \n (添加图片更生动哦)'
    Dialog.confirm({
      title: '分享',
      message: msg,
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