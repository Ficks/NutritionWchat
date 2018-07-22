const app = getApp();
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function http(params) {
  wx.request({
    url: app.globalData.URL + params.url,
    data: params.data,
    method: params.type,
    success: function (res) {
      console.log('返回结果：')
      console.log(res)
      params.success(res);
    },
    error: function () {
      alert('出错')
    }
  })
}
module.exports = {
  formatTime: formatTime,
  http: http
}
