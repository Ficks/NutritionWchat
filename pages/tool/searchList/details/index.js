var that;
var deltaX = 0;
var minValue = 0;
var app = getApp();
Page({
  data: {
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
    that = this;
    // 绘制标尺
    that.drawRuler();
    // 绘制三角形游标
    that.drawCursor();
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
          type: this.data.food
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
            wx.navigateBack({
              delta: 2
            })
            console.log('gogogo1111')
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
  // 下面是刻度尺
  drawRuler: function () {

    /* 1.定义变量 */

    // 1.1 定义原点与终点，x轴方向起点与终点各留半屏空白
    var origion = {
      x: app.screenWidth / 2,
      y: that.data.canvasHeight
    };
    var end = {
      x: app.screenWidth / 2,
      y: that.data.canvasHeight
    };
    // 1.2 定义刻度线高度
    var heightDecimal = 50;
    var heightDigit = 25;
    // 1.3 定义文本标签字体大小
    var fontSize = 20;
    // 1.4 最小刻度值
    // 已经定义在全局，便于bindscroll访问
    // 1.5 总刻度值
    var maxValue = 1000;
    // 1.6 当前刻度值
    var currentValue = 0;
    // 1.7 每个刻度所占位的px
    var ratio = 10;
    // 1.8 画布宽度
    var canvasWidth = maxValue * ratio + app.screenWidth - minValue * ratio;
    // 设定scroll-view初始偏移
    that.setData({
      canvasWidth: canvasWidth,
      scrollLeft: (currentValue - minValue) * ratio
    });

    /* 2.绘制 */

    // 2.1初始化context
    const context = wx.createCanvasContext('canvas-ruler');
    // 遍历maxValue
    for (var i = 0; i <= maxValue; i++) {
      context.beginPath();
      // 2.2 画刻度线
      context.moveTo(origion.x + (i - minValue) * ratio, origion.y);
      // 画线到刻度高度，10的位数就加高
      context.lineTo(origion.x + (i - minValue) * ratio, origion.y - (i % ratio == 0 ? heightDecimal : heightDigit));
      // 设置属性
      context.setLineWidth(2);
      // 10的位数就加深
      context.setStrokeStyle(i % ratio == 0 ? 'gray' : 'darkgray');
      // 描线
      context.stroke();
      // 2.3 描绘文本标签
      context.setFillStyle('gray');
      if (i % ratio == 0) {
        context.setFontSize(fontSize);
        // 为零补一个空格，让它看起来2位数，页面更整齐
        context.fillText(i == 0 ? ' ' + i : i, origion.x + (i - minValue) * ratio - fontSize / 2, fontSize);
      }
      context.closePath();
    }

    // 2.4 绘制到context
    context.draw();
  },
  drawCursor: function () {
    /* 定义变量 */
    // 定义三角形顶点 TODO x
    var center = {
      x: app.screenWidth / 2,
      y: 5
    };
    // 定义三角形边长
    var length = 15;
    // 左端点
    var left = {
      x: center.x - length / 2,
      y: center.y + length / 2 * Math.sqrt(3)
    };
    // 右端点
    var right = {
      x: center.x + length / 2,
      y: center.y + length / 2 * Math.sqrt(3)
    };
    // 初始化context
    const context = wx.createCanvasContext('canvas-cursor');
    context.moveTo(center.x, center.y);
    context.lineTo(left.x, left.y);
    context.lineTo(right.x, right.y);
    // fill()填充而不是stroke()描边，于是省去手动回归原点，context.lineTo(center.x, center.y);
    context.setFillStyle('#717171');
    context.fill();
    context.draw();
  },
  bindscroll: function (e) {
    // deltaX 水平位置偏移位，每次滑动一次触发一次，所以需要记录从第一次触发滑动起，一共滑动了多少距离
    deltaX += e.detail.deltaX;
    var value = (-deltaX / 10 + minValue);
    if (value < 0.01) {
      value = 0;
    } else if (value >= 1000.0) {
      value = 1000.0;
    }

    if (that.data.value != 0) {
      var l = that.data.value / 50;
      l = l.toString();
      if (l.indexOf('.') !== -1) {
        l = l.substr(0, l.indexOf('.') + 3);
      }
    } else {
      l = 0;
    }
    // 数据绑定
    that.setData({
      value: value,
      lian: l
    });
    // console.log(deltaX)
  },
  removeHTMLTag(str) {
    var str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
    str = str.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
    //str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
    str = str.replace(/ /ig, ''); //去掉 
    return str;
  }
});