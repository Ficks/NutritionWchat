//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    routers: [{
        name: '菜谱检索',
        url: '/pages/tool/searchList/index?dishesType=1',
        icon: 'cpjs'
      },
      {
        name: '食材检索',
        url: '/pages/tool/searchList/index?dishesType=3',
        icon: 'scjs'
      },
      {
        name: '其他食品检索',
        url: '/pages/tool/searchList/index?dishesType=2',
        icon: 'qtsp'
      },
      {
        name: '卡路里需求计算',
        url: '/pages/tool/calorieCalculation/index',
        icon: 'kll'
      },
      {
        name: '营养素需求查询',
        url: '/pages/tool/nutrientRequirement/index',
        icon: 'yys'
      },
      {
        name: '运动耗能查询',
        url: '/pages/tool/motionEnergyQuery/index',
        icon: 'ydhn'
      },
      {
        name: '营养素知识',
        url: '/pages/tool/nutrientKnowledge/index',
        icon: 'yyszs'
      },
      {
        name: '饮食分量参考',
        url: '/pages/allocation/details/index?type=11',
        icon: 'ysfl'
      },
      {
        name: '体重标准查询',
        url: '/pages/tool/weightQuery/index',
        icon: 'tzbz'
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