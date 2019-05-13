// pages/mappage/mappage.js
const app = getApp();
var durl = app.globalData.dynamicrequest;
var latitude = 0;
var longitude = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标
      title: '选取位置', //导航栏 中间的标题
     // navbackground: "white"
    },
    scale: 13,
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 3, 
    controls: [{
      id: 1,
      iconPath: '../static/img/indexpage/location.png',
      position: {
        left: 0,
        top: 300 - 50,
        width: 50,
        height: 50
      },
      clickable: true
    }]
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  },
  onaddmap:function(){
    if (this.data.scale == 18)
      return;
    this.setData({
      scale: ++this.data.scale
    })
  },
  onreducemap:function(){
    if (this.data.scale == 0)
      return;
    this.setData({
      scale: --this.data.scale
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.latitude!=undefined)
      latitude = options.latitude;
    if (options.longitude != undefined)
      longitude = options.longitude;
    
    this.setData({
      markers: [{
        iconPath: '../static/img/indexpage/location.png',
        id: 0,
        latitude: 23.099994,
        longitude: 113.324520,
        width: 50,
        height: 50
      }],
    });

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