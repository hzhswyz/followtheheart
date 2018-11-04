// pages/pay/pay.js
const app = getApp();
var pay_info;
var pageobject;
var rurl = app.globalData.requestdomainname;
var durl = app.globalData.dynamicrequest;
var store_food_map = app.globalData.store_food_map;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标
      title: '随心菜单', //导航栏 中间的标题
      navbackground: "white"
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    pageobject = this;
    let payinfo = JSON.parse(options.payinfo);
    pay_info = payinfo;
    wx.setNavigationBarTitle({
      title: "向 "  + payinfo.store.name + " 支付"
    })
    this.setData({
      payinfo: payinfo,
      nvabarData: {
        showCapsule: 1, //是否显示左上角图标
        title: "向 " + payinfo.store.name + " 支付", //导航栏 中间的标题
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  confirmpayment: function () {
    wx.request({
      url: durl + "/MainController/paymentorder?orderid=" + pay_info.orderid,
      data: { format: "json" },
      success: function (res) {
        console.log(res.data.pageList)
        if (res.data.pageList.code==1){
          console.log("支付成功")
          pay_info.state = res.data.pageList.state;
          var d = new Date(res.data.pageList.paymenttime);
          var date = (d.getFullYear()) + "-" +
            (d.getMonth() + 1) + "-" +
            (d.getDate()) + " " +
            (d.getHours()) + ":" +
            (d.getMinutes()) + ":" +
            (d.getSeconds());
          pay_info.paymenttime = date;
          pageobject.setData({
            payinfo: pay_info
          })
          console.log("将餐馆" + pay_info.store.id +"内的点餐列表删除");
          store_food_map.delete(pay_info.store.id);
        }
        else{
          console.log("支付失败")
        }
      },
      fail: function () {
        console.log("支付失败")
      }
    })
  },
  revieworder: function(){
    wx.redirectTo({
      url: "../order/orderdetails?orderid=" + pay_info.orderid
    })
  }
})