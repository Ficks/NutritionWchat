//index.js
//获取应用实例
var that;
var deltaX = 0;
var minValue = 0;
var maxValue = 210;
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
    that = this;
    // 绘制标尺
    that.drawRuler();
    // 绘制三角形游标
    that.drawCursor();
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
    // 数据绑定
    that.setData({
      'kdc.value': parseInt(value),
      'addData.min': parseInt(value)
    })
  },
  // 关闭刻度尺
  hideKdcSelect() {
    this.setData({
      'kdc.show': false,
    })
  },
  select(d) {
    var id = d.currentTarget.dataset.id;
    var iten = d.currentTarget.dataset.iten;
    this.setData({
      'addData.id': id,
      'kdc.show': true,
      iten: iten
    })
  },
  submitAdd() {
    console.log(this.data.addData)
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