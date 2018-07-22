//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    listArr: [],
    url: app.globalData.URL,
    isTNB: '',
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (data) {
    this.setData({
      isTNB: data.isTNB
    })
    if (this.data.isTNB) {
      wx.setNavigationBarTitle({
        title: '糖尿病患者食谱'
      })
    }
    app.$http({
      url: "/api/HealthyDiet/GetMenuDietDetail",
      type: "get",
      data: {
        id: data.keyid
      },
      success: data => {
        console.log(data);
        if (!data.Data) {
          return;
        }
        this.setData({
          listArr: data.Data
        })
      },
      error: error => {}
    });
  }
})