//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    search: {
      qType: 1,
      pageNum: 1,
      pageSize: 100,
    },
    listArr: []
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (data) {
    if (data.type == 2) {
      wx.setNavigationBarTitle({
        title: "自我评估"
      })
    }
    this.setData({
      'search.qType': data.type
    })

    app.$http({
      url: "/api/Questionnaire/GetQuestionnaireList",
      type: "get",
      data: this.data.search,
      success: data => {
        console.log(data)
        this.setData({
          listArr: data.Data
        })
      },
      error() {}
    });
  }
})