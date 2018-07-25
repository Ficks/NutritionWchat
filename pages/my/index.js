//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    navShow: false,
    userInfo: null,
    d: {}
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

    app.$http({
      url: '/api/HealthyArchive/GetPersonalHealthyArchive',
      type: "get",
      data: {},
      success: data => {
        //成功的处理
        this.setData({
          d: data.Data
        })
      },
      error: function () {
        //错误处理
      }
    });
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