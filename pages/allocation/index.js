//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    routers: [{
        name: '正常人膳食',
        url: '/pages/allocation/details/index?type=1',
        icon: 'zcr'
      },
      {
        name: '婴幼儿膳食',
        url: '/pages/allocation/details/index?type=2',
        icon: 'yye'
      }, {
        name: '儿童及青春期膳食',
        url: '/pages/allocation/details/index?type=3',
        icon: 'et'
      }, {
        name: '老年人膳食',
        url: '/pages/allocation/details/index?type=4',
        icon: 'lnr'
      }, {
        name: '孕妇及乳母膳食',
        url: '/pages/allocation/details/index?type=5',
        icon: 'yf'
      }, {
        name: '素食者膳食',
        url: '/pages/allocation/details/index?type=6',
        icon: 'ssz'
      }, {
        name: '疾病及职业膳食',
        url: '/pages/allocation/details/index?type=7',
        icon: 'jb'
      }, {
        name: '家庭配餐',
        url: '/pages/allocation/details/index?type=8',
        icon: 'jtpc'
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

  }
})