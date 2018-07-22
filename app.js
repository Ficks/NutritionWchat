//app.js
var util = require('./utils/util.js');
App({
  onLaunch: function () {
    var that = this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        this.globalData.code = res.code;
        // 模拟登陆
        this.loginUp(res.code);
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log("授权成功")
              console.log(res)
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

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
  loginUp(code) {
    var d = JSON.stringify({
      Code: code
    })
    wx.request({
      url: this.globalData.URL + '/api/WeChat/JsCodeToSession',
      data: d,
      method: 'POST',
      dataType: 'json',
      success: res => {
        if (res.data.Code === 20000) {
          console.log("成功登录")
          this.globalData.userid = res.data.Data.userid;
          this.globalData.Token = res.data.Token;
          this.globalData.isLogin = true;
          wx.redirectTo({
            url: `/pages/index/index`
            // url: `pages/dietaryRrecords/index`
          })
        } else if (res.data.Code === 9006) {
          // 用户从未登陆过
          // 用户从未登陆过
          // 1、获取到后台返回的key
          // 2、调用wx.getUserInfo获取到数据
          // 3、调用下面接口
          var twoData = {
            "key": "00000000-0000-0000-0000-000000000000",
            "encryptedData": "string",
            "iv": "string"
          }
          twoData = JOSN.stringify(twoData);
          wx.request({
            url: this.globalData.URL + '/api/WeChat/PostUserInfo',
            data: twoData,
            method: 'POST',
            success: res => {
              // 第二次登录
            },
            error: () => {
              wx.showToast({
                title: "出错",
                icon: 'none'
              })
            }
          })
        }
      },
      complete: function () {
        // console.log("登录结束")
      },
      fail: function (error) {
        console.log(error)
        wx.showToast({
          title: "出错",
          icon: 'none'
        })
      }
    })
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