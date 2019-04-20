// pages/order/storeorderdetails.js
const app = getApp();
var durl = app.globalData.dynamicrequest;
var pageobject;
var isshowlist = false;
var userloginJs = require('../../userlogin.js');
var utils = require('../../utils/util.js');
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
        url: durl + "/order/getstoreorderdetails?orderid=" + orderid,
        header: { Cookie: "JSESSIONID=" + app.globalData.session },
        success: function (res) {
          console.log("res.data", res.data)
          if (res.data.status==200){
            if (res.data.data.paymenttime != null) {
              res.data.data.paytime = utils.formatTime(new Date(res.data.data.paymenttime));
            }
            res.data.data.transdate = utils.formatTime(new Date(res.data.data.transactiondate));
            res.data.data.userimg = durl + "/static/image/user/" + res.data.data.userimg + ".jpg";
            let foodlist = JSON.parse(res.data.data.content);
            console.log(foodlist, "商品列表")
            pageobject.setData({
              payinfo: res.data.data,
              foodlist: foodlist,
              nvabarData: {
                showCapsule: 1, //是否显示左上角图标
                title: res.data.data.username + " 的订单", //导航栏 中间的标题
                navbackground: "#97d9e1"
              },
            })
          }else{
            wx.showToast({
              icon: "none",
              title: "加载出错",
            })
          }
        },
        fail:function(){
          wx.showToast({
            icon: "none",
            title: "加载出错",
          })
        }
      })

    });
  },
  showlist: function () {
    isshowlist = !isshowlist;
    pageobject.setData({
      isshowlist: isshowlist
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

  }
})