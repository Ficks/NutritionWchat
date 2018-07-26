//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    date: app.getDate(0),
    kdc: {
      show: false,
      value: 0,
    },
    canvasHeight: 80,
    maxValue: {
      Height: 210,
      Weight: 150,
    },
    search: {
      name: "",
      pageNum: 1,
      pageSize: 100
    },
    listArr: [],
    addData: {
      id: '',
      min: 0
    },
    iten: 0,
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
      url: "/api/HealthyArchive/GetSportsItemList",
      type: "get",
      data: this.data.search,
      success: data => {
        console.log(data);
        this.setData({
          listArr: data.Data.Data
        })
      }
    });
  },
  select(d) {
    var id = d.currentTarget.dataset.id;
    var iten = d.currentTarget.dataset.iten;
    this.setData({
      'addData.id': id,
      'kdc.show': true,
      iten: iten,
      'addData.min': this.data.kdc.value
    })
  },
  submitAdd() {
    console.log(this.data.addData)
    this.setData({
      'addData.min': this.data.kdc.value
    })
    app.$http({
      url: "/api/HealthyArchive/AddTodaySports",
      type: "post",
      data: JSON.stringify(this.data.addData),
      success: data => {
        if (data.Code === 20000) {
          wx.showToast({
            'title': '添加成功'
          })
        }
        this.hideKdcSelect();
      }
    });
  },
  hideKdcSelect() {
    this.setData({
      'kdc.show': false
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
  },
  setVal(e) {
    let val = e.detail.value;
    this.setData({
      'kdc.value': val
    })
  }
})