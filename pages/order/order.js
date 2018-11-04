// pages/order/order.js
const app = getApp();
var rurl = app.globalData.requestdomainname;
var durl = app.globalData.dynamicrequest;
var pageobject;
var currentpage = 0;
var size = 10;
var userloginJs = require('../../userlogin.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标
      title: '我的订单', //导航栏 中间的标题
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 26,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    pageobject = this;
    pageobject.setData({
      screenHeight: app.globalData.windowHeight - (app.globalData.height * 2 + 26)-70
    })
    userloginJs.userloginprocess().then(function(){
      pageobject.getdata();
    });
  },
  getdata: function(){
    wx.request({
      url: durl + "/MainController/gerorderlist",
      data: { currentpage: currentpage ,format: "json"},
      header: { Cookie: "JSESSIONID=" + app.globalData.session },
      success: function (res) {
        if (res.data.pageList.responsecode == 0) {
          console.log(res)
          if (res.data.pageList.reason == "SESSIONIDInvalid") {
            console.log("sessionid过期失效，置为空");
            app.globalData.session = null;
            userloginJs.userloginprocess().then(function () {
              pageobject.getdata();
            });
          }
        }
        else {
          console.log(res.data);
          for (var i = 0; i < res.data.pageList.length; i++) {
            if (res.data.pageList[i].paydate != null) {
              var d = new Date(res.data.pageList[i].paydate);
              var date = (d.getFullYear()) + "-" +
                (d.getMonth() + 1) + "-" +
                (d.getDate()) + " " +
                (d.getHours()) + ":" +
                (d.getMinutes()) + ":" +
                (d.getSeconds());
              res.data.pageList[i].paymenttime = date;
              var d2 = new Date(res.data.pageList[i].trandate);
              var date2 = (d2.getFullYear()) + "-" +
                (d2.getMonth() + 1) + "-" +
                (d2.getDate()) + " " +
                (d2.getHours()) + ":" +
                (d2.getMinutes()) + ":" +
                (d2.getSeconds());
              res.data.pageList[i].transactiondate = date2;
            }
          }
          size = res.data.pageList.length;
          pageobject.setData({
            orderlist: res.data.pageList,
            size: size,
            currentpage: currentpage
          });
        }
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
  vieworderdetails:function (event){
    console.log(event,"查看订单详情")
    wx.navigateTo({
      url: 'orderdetails?orderid=' + event.currentTarget.dataset.orderid
    })
  },
  perview: function(){
    if(currentpage>0){
    currentpage--;
    pageobject.getdata();
    }
  },
  next: function () {
    if(size>=10){
    currentpage++;
    pageobject.getdata();
    }
  }
})