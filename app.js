//app.js
var util = require('./utils/util.js');
App({
  onLaunch: function () {
    var that = this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)


    // 设备信息
    wx.getSystemInfo({
      success: function (res) {
        that.screenWidth = res.windowWidth;
        that.screenHeight = res.windowHeight;
        that.pixelRatio = res.pixelRatio;
      }
    });
  },
  globalData: {
    userInfo: null,
    URL: 'https://www.xyys.ltd',
    userid: '',
    Token: '',
    timer: null,
    isLogin: false,
  },
  getDate(AddDayCount) {
    var dd = new Date();
    dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1; //获取当前月份的日期
    var d = dd.getDate();
    m = m >= 10 ? m : '0' + m;
    d = d >= 10 ? d : '0' + d;
    return y + "-" + m + "-" + d;
  },
  $http(params) {
    wx.request({
      url: this.globalData.URL + params.url,
      data: params.data,
      method: params.type.toUpperCase(),
      header: {
        'content-type': 'application/json', // 默认值
        'token': this.globalData.Token,
        'userid': this.globalData.userid
      },
      success: function (res) {
        // console.log('返回结果：')
        // console.log(res)
        params.success(res.data);
      },
      fail: function (res) {
        wx.showToast({
          title: "出错" + res.error
        })
      }
    })
  }
})