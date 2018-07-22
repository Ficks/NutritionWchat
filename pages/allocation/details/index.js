//index.js
//获取应用实例

//在使用的View中引入WxParse模块
var WxParse = require('../../../wxParse/wxParse.js');

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
    var tl = '';
    if (data.type == 1) {
      tl = '正常成人膳食'
    } else if (data.type == 2) {
      tl = '婴幼儿膳食'
    } else if (data.type == 3) {
      tl = '儿童及青春期膳食'
    } else if (data.type == 4) {
      tl = '老年人膳食'
    } else if (data.type == 5) {
      tl = '孕妇及乳母膳食'
    } else if (data.type == 6) {
      tl = '素食者膳食'
    } else if (data.type == 7) {
      tl = '疾病及职业膳食'
    } else if (data.type == 8) {
      tl = '家庭配餐'
    } else if (data.type == 9) {
      tl = '走进我们'
    } else if (data.type == 10) {
      tl = '合作伙伴'
    } else if (data.type == 11) {
      tl = '饮食分量参考'
    }
    wx.setNavigationBarTitle({
      title: tl
    })
    var that = this;
    app.$http({
      url: "/api/NewsInfo/GetNewsDetailData",
      type: "get",
      data: {
        type: data.type
      },
      success: data => {
        console.log(data);
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