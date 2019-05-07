// pages/order/comment/comment.js
const app = getApp();
var durl = app.globalData.dynamicrequest;
var orderform;
var pageobject;
var storescoreindex = 4;
var userloginJs = require('../../../userlogin.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标
      title: '评价', //导航栏 中间的标题
      navbackground: '#acb6e5'
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 3,
    storescoreindex: storescoreindex,
    score: [1, 2, 3, 4, 5]
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
        console.log("comment windowheight", res.windowHeight)
        pageobject.setData({
          showheight: showheight,
        })
      }
    });
    orderform = JSON.parse(options.orderform);
    for(var i=0;i<orderform.content.length;i++){
      orderform.content[i].imgsrc = durl + "/static/image/food/food" + orderform.content[i].id + ".jpg";
      orderform.content[i].score = 4;
      orderform.content[i].isanonymous = false;
    }
    pageobject.setData({
      orderform : orderform,
    })
  },
  scorePickerChange:function(event){
    console.log("score", event);
    if (event.currentTarget.dataset.foodindex==undefined){
      storescoreindex = parseInt(event.detail.value);
      pageobject.setData({
        storescoreindex: storescoreindex,
      })
    }else{
      console.log("foodscore", event.currentTarget.dataset.foodindex);
      orderform.content[event.currentTarget.dataset.foodindex].score = parseInt(event.detail.value);
      pageobject.setData({
        orderform: orderform
      })
    }
  },
  formSubmit:function(event){
    console.log("表单数据", event.detail)
    var foodform = [];
    for (var i = 0; i < orderform.content.length; i++) {
      foodform[i] = {
        foodid: orderform.content[i].id,
        foodscore: event.detail.value[orderform.content[i].id+"_score"]+1,
        foodcomment: event.detail.value[orderform.content[i].id + "_comment"],
        foodisanonymous: orderform.content[i].isanonymous
      }
    };
    var sendform = {
      storeid: orderform.store.id,
      storescore: storescoreindex+1,
      orderid: orderform.id,
      foodarray: foodform
    };
    console.log("发送的表单数据", sendform);
    wx.showLoading({
      title: '发表评论',
    })
    userloginJs.userloginprocess().then(function () {
      wx.request({
        url: durl + "/rest/comment/getStoreFoodComment",
        data: sendform,
        method: "POST",
        header: { Cookie: "JSESSIONID=" + app.globalData.session},
        success: function (res) {
          if (res.data.status == 500) {
            wx.showToast({
              icon: "none",
              title: res.data.reason
            })
          }
          else {
            console.log(res.data);
            wx.showToast({
              icon: "none",
              title: "评论成功"
            })
            wx.navigateBack();
          }
        },
        fail: function (res){
          wx.showToast({
            icon: "none",
            title: res.data
          })
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
  radiobindchange:function(event){

    console.log(event.currentTarget.dataset.index)
    if (orderform.content[event.currentTarget.dataset.index].isanonymous)
      orderform.content[event.currentTarget.dataset.index].isanonymous = false;
    else
      orderform.content[event.currentTarget.dataset.index].isanonymous = true;

    pageobject.setData({
      orderform: orderform,
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