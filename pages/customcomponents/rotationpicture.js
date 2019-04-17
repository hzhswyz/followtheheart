// pages/customcomponents/rotationpicture.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    swiperarray: {type: Array},
  },

  /**
   * 组件的初始数据
   */
  data: {
    swipercurrentindex : 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changswiperindex: function (event) {
      this.setData({
        swipercurrentindex: event.detail.current
      })
    },
    clickswiper: function (event) {
      const myEventDetail = event.currentTarget.dataset.swipercurrentindex // detail对象，提供给事件监听函数
      const myEventOption = {} // 触发事件的选项
      this.triggerEvent('clickswiper', myEventDetail, myEventOption)
    },
  }
})
