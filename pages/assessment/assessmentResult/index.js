//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    df: 0,
    text: "",
    jf: 0,
    share: false,
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (data) {
    this.setData({
      df: data.df,
      jf: data.jf,
      text: data.text
    })
    if (data.jf != 0) {
      wx.showToast({
        title: `积分+${data.jf}`
      })
    }
  },
  back() {
    wx.navigateBack();
  },
  // 分享
  shareFn() {
    this.setData({
      share: true
    })
  },
  // 取消分享
  shareHide() {
    console.log(9999)
    this.setData({
      share: false
    })
  }
})