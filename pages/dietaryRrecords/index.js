//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    date: app.getDate(0),
    listArr: []
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this.getList();
  },
  getList() {
    app.$http({
      url: "/api/HealthyArchive/GetMealAndSportsLog",
      type: "get",
      data: {
        date: this.data.date
      },
      success: data => {
        console.log(data);
        this.setData({
          listArr: data.Data
        })
      },
      error: data => {
        console.log(data);
      }
    });
  },
  // 日期改变
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })

    this.getList();
  },
})