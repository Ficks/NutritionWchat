//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: true,
    listArr: []
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    wx.showToast({
      title: "默认查询本人，如需查询其他人，请更新个人资料",
      icon: 'none'
    })

    app.$http({
      url: "/api/HealthyArchive/GetNutrientStandard",
      type: "get",
      success: data => {
        console.log(data);
        //成功的处理
        if (data.Code == 9005) {
          this.setData({
            userInfo: false
          })
        } else {
          this.setData({
            listArr: data.Data
          });
        }
      },
      error: function () {
        //错误处理
      }
    });
  }
})