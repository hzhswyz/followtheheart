// pages/index/navigationbar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    titlearray: {
      type: Array
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    customMethod: function () { },
    clickorder: function () {
      wx.scanCode({
        success: (res) => {
          console.log(res)
        }
      })
    },
    clickmanage: function (event) {
      wx.navigateTo({
        url: '../manage/manage'
      })
    },
    clickactivity: function (event) {
      wx.navigateTo({
        url: '../activity/activity'
      })
    },
    clickreservation: function (event){
      wx.navigateTo({
        url: '../reservation/reservation'
      })
    },
    clicknearbyshop: function (event) {
      wx.navigateTo({
        url: '../nearbyshop/nearbyshop'
      })
    }
  }
})
