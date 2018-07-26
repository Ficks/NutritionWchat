//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    yue: 0,
    kcal: '',
    selectShow: {
      'sex': false,
      'llsp': false,
      'yfxx': false,
      'yue': false,
      'Age': false,
      'Weight': false,
      'Height': false,
    },
    ajaxData: {
      Height: 0,
      Weight: 0,
      Age: 0,
      Gender: 0,
      LaborLevel: 0,
      PregPeriod: ''
    }
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {

  },
  setSelectData(val) {
    var v = val;
    if (this.data.kdc.valKey == 'Height') {
      this.setData({
        'ajaxData.Height': val,
      });
    } else if (this.data.kdc.valKey == 'Weight') {
      this.setData({
        'ajaxData.Weight': val,
      });
    } else {
      v = parseInt(val)
      this.setData({
        'ajaxData.Age': v,
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
    if (key == 'sex') {
      this.setData({
        'selectShow.sex': val
      })
    } else if (key == 'llsp') {
      this.setData({
        'selectShow.llsp': val
      })
    } else if (key == 'yue') {
      this.setData({
        'selectShow.yue': val,
        'selectShow.Age': false,
      })
    } else if (key == 'Age') {
      this.setData({
        'selectShow.Age': val,
      })
    } else if (key == 'Weight') {
      this.setData({
        'selectShow.Weight': val,
      })
    } else if (key == 'Height') {
      this.setData({
        'selectShow.Height': val,
      })
    } else {
      this.setData({
        'selectShow.yfxx': val
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
    if (key == 'sex') {
      this.setData({
        'ajaxData.Gender': val
      })
    } else if (key == 'llsp') {
      this.setData({
        'ajaxData.LaborLevel': val
      })
    } else if (key == 'yue') {
      this.setData({
        yue: val
      })
    } else {
      this.setData({
        'ajaxData.PregPeriod': val
      })
    }
  },
  search() {
    for (let i in this.data.ajaxData) {
      if (this.data.ajaxData[i] == 0) {
        if (this.data.ajaxData.Gender != '1' || (this.data.yue == '' && this.data.ajaxData.Age == 0)) {
          wx.showToast({
            title: "请完成选项后查询",
            icon: 'none'
          })
          return;
        }
      }
    }

    var d = JSON.stringify(this.data.ajaxData);
    d = JSON.parse(d);
    if (d.Age == 0) {
      d.Age = this.data.yue / 12;
    }
    if (d.Gender == 1) {
      d.PregPeriod = 0;
    }
    console.log(d.Age)
    app.$http({
      url: "/api/HealthyArchive/CalKcalNeed",
      type: "post",
      data: JSON.stringify(d),
      success: data => {
        console.log(data);
        this.setData({
          kcal: data.Data
        })
      },
      error: error => {}
    });
  },
  setVal(e) {
    let key = e.currentTarget.dataset.key;
    let val = e.detail.value;

    if (key == 'Age') {
      this.setData({
        yue: 0,
        'ajaxData.Age': val
      })
    } else if (key == 'Height') {
      this.setData({
        'ajaxData.Height': val
      })
    } else if (key == 'Weight') {
      this.setData({
        'ajaxData.Weight': val
      })
    }
  }
})