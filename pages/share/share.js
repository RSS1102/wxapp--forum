// pages/foodshare/foodshare.js
const db_share = wx.cloud.database().collection('myshare')
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    fileList: [],
    shareTit: '',
    shaerPage: '',
    maxCount: 3, //上传文件数量
    accept: 'media', //上传文件格式
    cloudTemps: [] //云储存地址
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  /**
   * 
   * 1.添加图片：van提供能力，将选中图片push到数组内，然后渲染图片数组
   * --- 通过切换 2.添加视频：发布一个视频
   *  */
  afterRead(event) {
    const {
      file
    } = event.detail;
    console.log(file)

    /* 
     *上传图片
     *上传文件到 云储存 
     *通过截取上传文件的路径后缀名-判断类型
     */
    let urlType = this.urlType = file.url.substr(file.url.lastIndexOf(".") + 1)
    let cloudPath = urlType + '/' + Date.now() + "." + urlType //分类储存
    console.log("cloudPath", cloudPath)
    // let ImgPath=''
    // let Img_gif = "Photo/" + Date.now() + ".gif"; //gif片云储存
    // let Img_jpg = "Photo/" + Date.now() + ".jpg"; //jpg图片云储存
    // let VideoPath = "Video/" + Date.now() + ".mp4"; //视频云储存
    // let cloudPath = ''
    // file.type === 'video' ? cloudPath = VideoPath : cloudPath = ImgPath
    wx.cloud.uploadFile({
      cloudPath, //云储存地址
      filePath: file.url, //本地图片地址
    }).then((res) => {
      console.log(res.fileID)
      this.data.cloudTemps.push(res.fileID)
      console.log(this.data.cloudTemps)
    }).catch(console.catch)
    // 视频只能上传一个，图片只能上传三个
    if (file.type == "video") {
      console.log("video")
      this.setData({
        maxCount: 1
      })
    } else {
      this.setData({
        maxCount: 3,
        accept: 'image'
      })
    }
    this.data.fileList.push({
      ...file,
      url: file.url
    });
    console.log("数据库fileList",this.data.fileList)
    this.setData({
      fileList: this.data.fileList
    });
  },
  // 删除图片
  deleteImg(event) {
    console.log('event', event)
    var fileList = this.data.fileList; //原数据
    // 删除图片选择列表的指定图片
    fileList.splice(event.detail.index, 1)
    let Index = event.detail.index
    console.log("Index", this.data.cloudTemps[Index])
    wx.cloud.deleteFile({
      fileList: [this.data.cloudTemps[Index]]
    }).then(res => {
      // handle success
      console.log("res.fileList", res.fileList)
      // 删除d数据库中b_share内的图片内容
      this.data.cloudTemps.splice(Index, 1)
    }).catch(error => {
      // handle error
    })
    console.log("this.data.cloudTemps", this.data.cloudTemps)
    this.setData({
      fileList: fileList,
    })
    console.log('fileListlength', this.data.fileList.length)
    // 如果没有选择 默认上传模式回归 'media'
    if (fileList.length === 0) {
      this.setData({
        maxCount: 3,
        accept: 'media'
      })
    }
  },

  /*
  1.用户未登陆不能分享
  2.添加二次确定按钮，防止用户操作失误发布
   */
  shareDialog() {
    // 当文字内容有未填写的，应拒绝发布，并提示
    //废弃 || !this.data.fileList.length
    if (!Boolean(this.data.shaerPage) || !Boolean(this.data.shareTit)) {
      wx.showToast({
        title: '内容不能为空',
        icon: 'error',
      })
      return
    }
    //二次确认
    let msg = ''
    this.data.fileList.length ? msg = '你要和大家一起分享属于你的故事吗？' : msg = '你要和大家一起分享属于你的故事吗？ \n (添加图片或视频会更生动哦)'
    Dialog.confirm({
        title: '分享',
        message: msg,
      }).then(() => {
        // on confirm
        this.addDatabase()
      })
      .catch(() => {
        // on cancel
        wx.showToast({
          title: '取消分享',
          icon: 'none'
        })
      });
  },



  // 将所有内容添加到数据库内
  addDatabase() {
    let tiemNow = new Date()
    let shareTit = this.data.shareTit;
    let shaerPage = this.data.shaerPage;
    console.log( this.data.cloudTemps)
    db_share.add({
      data: {
        shareTit: shareTit,
        shaerPage: shaerPage,
        // 将云储存的内容地址添加到数据库内
        fileTemp: this.data.cloudTemps,
        // 文件类型
        fileType: this.urlType,
        tiemNow: tiemNow
      }
    }).then(res => {
      console.log(res)
      wx.showToast({
        title: '分享成功',
        icon: 'success'
      })
      this.setData({
        shaerPage: '',
        shareTit: '',
        fileList: []
      })
      // 初始化数据
      this.setData({
        cloudTemps: [], //云储存地址
        maxCount: 3, //上传文件数量
        accept: 'media' //上传文件格式
      })
    }).catch(console.catch)

  }
})