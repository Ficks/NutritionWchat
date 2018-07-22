//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    loading: false,
    food: '',
    search: {
      loading: false,
      loadingTxt: "滑动加载更多",
      dishName: "",
      pageNum: 1,
      pageSize: 10,
      dishesType: '',
    },
    second_height: "",
    listArr: [],
    url: app.globalData.URL
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (data) {
    this.setData({
      'search.dishesType': parseInt(data.dishesType) || "",
      food: parseInt(data.food) || "",
    })
    this.getXtInfo();
    this.getList(true);
  },
  getXtInfo() {
    var that = this
    // 获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        // 可使用窗口宽度、高度
        // console.log('height=' + res.windowHeight);
        // console.log('width=' + res.windowWidth);
        // 计算主体部分高度,单位为px
        that.setData({
          // second部分高度 = 利用窗口可使用高度 - first部分高度（这里的高度单位为px，所有利用比例将300rpx转换为px）
          second_height: res.windowHeight - 38
        })
      }
    })
  },
  searchInput(data) {
    this.setData({
      'search.dishName': data.detail.value
    })
  },
  onSearch() {
    console.log("本次搜索")
    console.log(this.data.search.dishName)
    this.setData({
      'search.loading': false,
      'search.pageNum': 1,
      listArr: []
    })
    this.getList(true)
  },
  toDetails(data) {
    var d = data.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/tool/searchList/details/index?id=${d.detailsId}&src=${d.detailsSrc}&type=${d.detailsType}&food=${this.data.food}`
    })
  },
  getList(time) {
    if (this.data.search.loading) {

    } else {
      wx.showLoading({
        title: '正在加载中',
        mask: true
      })
      time = time === true ? 1 : 800;
      this.setData({
        'search.loading': true,
        'search.loadingTxt': "正在加载中···"
      })
      setTimeout(() => {
        app.$http({
          url: "/api/HealthyDiet/GetDishesList",
          type: "get",
          data: this.data.search,
          success: data => {
            console.log(data);
            //成功的处理
            this.yes(data.Data);
          }
        });
      }, time);
    }
  },
  yes(data) {
    if (data.length < 0) {
      this.setData({
        'search.loadingTxt': "没有更多数据了"
      })
      return;
    }
    for (let i = 0; i < data.length; i++) {
      data[i].desc = this.removeHTMLTag(data[i].desc);
    }
    this.setData({
      'search.pageNum': this.data.search.pageNum + 1,
      listArr: this.data.listArr.concat(data),
      'search.loading': false,
      'search.loadingTxt': "滑动加载更多"
    })
    wx.hideLoading();
    if (data.length < 10) {
      this.setData({
        'search.loadingTxt': "没有更多数据了"
      })
    }
  },
  removeHTMLTag(str) {
    var str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
    str = str.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
    //str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
    str = str.replace(/ /ig, ''); //去掉 
    return str;
  }
})