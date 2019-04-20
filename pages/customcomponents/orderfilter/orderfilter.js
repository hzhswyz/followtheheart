// pages/customcomponents/orderfilter/orderfilter.js
var utils = require('../../../utils/util.js');
var filtercondition = {};
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    filterheight: { type: Number },
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },
  
  ready() {
    filtercondition = {};
    var d = new Date();
    var date = (d.getFullYear()) + "-" + (d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1)
    filtercondition.time = date;
    this.setData({
      filtercondition: filtercondition,
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    timechange:function(event){
      const myEventDetail = event.detail // detail对象，提供给事件监听函数
      const myEventOption = {} // 触发事件的选项
      filtercondition.time = event.detail.value;
      myEventDetail.filtercondition = filtercondition;
      this.setData({
        filtercondition: filtercondition,
      })
      this.triggerEvent('filterchange', myEventDetail, myEventOption)
    },
    formSubmit:function(event){
      const myEventDetail = event.detail // detail对象，提供给事件监听函数
      const myEventOption = {} // 触发事件的选项
      filtercondition = event.detail.value;
      myEventDetail.filtercondition = filtercondition;
      this.setData({
        filtercondition: filtercondition,
      })
      this.triggerEvent('filterchange', myEventDetail, myEventOption)
    }
  }
})
