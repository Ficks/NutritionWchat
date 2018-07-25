//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    search: {
      name: "",
      pageNum: 1,
      pageSize: 100
    },
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
      url: "/api/HealthyArchive/GetDiseaseList",
      type: "get",
      success: data => {
        //成功的处理
        console.log(data);
        this.setData({
          listArr: data.Data.Data
        })
      },
      error: function () {
        //错误处理
      }
    });
  },
  select(d) {
    var id = d.currentTarget.dataset.id;
    var name = d.currentTarget.dataset.name;
    console.log("选择的疾病")
    wx.setStorage({
      key: 'disease',
      data: {
        id: id,
        name: name,
        state: true
      },
      success() {
        wx.navigateBack();
      },
      fail() {
        wx.showToast({
          icon: 'none',
          title: "选择失败"
        })
      }
    })
  },
  searchInput(data) {
    this.setData({
      'search.name': data.detail.value
    })
  },
  onSearch() {
    this.setData({
      'search.pageNum': 1
    })
    this.getList();
  }
})