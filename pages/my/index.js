//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    navShow: false,
    userInfo: null
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this.setData({
      userInfo: app.globalData.userInfo
    })
    console.log(this.data.userInfo)
  },
  hideNav() {
    // 关闭
    this.setData({
      navShow: false
    })
  },
  showNav() {
    // 显示菜单
    this.setData({
      navShow: true
    })
  },
})