// pages/index/index.js
let totaNum = 0 //需要有多少个数据需要加载
let matchNum = 0;//需要加载第几项的数据
const $ = wx.cloud.database().command;
const DBzan = wx.cloud.database().collection('pagezan');
const DBUser = wx.cloud.database().collection("user");
const db1 = wx.cloud.database().collection("sendmessage");

let dataes = ""
let len
let len1
let activeTab
let pagezan = ""
let leaveBindex
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //用来展示数据
    pagelist: [],
    //tabs组件
    tabs: [{
      title: '灌水中心'
    }, {
      title: '技术攻略'
    }],
    activeTab: 0, //选项卡初始值
    pageNull: false //是否显示有没有文章
  },


  /**
   * 生命周期函数--监听页面加载
   */
  //页面初始化
  onLoad: function (options) {
    //00
    db1.where({
      matchNum: 0,
    }).count()
      .then(res => {
        console.log('db1总共有 0:', res.total)
        totaNum = res.total
        //判断文章数量是否为'0',如果为'0'，提示还有文章，否则加载数据。
        if (totaNum <= 0) {
          this.setData({
            pageNull: true
          })
        } else {
          //执行方法,获取第0项。
          console.log("执行方法,获取第0项。")
          matchNum = 0;
          this.getdatalist();
        }
      })
      .catch(console.log)
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.data.pagelist = []
    this.onLoad()
  },
  /**
 * 页面上拉触底事件的处理函数
 */
  onReachBottom: function () {
    this.getdatalist();
    //判断第几项
  },


  //分页加载数据
  getdatalist() {
    //获取pagelist数组的长度
    len = this.data.pagelist.length
    console.log('len总共有数据：', len)
    // //所有数据加载完成
    // if (totaNum == len) {
    //   wx.showToast({
    //     title: '数据已经加载完毕!',
    //   })
    //   console.log('数据已经加载完毕')
    //   return
    // }
    wx.showLoading({
      title: '加载中...',
    })
    wx.cloud.callFunction({
      name: 'getPageList_cloud',
      data: {
        len: len,
        matchNum: matchNum,
      }
    }).then(res => {
      console.log("==============");
      console.log('获取云函数成功', res);
      console.log('获取云函数第一条成功', res.result.list[0]);
      //赋值数组，动态绑定
      this.setData({
        //拼接数组
        pagelist: this.data.pagelist.concat(res.result.list)
      })
      wx.hideLoading(),
        wx.showToast({
          title: '加载成功！',
        })
    })
      .catch(res => {
        wx.hideLoading(),
          wx.showToast({
            title: '加载失败！',
          })
      })
  },

  //前往详情页：topics
  gotopics(event) {
    console.log("EVE", event.currentTarget.dataset.item._id)
    wx.navigateTo({
      url: '/pages/topics/topics?id=' + event.currentTarget.dataset.item._id,
    })
  },
  //前往留言
  goLeavemsg: function (event) {
    console.log("留言", event)
    leaveBindex = event.currentTarget.dataset.bindex
    wx.navigateTo({
      url: '/pages/leavemsg/leavemsg?id=' + event.currentTarget.dataset.item._id,
    })
  },

  // 搜索


  //tabs选项卡
  onTabCLick(e) {
    activeTab = e.detail.index
    console.log("e", e)
    //初始化页面
    this.setData({
      pageNull: false,
      pagelist: []
    })
    //0,热度推荐
    if (activeTab == 0) {
      matchNum = 0;
      db1.where({
        matchNum: matchNum,
      }).count()
        .then(res => {
          console.log('db1总共有', res.total)
          totaNum = res.total
          //判断文章数量是否为'0',如果为'0'，提示还有文章，否则加载数据。
          if (totaNum <= 0) {
            this.setData({
              pageNull: true
            })
          } else {
            //执行方法获取内容("sendmessage")
            this.getdatalist();
          }
        })
        .catch(console.log)
    }

    //1技术攻略
    if (activeTab == 1) {
      matchNum = 1
      db1.where({
        matchNum: matchNum,
      }).count()
        .then(res => {
          console.log('db2总共有', res.total)
          totaNum = res.total
          //判断文章数量是否为'0',如果为'0'，提示还有文章，否则加载数据。
          if (totaNum <= 0) {
            this.setData({
              pageNull: true
            })
          } else {
            //执行方法获取内容("water-talk")
            this.getdatalist();
          }
        })
        .catch(console.log)
    }

  },
  onChange(e) {
    const activeTab = e.detail.index
    this.setData({
      activeTab: activeTab
    })
  },
  // =====================测试======================


  //点赞
  async btnzan(event) {
    console.log('event,', event.currentTarget.dataset.item)
    let openid = "" //初始化点赞者 openid
    let page_id = event.currentTarget.dataset.item._id //文章的id
    let pageZan_id = '' //点赞集合的id
    let zanboolean = false
    let zabIf = false //是否之前有过点赞
    let zannum = 0 //点赞人数
    //渲染点赞列表
    let index = event.currentTarget.dataset.bindex
    let isZan = event.currentTarget.dataset.item.isZan
    console.log('index', index)
    console.log(' page_id', page_id)
    console.log(this.data.pagelist)
    console.log(this.data.pagelist[index].isZan)
    //查询一共有多人点赞了
    console.log('(page_id', page_id)
    await db1.doc(page_id).get()
      .then(res => {
        console.log('db1 zannum', res)
        zannum = res.data.zannum
        console.log('db1 zannum', zannum)
      })
      .catch(console.log)

    this.setData({
      //点赞图标更新
      [`pagelist[${index}].isZan`]: !isZan,
    })
    // 获取用户的openid
    await wx.cloud.callFunction({
      name: 'adduser'
    }).then(res => {
      console.log('openid', res.result.openid)
      //获取此时使用小程序的用户openid
      openid = res.result.openid
    })
    //查询文章的点赞情况
    await DBzan.where({
      page_id: page_id,
      _openid: openid
    }).get()
      .then(res => {
        console.log("查询数组", res)
        zanboolean = res.data[0].zanboolean //已经点赞的情况下
        pageZan_id = res.data[0]._id
        zabIf = true
      })
      .catch(res => {
        console.log("查询数组err", res)
        zabIf = false
      })

    console.log("==================//更新点赞=========================")
    if (zabIf) {
      console.log('点赞记录pageZan_id', pageZan_id) //点赞记录_id
      console.log('已经进行过点赞了');
      //pageZan集合中的zanboolean
      DBzan.doc(pageZan_id)
        .update({
          data: {
            zanboolean: !zanboolean
          }
        })
        .then(res => {
          console.log("更新：", res)
        })
        .catch(console.log)
      //数据库已经有用户的点赞记录了
      //如果查询zanboolean为真, 点赞后 应该为-1
      if (zanboolean) {
        zannum = zannum - 1
        console.log('zannuminc:', zannum)
      } else {
        //如果查询zanboolean为假, 点赞后 应该为+1
        zannum = zannum + 1
        console.log('zannuminc:', zannum)
      }
      db1.doc(page_id).update({
        data: {
          zannum: zannum
        }
      })
    } else {
      //第一次点赞，Zan列表添加点赞人员
      console.log('第一次点赞');
      DBzan.add({
        data: {
          page_id: page_id,
          zanboolean: true
        }
      })
        .then(console.log)
        .catch(console.log)
      //用户第一次点赞  点赞后 数量应该直接 +1
      zannum = zannum + 1
      console.log('zannuminc:', zannum)
      db1.doc(page_id).update({
        data: {
          zannum: zannum
        }
      })

    }
    this.setData({
      //点赞人数页面更新
      [`pagelist[${index}].zannum`]: zannum,
    })
  },

  changeData: function (ops, leaveSus) {
    console.log("leaveBindex", leaveBindex, ops, leaveSus)
    if (leaveSus)
      this.setData({
        [`pagelist[${leaveBindex}].leavevmsg.length`]: this.data.pagelist[leaveBindex].leavevmsg.length + 1,
      })
  }
})