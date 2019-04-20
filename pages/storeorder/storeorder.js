// pages/storeorder/storeorder.js
const app = getApp();
var pageobject;
var durl = app.globalData.dynamicrequest;
var store_info;
var filtercondition={};
var userloginJs = require('../../userlogin.js');
var utils = require('../../utils/util.js');
//当前加载的页数
var currentpage = 1;
//订单数组
var orderlistarray = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标
      title: '商店订单', //导航栏 中间的标题
      navbackground: "white"
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 3,
    filterheight:40,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    pageobject = this;
    //当前加载的页数
    currentpage = 1;
    //订单数组
    orderlistarray = [];
    filtercondition = {};

    let storeinfo = JSON.parse(options.storeinfo);
    storeinfo.image = durl + "/static/image/" + storeinfo.id + "image.jpg"
    store_info = storeinfo;
    this.setData({
      nvabarData: {
        showCapsule: 1, //是否显示左上角图标
        title: store_info.name, //导航栏 中间的标题
        navbackground: "white"
      },
      storeinfo: store_info,
    })

    var d = new Date();
    var date = (d.getFullYear()) + "-" + (d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1);
    filtercondition.time = date;

    this.getData();
  },

  getData:function(){
    userloginJs.userloginprocess().then(function () {
      wx.request({
        url: durl + "/order/getstoreorder",
        data: {
          currentpage: currentpage,
          storeid: store_info.id,
          minmoney: filtercondition.minmoney,
          maxmoney: filtercondition.maxmoney,
          date: filtercondition.time
        },
        header: { Cookie: "JSESSIONID=" + app.globalData.session },
        success: function (res) {
          if (res.data.status == 500) {
            wx.showToast({
              icon: "none",
              title: res.data.reason
            })
          }
          else {
            console.log(res.data);

            if (res.data.data.length == 0) {
              wx.showToast({
                icon: "none",
                title: "没有更多数据了",
              })
              return;
            }
            //更改时间显示格式
            for (var i = 0; i < res.data.data.length; i++) {

              res.data.data[i].userimg = durl + "/static/image/user/" + res.data.data[i].userimg + ".jpg";;
              res.data.data[i].content = JSON.parse(res.data.data[i].content);
              if (res.data.data[i].paymenttime != null) {
                res.data.data[i].paymenttime = utils.formatTime(new Date(res.data.data[i].paymenttime));
              }
              res.data.data[i].transactiondate = utils.formatTime(new Date(res.data.data[i].transactiondate));
            }
            //将加载后的数据添加到原数组
            orderlistarray = orderlistarray.concat(res.data.data);

            pageobject.setData({
              orderlist: orderlistarray
            });

            wx.hideLoading();
          }
        }
      })
    },
      function (err) {
        wx.showToast({
          title: err.message,
          image: '/pages/static/img/indexpage/loginfail.png'
        })
      });
  },

  //下拉到底部刷新
  onReachBottom: function () {
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    currentpage++;
    this.getData();
  },

  filterchange: function (event) {
    //当前加载的页数
    currentpage = 0;
    //订单数组
    orderlistarray = [];
    this.setData({
      orderlist: orderlistarray,
    })
    filtercondition = event.detail.filtercondition;
    console.log(event)
    this.onReachBottom()
  },

  vieworderdetails: function (event) {
    console.log(event, "查看订单详情")
    wx.navigateTo({
      url: '../order/storeorderdetails?orderid=' + event.currentTarget.dataset.orderid
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})