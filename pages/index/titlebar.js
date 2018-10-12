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
  }
})
