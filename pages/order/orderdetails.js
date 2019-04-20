// pages/order/orderdetails.js
const app = getApp();
var durl = app.globalData.dynamicrequest;
var pageobject;
var isshowlist = false;
var userloginJs = require('../../userlogin.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标
      title: '我的订单', //导航栏 中间的标题
      navbackground: "#97d9e1"
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 3,
    isshowlist: isshowlist
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    pageobject = this;
    let orderid = options.orderid;
    console.log(orderid)
    userloginJs.userloginprocess().then(function () {
      
      wx.request({
        url: durl + "/order/getorderdetails?orderid=" + orderid,
        header: { Cookie: "JSESSIONID=" + app.globalData.session },
        success: function (res) {
          console.log("res.data", res.data)
          wx.setNavigationBarTitle({
            title: res.data.data.store.name + " 的订单"
          })

          if (res.data.data.paymenttime != null) {
            var d = new Date(res.data.data.paymenttime);
            var date = (d.getFullYear()) + "-" +
              (d.getMonth() + 1) + "-" +
              (d.getDate()) + " " +
              (d.getHours()) + ":" +
              (d.getMinutes()) + ":" +
              (d.getSeconds());
            res.data.data.paytime = date;
          }
          var d2 = new Date(res.data.data.transactiondate);
          var date2 = (d2.getFullYear()) + "-" +
            (d2.getMonth() + 1) + "-" +
            (d2.getDate()) + " " +
            (d2.getHours()) + ":" +
            (d2.getMinutes()) + ":" +
            (d2.getSeconds());
          res.data.data.transdate = date2;
          res.data.data.store.image = durl + "/static/image/" + res.data.data.store.id + "image.jpg";
          let foodlist = JSON.parse(res.data.data.content);
          console.log(foodlist, "商品列表")
          pageobject.setData({
            payinfo: res.data.data,
            foodlist: foodlist,
            nvabarData: {
              showCapsule: 1, //是否显示左上角图标
              title: res.data.data.store.name + " 的订单", //导航栏 中间的标题
              navbackground: "#97d9e1"
            },
          })
        }
      })

    });


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
  continuetopay: function (res){
    let str = JSON.stringify(res.currentTarget.dataset.payinfo);
    console.log(str)
    wx.redirectTo({
      url: '../pay/pay?payinfo=' + str
    })
  },
  showlist: function (){
    isshowlist = !isshowlist;
    pageobject.setData({
      isshowlist: isshowlist
    })
  }
})