//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    key: ''
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {

    wx.showLoading({
      title: "正在登录中",
      mask: true
    })
    // 登录
    wx.login({
      success: res => {
        console.log(res);
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        app.globalData.code = res.code;
        // 模拟登陆
        this.loginUp(res.code);
      }
    })
  },
  yesLogin(res) {
    console.log(res)
    console.log("成功登录")
    if (res.data.Code !== 20000) {
      wx.showToast({
        title: "登录失败",
        icon: 'none'
      })
      return;
    }
    app.globalData.userInfo = res.data.Data;
    app.globalData.userid = res.data.Data.userid;
    app.globalData.Token = res.data.Token;
    app.globalData.isLogin = true;
    wx.redirectTo({
      url: `/pages/index/index`
      // url: `pages/dietaryRrecords/index`
    })
  },
  loginUp(code) {
    var d = JSON.stringify({
      Code: code
    })
    wx.request({
      url: app.globalData.URL + '/api/WeChat/JsCodeToSession',
      data: d,
      method: 'POST',
      dataType: 'json',
      success: res => {
        console.log(res)
        if (res.data.Code === 20000) {
          this.yesLogin(res);
        } else if (res.data.Code === 9006) {
          this.setData({
            key: res.data.Data
          })
          // 获取用户信息
          wx.getSetting({
            success: res => {
              console.log(res);
              if (res.authSetting['scope.userInfo']) {
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                // wx.getUserInfo({
                //   success: res => {
                //     console.log("授权成功")
                //     console.log(res)
                //     // 可以将 res 发送给后台解码出 unionId
                //     this.globalData.userInfo = res.userInfo

                //     // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                //     // 所以此处加入 callback 以防止这种情况
                //     if (this.userInfoReadyCallback) {
                //       this.userInfoReadyCallback(res)
                //     }
                //   }
                // })
                this.wxLogin();
              } else {
                wx.showToast({
                  title: "请点击按钮进行授权",
                  icon: 'none'
                })
                this.setData({
                  hasUserInfo: true
                })
                console.log("没有授权")
              }
            },
            complete: function () {
              console.log("授权结束")
            },
            fail: function (error) {
              console.log('授权出错')
            }
          })
        } else {
          wx.showToast({
            title: res.data.Message || res.data.Error,
            icon: 'none'
          })
        }
      },
      complete: function () {
        console.log("登录结束")
      },
      fail: function (error) {
        wx.showToast({
          title: "出错",
          icon: 'none'
        })
      }
    })
  },
  wxLogin(key) {
    wx.getUserInfo({
      success: res => {
        console.log(res)
        // 可以将 res 发送给后台解码出 unionId
        app.globalData.userInfo = res.userInfo
        var d = {
          key: this.data.key,
          encryptedData: res.encryptedData,
          iv: res.iv
        }
        this.erCiLogin(d);
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        if (this.userInfoReadyCallback) {
          this.userInfoReadyCallback(res)
        }
      }
    })
    // 对于从来没登录过公众号的用户进行注册
  },
  erCiLogin(d) {
    console.log(d)
    wx.request({
      url: app.globalData.URL + '/api/WeChat/PostUserInfo',
      data: d,
      method: 'POST',
      success: res => {
        // 第二次登录
        console.log(res)
        if (res.data.Code === 20000) {
          this.yesLogin(res);
        } else {
          wx.showToast({
            title: res.data.Message || res.data.Error,
            icon: 'none'
          })
        }
      },
      error: () => {
        wx.showToast({
          title: "出错",
          icon: 'none'
        })
      }
    })
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    this.wxLogin();
  }
})
