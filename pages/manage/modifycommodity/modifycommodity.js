// pages/manage/modifycommodity/modifycommodity.js
var foodtypeindex = 0;
const app = getApp();
var durl = app.globalData.dynamicrequest;
var store_info;
var pageobject;
var food_list;
var userloginJs = require('../../../userlogin.js');
var isshoweditfood = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    starssrc: "/pages/static/img/indexpage/stars.png",
    typeindex: foodtypeindex,
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标
      title: '商店管理', //导航栏 中间的标题
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    pageobject = this;
    wx.getSystemInfo({
      success: (res) => {
        var showwidth = res.windowWidth / 2;
        var showheight = showwidth * 0.6;
        app.globalData.windowHeight = res.windowHeight;
        console.log("conmmodity windowheight", res.windowHeight)
        //console.log("宽度：", showwidth, "高度：", showheight);
        pageobject.setData({
          showheight: showheight
        })
      }
    });
    let storeinfo = JSON.parse(options.storeinfo);
    storeinfo.image = durl + "/static/image/" + storeinfo.id + "image.jpg"
    store_info = storeinfo;
    this.setData({
      store: storeinfo,
      nvabarData: {
        showCapsule: 1, //是否显示左上角图标
        title: storeinfo.name, //导航栏 中间的标题
        navbackground: "#f9d423"
      }
    })
    console.log("用户JSESSIONID： " + app.globalData.session);
    wx.request({
      url: durl + "/store/getstorefoods?storeid=" + storeinfo.id,
      header: { Cookie: "JSESSIONID=" + app.globalData.session },
      success: function success(res) {
        if ('Set-Cookie' in res.header) {
          console.log("用户JSESSIONID：", res.header["Set-Cookie"].split(";")[0].split("=")[1]);
          app.globalData.session = res.header["Set-Cookie"].split(";")[0].split("=")[1];
        }
        var foodlist = res.data.data;
        console.log("foodlist:", foodlist); 
        for (var i = 0; i < foodlist.length; i++) {
          foodlist[i].imgsrc = durl + "/static/image/food/food" + foodlist[i].id + ".jpg";
        }
        food_list = foodlist;
        pageobject.setData({
          foodlist: foodlist
        })
      }
    })
    pageobject.setData({
      screenHeight: app.globalData.windowHeight - 105 - (app.globalData.height * 2 + 20)
    })
  },

  editfood: function (event) {
    let str = event.currentTarget.dataset.foodid;
    console.log("商品ID",str)
    pageobject.setData({
      isshoweditfood: true,
      foodid:str
    })
  },

  isshowout:function(){
    pageobject.setData({
      isshoweditfood: false
    })
  },

  donothing:function(){

  },

  formsubmit:function(event){
    console.log(event.detail.value);

    userloginJs.userloginprocess().then(function () {
      wx.request({
        url: durl + "/rest/food/editnameandprice",
        data: { id: event.detail.value.foodid, name: event.detail.value.name, price: event.detail.value.price},
        method:'POST',
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
          }
        }
      })
    })
  },

  formreset:function(){

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