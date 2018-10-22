// pages/order/order.js
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
    wx.getSystemInfo({
      success: function (res) {
        pageobject.setData({
          screenHeight: res.windowHeight
        })
      }
    })
    if(app.openid==undefined){
      console.log("用户未登录,请求登录");
      wx.login({
        timeout: 3000,
        success: function (res) {
          console.log("成功获取usercode");
          wx.request({
            url: rurl + "/wxuserlogin",
            data: { usercode: res.code, format: "json" },
            success: function (res) {
              console.log(res)
              app.openid = res.data.pageList;
              pageobject.getdata();
            }
          });
        }
      });
    }
    else{
      pageobject.getdata();
    }
  },

  getdata: function(){
    wx.request({
      url: rurl + "/gerorderlist?openid=" + app.openid,
      data: { format: "json" },
      success: function (res) {
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
        pageobject.setData({
          orderlist: res.data.pageList
        });
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
  }
})