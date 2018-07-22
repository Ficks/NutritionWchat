//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    listArr: []
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    wx.show({
      title: '默认查询本人，如需查询其他人，请更新个人资料',
      icon: 'none'
    })
    app.$http({
      url: "/api/HealthyArchive/GetTodaysSport",
      type: "get",
      data: {
        start: app.getDate(-2),
        end: app.getDate(1)
      },
      success: data => {
        console.log(data);
        this.setData({
          listArr: data.Data
        })
      },
      error: data => {}
    });
  }
})