//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    timer: null,
    motto: 'Hello World',
    score: 0,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    tabBar: 0,
    signIn: false,
    share: false,
    isTNB: "",
    listArr: [],
    dietRecommendKey: '',
    navShow: false,
    routers: [{
        name: '基本工具',
        url: '/pages/tool/index',
        icon: 'jbgj'
      },
      {
        name: '膳食调配',
        url: '',
        icon: 'sstp'
      },
      {
        name: '膳食评估',
        url: '',
        icon: 'sspg'
      },
      {
        name: '自我评估',
        url: '',
        icon: 'zwpg'
      },
      {
        name: '走进我们',
        url: '',
        icon: 'zjwm'
      },
      {
        name: '合作伙伴',
        url: '',
        icon: 'hzhb'
      }
    ]
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }



    this.httpAjax();
  },
  hideNav() {
    // 关闭
    this.setData({
      navShow: false
    })
  },
  showNav() {
    // 显示菜单
    this.setData({
      navShow: true
    })
  },
  httpAjax() {
    this.isTNBFn(); //获取是否签到数据和是否糖尿病以及健康数据
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  // 判断是否糖尿病患者
  isTNBFn() {
    var that = this;
    app.$http({
      url: "/api/HealthyArchive/GetPersonalHealthyScore",
      type: "get",
      success: data => {
        if (data.Data.issign) {
          this.setData({
            signIn: true
          })
        }
        this.setData({
          score: data.Data.score
        })
        //糖尿病
        this.setData({
          isTNB: data.Data.isdiabetes
        })


        this.dietRecommend(); //获取膳食推荐
      }
    });
  },
  toSearch() {
    // 跳转到搜索页面
    wx.navigateTo({
      url: "/pages/tool/searchList/index?dishesType=1"
    })
  },
  // 早中晚餐切换
  tabBarFn(event) {
    let data = event.target.dataset;
    this.setData({
      tabBar: data.val
    })
  },
  // 签到
  signInFn() {
    if (this.data.signIn) {
      wx.showToast({
        title: "已经签到了",
        icon: "none"
      })
    } else {
      app.$http({
        url: "/api/User/Sign",
        type: "get",
        success: data => {

          wx.showToast({
            title: "今日签到成功，奖励积分（+" + data.Data + "）",
            icon: 'none'
          })
          this.setData({
            signIn: true
          });
        },
        error: error => {}
      });
    }
  },
  dietRecommend() {
    // 请求推荐数据
    app.$http({
      url: "/api/HealthyDiet/GetRecommendMenu",
      type: "get",
      success: data => {
        if (!data.Data) {
          return;
        }
        this.setData({
          listArr: data.Data.Value,
          dietRecommendKey: data.Data.Key
        })
        // this.recommendData = data.Data.Value;
        // console.log("查看如果是糖尿病用户的数据");
        // this.KeyId = data.Data.Key;
        // this.$nextTick(() => {
        // this.$refs.scrollerBottom.reset();
        // });


      },
      error: error => {}
    });
  },
  toDetails() {
    // 进入推荐膳食页面
    wx.navigateTo({
      url: "/pages/recommend/index?keyid=" + this.data.dietRecommendKey + "&isTNB=" + this.data.isTNB
    })
  },
  // 分享
  shareFn() {
    this.setData({
      share: true
    })
  },
  // 取消分享
  shareHide() {
    this.setData({
      share: false
    })
  }
})