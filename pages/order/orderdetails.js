// pages/order/orderdetails.js
const app = getApp();
var rurl = app.globalData.requestdomainname;
var pageobject;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    pageobject = this;
    let orderid = options.orderid;
    wx.request({
      url: rurl + "/getorderdetails?orderid=" + orderid,
      data: { format: "json" },
      success: function (res) {
        console.log(res.data)
        wx.setNavigationBarTitle({
          title: res.data.pageList.store.name + " 的订单"
        })
        
        if (res.data.pageList.paymenttime != null) {
            var d = new Date(res.data.pageList.paymenttime);
            var date = (d.getFullYear()) + "-" +
              (d.getMonth() + 1) + "-" +
              (d.getDate()) + " " +
              (d.getHours()) + ":" +
              (d.getMinutes()) + ":" +
              (d.getSeconds());
            res.data.pageList.paytime = date;
          }
          var d2 = new Date(res.data.pageList.transactiondate);
          var date2 = (d2.getFullYear()) + "-" +
            (d2.getMonth() + 1) + "-" +
            (d2.getDate()) + " " +
            (d2.getHours()) + ":" +
            (d2.getMinutes()) + ":" +
            (d2.getSeconds());
        res.data.pageList.transdate = date2;
        res.data.pageList.date = res.data.pageList.transactiondate;
        res.data.pageList.money = res.data.pageList.m;
        res.data.pageList.store.image = rurl + "/static/image/" + res.data.pageList.store.id + "image.jpg"
        pageobject.setData({
          payinfo: res.data.pageList
        })
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
  continuetopay: function (res){
    let str = JSON.stringify(res.currentTarget.dataset.payinfo);
    console.log(str)
    wx.redirectTo({
      url: '../pay/pay?payinfo=' + str
    })
  }
})