// pages/scheduledmanagement/scheduledmanagement.js
const app = getApp();
var pageobject;
var utils = require('../../utils/util.js');
var userloginJs = require('../../userlogin.js');
var durl = app.globalData.dynamicrequest;
var store_info;
var isshowremark = false;
var reservationindex = 0;
var currentpage = 1;
var reservationlist = [];
var confirmconsumeindex = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标
      title: '预定管理', //导航栏 中间的标题
      navbackground: "white"
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 3,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    currentpage = 1;
    reservationlist = [];
    isshowremark = false;
    reservationindex = 0;
    confirmconsumeindex = 0;

    pageobject=this;
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
    this.getdata()
  },

  //展示备注
  showremark: function (event) {
    reservationindex = event.currentTarget.dataset.index
    isshowremark = !isshowremark;
    this.setData({
      isshowremark: isshowremark,
      reservationindex: reservationindex,
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

  //获取数据
  getdata: function () {
    userloginJs.userloginprocess().then(function () {
      wx.request({
        url: durl + "/rest/reserve/getstorereservelist",
        header: { Cookie: "JSESSIONID=" + app.globalData.session },
        data: { currentpage: currentpage, storeid: store_info.id },
        success: function success(res) {
          console.log("商店预定订单", res.data.data)
          var reservationlisttemp = res.data.data;
          if (reservationlisttemp.length == 0) {
            wx.showToast({
              icon: "none",
              title: "没有更多数据了",
            })
            return;
          }
          for (var i = 0; i < reservationlisttemp.length; i++) {
            reservationlisttemp[i].time = utils.formatTime(new Date(reservationlisttemp[i].time))
            reservationlisttemp[i].userimg = durl + "/static/image/user/" + reservationlisttemp[i].userimg + ".jpg";
            reservationlisttemp[i].confirmconsumeindex = confirmconsumeindex++;
          }
          reservationlist = reservationlist.concat(reservationlisttemp);
          pageobject.setData({
            reservationlist: reservationlist,
          })
          wx.hideLoading();
        },
        fail: function () {
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
  
  confirmcomsume:function(event){
    console.log(event.currentTarget.dataset.confirmconsumeindex);
    var tempreserve = reservationlist[event.currentTarget.dataset.confirmconsumeindex];
    userloginJs.userloginprocess().then(function () {
      wx.request({
        url: durl + "/rest/reserve/changereservestatus",
        header: { Cookie: "JSESSIONID=" + app.globalData.session },
        data: { queuingcode: tempreserve.queuingcode },
        success: function success(res) {
          console.log("商店预定订单", res.data)
          if (res.data.status==200){
            tempreserve.status = 1;
            pageobject.setData({
              reservationlist: reservationlist,
            })
            wx.hideLoading();
          }
          else{
            wx.showToast({
              icon: "none",
              title: "操作失败",
            })
          }
        },
        fail: function () {
          wx.showToast({
            icon: "none",
            title: "操作失败",
          })
        }
      })
    }).catch(function (error) {
      wx.showToast({
        title: error.message,
      })
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