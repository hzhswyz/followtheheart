// pages/manage/manage.js
const app = getApp();
var durl = app.globalData.dynamicrequest;
var userloginJs = require('../../userlogin.js');
var storelist;
var pageobject;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
    showCapsule: 1, //是否显示左上角图标
    title: '我的商店', //导航栏 中间的标题
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 26
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    pageobject = this;
    wx.getSystemInfo({
      success: (res) => {
        var showwidth = res.windowWidth * 0.97;
        var showheight = showwidth / 1.6;
        //console.log("宽度：",showwidth,"高度：",showheight);
        pageobject.setData({
          showwidth: showwidth,
          showheight: showheight
        })
      }
    });

    userloginJs.userloginprocess().then(function () {
      wx.request({
        url: durl + "/store/getmystores",
        header: { Cookie: "JSESSIONID=" + app.globalData.session },
        success: function (res) {
          console.log("我的商店:", res.data.data)
          storelist = res.data.data;
          for (var i = 0; i < storelist.length; i++) {
            storelist[i].imgsrc = durl + "/static/image/recommendimg" + storelist[i].id + ".jpg";
            storelist[i].type = storelist[i].type.split(",");
          }
          pageobject.setData({
            storelist: storelist
          })
        }
      });
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