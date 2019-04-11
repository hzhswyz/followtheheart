// pages/pay/pay.js
const app = getApp();
var pay_info;
var pageobject;
var durl = app.globalData.dynamicrequest;
var userloginJs = require('../../userlogin.js');
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
    height: app.globalData.height * 3,
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
    userloginJs.userloginprocess().then(function () {

      wx.request({
        url: durl + "/order/paymentorder?orderid=" + pay_info.id,
        header: { Cookie: "JSESSIONID=" + app.globalData.session },
        data: { format: "json" },
        success: function (res) {
          if ('Set-Cookie' in res.header) {
            console.log("用户JSESSIONID：", res.header["Set-Cookie"].split(";")[0].split("=")[1]);
            app.globalData.session = res.header["Set-Cookie"].split(";")[0].split("=")[1];
          }
          console.log(res.data.data)
          if (res.data.data.code == 1) {
            console.log("支付成功")
            pay_info.state = res.data.data.state;
            var d = new Date(res.data.data.paymenttime);
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
            console.log("将餐馆" + pay_info.store.id + "内的点餐列表删除");
            store_food_map.delete(pay_info.store.id);
          }
          else {
            if (res.data.data.code == 0)
                console.log("订单已经支付过")
          }
        },
        fail: function () {
          console.log("支付失败")
        }
      })

    })
  },
  revieworder: function(){
    wx.redirectTo({
      url: "../order/orderdetails?orderid=" + pay_info.id
    })
  }
})