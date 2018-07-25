//index.js
//获取应用实例
var that;
var deltaX = 0;
var minValue = 0;
var maxValue = 210;
const app = getApp()

Page({
  data: {
    yue: 0,
    kcal: '',
    kdc: {
      show: false,
      name: "身高",
      dw: "cm",
      value: 0,
      valKey: '',
    },

    selectShow: {
      'sexvalue': false,
      'llspid': false,
      'ysxhid': false,
      'hyzt': false,
      'yue': false,
      'nation': false,
      'occupation': false,
      'marriage': false, //婚姻
      'education': false, //教育
      'familyincome': false, //收入
    },
    canvasHeight: 80,
    ajaxData: {
      id: '',
      name: '',
      sexvalue: '',
      age: '',
      height: '',
      weight: '',
      hyzt: '',
      bankaccount: '',
      nation: '', //民族
      occupation: '', //职业
      marriage: '', //婚姻
      education: '', //教育
      familyincome: '', //收入
      jbsid: '',
      jbsname: '',
      ysxhid: '',
      llspid: '',

      khh: '',
      khr: '',
      yhzh: ''
    },
    maxValue: {
      height: 210,
      weight: 150,
      age: 110
    },
    kdcDwArr: {
      height: 'cm',
      weight: 'kg',
      age: '岁'
    }
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onShow: function () {
    var that = this;
    // 如果是从疾病史返回来的
    wx.getStorage({
      key: 'disease',
      success(res) {
        if (res.data.state) {
          that.setData({
            'ajaxData.jbsid': res.data.id,
            'ajaxData.jbsname': res.data.name
          })
          wx.setStorage({
            key: 'disease',
            data: {
              id: '',
              name: '',
              state: false
            }
          })
        }
      }
    })
    // 如果是从疾病史返回来的
    wx.getStorage({
      key: 'gmsw',
      success(res) {
        if (res.data) {
          that.getUserInfo();
          wx.setStorage({
            key: 'gmsw',
            data: false
          })
        }
      }
    })
  },
  onLoad: function () {
    that = this;
    this.getUserInfo()
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
    that.setSelectData(value);
  },
  setSelectData(val) {
    var v = val;
    if (this.data.kdc.valKey == 'height') {
      this.setData({
        'ajaxData.height': val,
      });
    } else if (this.data.kdc.valKey == 'weight') {
      this.setData({
        'ajaxData.weight': val,
      });
    } else {
      v = parseInt(val)
      this.setData({
        'ajaxData.age': v,
      });
    }
    this.setData({
      'kdc.value': v,
    });
  },
  // 关闭刻度尺
  hideKdcSelect() {
    this.setData({
      'kdc.show': false,
    })
  },
  showSelectOpen(e) {
    var key = e.currentTarget.dataset.key;
    this.offShowSelect(key, true);
  },
  offShowSelect(key, val) {
    if (key == 'sexvalue') {
      this.setData({
        'selectShow.sexvalue': val
      })
    } else if (key == 'llspid') {
      this.setData({
        'selectShow.llspid': val
      })
    } else if (key == 'nation') {
      this.setData({
        'selectShow.nation': val
      })
    } else if (key == 'ysxhid') {
      this.setData({
        'selectShow.ysxhid': val
      })
    } else if (key == 'yue') {
      this.setData({
        'selectShow.yue': val,
        'kdc.show': false,
      })
    } else if (key == 'occupation') {
      this.setData({
        'selectShow.occupation': val
      })
    } else if (key == 'marriage') {
      this.setData({
        'selectShow.marriage': val
      })
    } else if (key == 'education') {
      this.setData({
        'selectShow.education': val
      })
    } else if (key == 'familyincome') {
      this.setData({
        'selectShow.familyincome': val
      })
    } else {
      this.setData({
        'selectShow.hyzt': val
      })
    }
  },
  hideSelect(e) {
    var key = e.currentTarget.dataset.key;
    this.offShowSelect(key, false);
  },
  selectXz(e) {
    var key = e.currentTarget.dataset.key;
    var val = e.currentTarget.dataset.val;
    this.setSelectVal(key, val);
    this.offShowSelect(key, false);
  },
  setSelectVal(key, val) {
    if (key == 'sexvalue') {
      this.setData({
        'ajaxData.sexvalue': parseInt(val)
      })
    } else if (key == 'llspid') {
      this.setData({
        'ajaxData.llspid': parseInt(val)
      })
    } else if (key == 'nation') {
      this.setData({
        'ajaxData.nation': val
      })
    } else if (key == 'ysxhid') {
      this.setData({
        'ajaxData.ysxhid': parseInt(val)
      })
    } else if (key == 'yue') {
      this.setData({
        yue: parseInt(val)
      })
    } else if (key == 'occupation') {
      this.setData({
        'ajaxData.occupation': val,
      })
    } else if (key == 'marriage') {
      this.setData({
        'ajaxData.marriage': val,
      })
    } else if (key == 'education') {
      this.setData({
        'ajaxData.education': val,
      })
    } else if (key == 'familyincome') {
      this.setData({
        'ajaxData.familyincome': val,
      })
    } else {
      this.setData({
        'ajaxData.hyzt': parseInt(val)
      })
    }
  },
  select(e) {
    var val = e.currentTarget.dataset.op;
    // 刻度尺选择
    minValue = 0;
    maxValue = this.data.maxValue[val];
    if (val == 'height') {
      this.setData({
        'kdc.name': "身高",
        'kdc.dw': 'cm'
      });
    } else if (val == 'weight') {
      this.setData({
        'kdc.name': '体重',
        'kdc.dw': 'kg'
      });
    } else {
      this.setData({
        'kdc.name': '年龄',
        'kdc.dw': '岁'
      });
    }
    this.setData({
      'kdc.valKey': val,
      'kdc.show': true,
      'kdc.dw': this.data.kdcDwArr[val],
      'kdc.value': this.data.ajaxData[val]
    })


    // 绘制标尺
    that.drawRuler();
    // 绘制三角形游标
    that.drawCursor();
    return;
  },
  editInput(e) {
    console.log(e)
    var key = e.currentTarget.dataset.key;
    var val = e.detail.value;

    console.log(key, val)
    if (key == 'name') {
      this.setData({
        'ajaxData.name': val
      })
    } else if (key == 'khh') {
      this.setData({
        'ajaxData.khh': val
      })
    } else if (key == 'khr') {
      this.setData({
        'ajaxData.khr': val
      })
    } else if (key == 'yhzh') {
      this.setData({
        'ajaxData.yhzh': val
      })
    }
  },
  submitEdit() {
    var d = JSON.stringify(this.data.ajaxData);
    d = JSON.parse(d);

    d.bankaccount = `${this.data.ajaxData.khh}-${this.data.ajaxData.khr}-${this.data.ajaxData.yhzh}`
    app.$http({
      url: "/api/HealthyArchive/UpdatePersonalHealthyArchive",
      type: "post",
      data: d,
      success: data => {
        //成功的处理
        console.log(data);
        wx.showToast({
          title: "保存成功"
        })
        wx.navigateBack()
      },
      error: function () {
        //错误处理
      }
    });
  },
  getUserInfo() {
    app.$http({
      url: '/api/HealthyArchive/GetPersonalHealthyArchive',
      type: "get",
      data: {},
      success: data => {
        //成功的处理
        data.Data.khh = '';
        data.Data.khr = '';
        data.Data.yhzh = '';
        var arr = data.Data.bankaccount;
        if (arr.indexOf('-') != -1) {
          arr = arr.split('-');
          data.Data.khh = arr[0];
          data.Data.khr = arr[1];
          data.Data.yhzh = arr[2];
        }
        data.Data.nation = parseInt(data.Data.nation)
        this.setData({
          ajaxData: data.Data
        })
      },
      error: function () {
        //错误处理
      }
    });
  },
  removeGmsw(e) {
    let id = e.currentTarget.dataset.id
    let name = e.currentTarget.dataset.name
    console.log(e);
    // 删除过敏食物
    wx.showModal({
      title: '提示',
      content: '是否删除"' + name + '"',
      success: res => {
        if (res.confirm) {
          app.$http({
            url: "/api/HealthyDiet/DeleteAllergyFood",
            type: "post",
            data: {
              id: id
            },
            success: data => {
              wx.showToast({
                title: "删除成功"
              })
              var arr = [];
              for (let i = 0; i < this.data.ajaxData.alleryarr.length; i++) {
                if (this.data.ajaxData.alleryarr[i].name != name) {
                  arr.push(this.data.ajaxData.alleryarr[i])
                }
              }
              this.setData({
                'ajaxData.alleryarr': arr
              })
            },
            error: error => { }
          });
        }
      }
    })
  },
  goGmsw() {
    wx.showModal({
      title: '提示',
      content: '请先保存当前修改，跳转后资料会丢失',
      cancelText: '先去保存',
      confirmText: '去添加',
      confirmColor: '#f00',
      success: res => {
        if (res.confirm) {
          wx.navigateTo({
            url: "/pages/tool/searchList/index?dishesType=1&gmsw=true"
          })
        }
      }
    })
  }
})