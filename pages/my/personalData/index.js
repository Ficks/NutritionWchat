//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    yue: 0,
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
      'age': false,
      'weight': false,
      'height': false,
    },
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
    this.getUserInfo()
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
        'selectShow.age': false,
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
    } else if (key == 'age') {
      this.setData({
        'selectShow.age': val
      })
    } else if (key == 'height') {
      this.setData({
        'selectShow.height': val
      })
    } else if (key == 'weight') {
      this.setData({
        'selectShow.weight': val
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
    if (d.age == 0 && this.data.yue > 0) {
      d.age = this.data.yue / 12;
    }
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
        if (data.Data.age > 0 && data.Data.age < 1) {
          this.setData({
            yue: Math.round(data.Data.age * 12)
          })
          data.Data.age = 0;
        }
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
            error: error => {}
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
  },
  setVal(e) {
    let key = e.currentTarget.dataset.key;
    let val = e.detail.value;

    if (key == 'age') {
      this.setData({
        yue: 0,
        'ajaxData.age': val
      })
    } else if (key == 'height') {
      this.setData({
        'ajaxData.height': val
      })
    } else if (key == 'weight') {
      this.setData({
        'ajaxData.weight': val
      })
    }
  }
})