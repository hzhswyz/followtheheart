// pages/reservation/reservation.js
const app = getApp();
var pageobject;
var utils = require('../../utils/util.js');
var userloginJs = require('../../userlogin.js');
var durl = app.globalData.dynamicrequest;
var currentpage = 1;
var reservationlist = [];
var isshowremark = false;
var reservationindex = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标
      title: '预定', //导航栏 中间的标题
      navbackground: "white"
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 3 + 6,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    currentpage = 1;
    reservationlist = [];
    isshowremark = false;
    reservationindex = 0;
    pageobject = this;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    this.getdata();
  },
  //获取数据
  getdata:function(){
    userloginJs.userloginprocess().then(function () {
      wx.request({
        url: durl + "/rest/reserve/getmyreservelist",
        header: { Cookie: "JSESSIONID=" + app.globalData.session },
        data: { currentpage: currentpage },
        success: function success(res) {
          console.log("预定订单", res.data.data)
          var reservationlisttemp = res.data.data;
          if (reservationlisttemp.length==0){
            wx.showToast({
              icon:"none",
              title: "没有更多数据了",
            })
            return;
          }
          for (var i = 0; i < reservationlisttemp.length; i++) {
            reservationlisttemp[i].time = utils.formatTime(new Date(reservationlisttemp[i].time))
            reservationlisttemp[i].storeimg = durl + "/static/image/" + reservationlisttemp[i].storeid + "image.jpg";
          }
          reservationlist = reservationlist.concat(reservationlisttemp);
          pageobject.setData({
            reservationlist: reservationlist,
          })
          wx.hideLoading();
        },
        fail:function(){
          wx.showToast({
            icon: "none",
            title: "加载失败",
          })
        }
      })
    }).catch(function (error) {
      wx.showToast({
        title: error.message,
      })
    })
  },
  //下拉到底部刷新
  onReachBottom: function () {
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    currentpage++;
    this.getdata()
  },
  //展示备注
  showremark:function(event){
    reservationindex = event.currentTarget.dataset.index
    isshowremark = !isshowremark;
    this.setData({
      isshowremark: isshowremark,
      reservationindex: reservationindex,
    })
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