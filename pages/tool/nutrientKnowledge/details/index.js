//index.js
//获取应用实例

//在使用的View中引入WxParse模块
var WxParse = require('../../../../wxParse/wxParse.js');

const app = getApp()

Page({
  data: {
    article: '',
    details: {}
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (data) {
    var that = this;
    app.$http({
      url: "/api/NewsInfo/GetNewsInfoDetails",
      type: "get",
      data: {
        id: data.id
      },
      success: data => {
        var temp = WxParse.wxParse('article', 'html', data.Data.text, that, 5);
        this.setData({
          details: data.Data,
          article: temp
        })
      },
      error() {}
    });
  }
})