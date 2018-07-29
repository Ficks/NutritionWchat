var app = getApp();
Page({
  data: {
    ht: app.screenHeight,
    value: 0,
    canvasHeight: 80,
    lian: 0,
    date: app.getDate(0),
    show: false,
    src: '',
    type: '',
    food: '',
    foodName: '',
    gmsw: false,
    foodArr: ['早餐', '中餐', '晚餐'],
    details: {},
    api: '/api/HealthyDiet/AddToTodaysDiet',
    ajaxData: {},
  },

  onLoad: function (options) {
    this.details(options);
  },
  details(data) {
    var title = '';
    this.setData({
      'ajaxData.id': data.id
    })
    if (data.gmsw == 'true') {
      this.setData({
        gmsw: true
      })
      title = '过敏食物添加';
      this.setData({
        api: '/api/HealthyDiet/AddToAllergyFood',
        ajaxData: {
          id: data.id
        }
      })
    } else {
      if (data.type == 1) {
        title = '食谱大全';
      } else if (data.type == 2) {
        title = '其他食品';
      } else if (data.type == 3) {
        title = '食材大全';
      } else {
        title = '过敏食物添加';
        this.setData({
          api: '/api/HealthyDiet/AddToAllergyFood',
          ajaxData: {
            id: data.id
          }
        })
      }
    }
    wx.setNavigationBarTitle({
      title: title
    })
    this.setData({
      src: data.src,
      type: data.type,
      food: data.food,
      foodName: this.data.foodArr[parseInt(data.food) - 1]
    })

    app.$http({
      url: "/api/HealthyDiet/GetDishesDetail",
      type: "get",
      data: {
        id: data.id
      },
      success: data => {
        console.log(data);
        var d = data.Data;
        d.describe = this.removeHTMLTag(d.describe);
        this.setData({
          details: d
        })
        console.log(this.data.details);
      }
    });
  },
  // 日期改变
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  foodFn(d) {
    var val = d.detail.value
    this.setData({
      food: val + 1,
      foodName: this.data.foodArr[val]
    })
  },
  // 提交
  submitAdd() {
    if (!this.data.gmsw) {
      if (this.data.food == '') {
        wx.showToast({
          title: '请选择餐次',
          icon: 'none'
        });
        return;
      }
      if (this.data.value == 0) {
        wx.showToast({
          title: '请选择食物份量',
          icon: 'none'
        });
        return;
      }
      this.setData({
        ajaxData: {
          id: this.data.ajaxData.id,
          grams: this.data.value,
          type: this.data.food,
          date: this.data.date
        }
      })
    }
    wx.showLoading({
      title: "添加中"
    })

    console.log(this.data.ajaxData)
    app.$http({
      url: this.data.api,
      type: "post",
      data: JSON.stringify(this.data.ajaxData),
      success: data => {
        console.log(data)
        wx.hideLoading();
        this.hideAdd();
        if (data.Code === 20000) {
          //成功的处理
          wx.showToast({
            title: '添加成功'
          });
          if (this.data.gmsw) {
            wx.setStorage({
              key: 'gmsw',
              data: true,
              success() {
                wx.navigateBack({
                  delta: 2
                });
              }
            })
          } else {
            console.log('gogogo')
            wx.navigateTo({
              url: "/pages/dietaryRrecords/index?back=1"
            })
          }
        }
      }
    });
  },
  showAdd() {
    if (this.data.gmsw) {
      this.submitAdd();
      return;
    }
    this.setData({
      show: true
    })
  },
  hideAdd() {
    this.setData({
      show: false
    })
  },
  removeHTMLTag(str) {
    var str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
    str = str.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
    //str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
    str = str.replace(/ /ig, ''); //去掉 
    return str;
  },
  setVal(e) {
    let val = e.detail.value;
    if (val != 0) {
      var l = val / 50;
      l = l.toString();
      if (l.indexOf('.') !== -1) {
        l = l.substr(0, l.indexOf('.') + 3);
      }
    }
    // 数据绑定
    this.setData({
      value: val,
      lian: l
    });
  }
});