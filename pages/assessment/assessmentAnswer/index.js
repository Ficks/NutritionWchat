//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    listArr: [],
    ajaxData: {
      id: ''
    },
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (data) {
    this.setData({
      'ajaxData.id': data.id
    })

    app.$http({
      url: "/api/Questionnaire/GetQuestionsAndOptions",
      type: "get",
      data: {
        id: this.data.ajaxData.id
      },
      success: data => {
        console.log(data)
        this.setData({
          listArr: data.Data
        })
      },
      error() {}
    });
  },
  radioChange(d) {
    var row = d.currentTarget.dataset.index;
    var val = d.detail.value;
    console.log(d);
    var arr = [];
    for (let i = 0; i < this.data.listArr.length; i++) {
      arr.push(this.data.listArr[i]);
    }
    arr[row].row = val;

    this.setData({
      listArr: arr
    })
  },
  submit() {
    var arr = this.data.listArr;
    var d = {
      id: this.data.ajaxData.id,
      optionlist: []
    }
    var dr = d.optionlist;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].row === undefined) {
        wx.showToast({
          icon: 'none',
          title: '请完成所有答题'
        })
        return;
      } else {
        dr[i] = {
          questionid: arr[i].id,
          optionid: arr[i].arr[arr[i].row].id,
          score: arr[i].arr[arr[i].row].fraction
        }
      }
    }

    app.$http({
      url: "/api/Questionnaire/SubmitQuestionnaire",
      type: "post",
      data: d,
      success: data => {
        console.log(data)
        wx.navigateTo({
          url: `/pages/assessment/assessmentResult/index?text=${data.Data.Description}&jf=${data.Data.GainJF}&df=${data.Data.Score}`,
        })
      },
      error() {}
    });
  }
})