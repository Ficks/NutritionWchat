//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    ht: app.screenHeight - 58,
    navShow: false,
    userInfo: null,
    d: {},
    age: 0,
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onShow() {
    this.onLoad();
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
        let age = data.Data.age;
        console.log(age);
        if (age < 1 && age > 0) {
          age = Math.round(age * 12) + '个月'
        } else {
          age = age + '岁'
        }
        this.setData({
          age: age,
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