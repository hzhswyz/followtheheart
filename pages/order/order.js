// pages/order/order.js
const app = getApp();
var durl = app.globalData.dynamicrequest;
var pageobject;
var currentpage = 1;
var orderlistarray = [];
var userloginJs = require('../../userlogin.js');
Page({
  first:true,
  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 0, //是否显示左上角图标
      title: '我的订单', //导航栏 中间的标题
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 26,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    orderlistarray = [];
    currentpage = 1;
    pageobject = this;
    wx.getSystemInfo({ 
      success: (res) => {
        //在app()构造函数里获取高度少一个tabbar高度
        app.globalData.windowHeight = res.windowHeight
      }
    })
    this.setData({
      screenHeight: app.globalData.windowHeight - (app.globalData.height * 2 + 26)
    })
    this.getdata();
  },


  getdata: function(){
    userloginJs.userloginprocess().then(function () {

      wx.request({
        url: durl + "/order/gerorderlist",
        data: { currentpage: currentpage, format: "json" },
        header: { Cookie: "JSESSIONID=" + app.globalData.session },
        success: function (res) {
          if (res.data.status == 500) {
            wx.showToast({
              title: res.data.reason
            })
          }
          else {
            wx.hideLoading();
            console.log(res.data);
            //更改时间显示格式
            for (var i = 0; i < res.data.data.length; i++) {
              res.data.data[i].store.image = durl + "/static/image/" + res.data.data[i].store.id + "image.jpg";
              if (res.data.data[i].paymenttime != null) {
                var d = new Date(res.data.data[i].paymenttime);
                var date = (d.getFullYear()) + "-" +
                  (d.getMonth() + 1) + "-" +
                  (d.getDate()) + " " +
                  (d.getHours()) + ":" +
                  (d.getMinutes()) + ":" +
                  (d.getSeconds());
                res.data.data[i].paymenttime = date;
                var d2 = new Date(res.data.data[i].transactiondate);
                var date2 = (d2.getFullYear()) + "-" +
                  (d2.getMonth() + 1) + "-" +
                  (d2.getDate()) + " " +
                  (d2.getHours()) + ":" +
                  (d2.getMinutes()) + ":" +
                  (d2.getSeconds());
                res.data.data[i].transactiondate = date2;
              }
            }

            orderlistarray = orderlistarray.concat(res.data.data);
            pageobject.setData({
              orderlist: orderlistarray,
              currentpage: currentpage
            });
          }
        }
      })

    });
    
  },

  // 当距离scroll-view底部距离小于50像素时触发回调
  scrolltolower: function () {
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    currentpage++;
    this.getdata()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.first){
      this.first = false
    }else{
      this.getdata()
    }
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
  /*perview: function(){
    if(currentpage>1){
    currentpage--;
    pageobject.getdata();
    }
  },
  next: function () {
    if(size>=10){
    currentpage++;
    pageobject.getdata();
    }
  }*/
})