//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    date: app.getDate(0),
    listArr: [],
    mealArr: []
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    app.$http({
      url: "/api/HealthyArchive/GetDailyNutrientIntakeAndMealRatio",
      type: "get",
      data: {},
      success: data => {
        //成功的处理
        console.log(data);
        this.setArr(data.Data);
      },
      error: function () {
        //错误处理
      }
    });
  },
  getBfb(item) {
    if (item.totalVal == 0 || item.spedVal == 0) {
      return 0;
    }
    var num = parseFloat(item.spedVal) / parseFloat(item.totalVal) * 100;
    num = num.toString();
    if (num.indexOf(".") !== -1) {
      num = num.substring(0, num.indexOf(".") + 2);
    } else {
      num = num
    }
    return num;
  },
  spedValTo(n) {
    var num = n.toString();
    if (num.indexOf(".") !== -1) {
      num = num.substring(0, num.indexOf(".") + 2);
    } else {
      num = num
    }
    return num;
  },
  getCg(item) {
    var num = item - 100;
    // var ns = Math.round(num * Math.pow(10, 2)) / Math.pow(10, 2);
    num = num.toString();
    if (num.indexOf(".") !== -1) {
      num = num.substring(0, num.indexOf(".") + 2);
    } else {
      num = num
    }
    return "超过" + num + "%";
  },
  setArr(data) {
    let listArr = data.nutrient;
    let mealArr = data.meal;
    for (let i = 0; i < listArr.length; i++) {
      var v = listArr[i];
      v.bfb = this.getBfb(v);
      v.spedVal = this.spedValTo(v.spedVal)
      if (v.bfb > 100) {
        v.bfbc = this.getCg(v.bfb);
      }
    }
    for (let i = 0; i < mealArr.length; i++) {
      var v = mealArr[i];
      v.bfb = this.getBfb(v);
      if (v.bfb > 100) {
        v.bfbc = this.getCg(v.bfb);
      }
    }

    this.setData({
      listArr: listArr,
      mealArr: mealArr
    })
  }
})