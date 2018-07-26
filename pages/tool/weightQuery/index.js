//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    tips: '',
    bmi: 0,
    ajaxData: {
      Height: 0,
      Weight: 0
    },
    selectShow: {
      'Weight': false,
      'Height': false,
    },
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {},
  search() {
    for (let i in this.data.ajaxData) {
      if (this.data.ajaxData[i] == 0) {
        wx.showToast({
          title: '请完成选项后查询',
          icon: 'none'
        })
        return;
      }
    }
    app.$http({
      url: "/api/HealthyArchive/CalBMI",
      type: "post",
      data: this.data.ajaxData,
      success: data => {
        //成功的处理
        var tips = '';
        if (data.Data <= 18.4) {
          tips = "BMI偏瘦，亲需要多吃点~";
        } else if (this.data.bmi >= 18.5 && this.data.bmi < 23.9) {
          tips = "BMI正常，真棒~";
        } else if (this.data.bmi >= 24.0 && this.data.bmi < 27.9) {
          tips = "BMI偏高了，亲需要加强锻炼哦~";
        } else {
          tips = "BMI冲出云端了，亲需要加强锻炼并减肥哦~";
        }
        this.setData({
          tips: tips,
          bmi: data.Data
        })
      },
      error: function () {
        //错误处理
      }
    });
  },
  showSelectOpen(e) {
    var key = e.currentTarget.dataset.key;
    this.offShowSelect(key, true);
  },
  offShowSelect(key, val) {
    if (key == 'Weight') {
      this.setData({
        'selectShow.Weight': val,
      })
    } else if (key == 'Height') {
      this.setData({
        'selectShow.Height': val,
      })
    }
  },
  hideSelect(e) {
    var key = e.currentTarget.dataset.key;
    this.offShowSelect(key, false);
  },
  setVal(e) {
    let key = e.currentTarget.dataset.key;
    let val = e.detail.value;
    if (key == 'Height') {
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