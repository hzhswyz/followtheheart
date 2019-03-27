// pages/nearbyshop/nearbyshop.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标
      title: '附近商店', //导航栏 中间的标题
      navbackground: "white"
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,
    filterindex: 0,
    starssrc: "/pages/static/img/indexpage/stars.png",
    store:{
      consume:69,
      distance:53694,
      id:5,
      imgsrc:"http://120.79.16.31:8080/IntelligentMenus/static/image/recommendimg5.jpg",
      name:"重庆辣味",
      notice:null,
      sales:875,
      stars:4,
      tp:'中式快餐',
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      itemheight: 150,
    })
  },

  changefilter: function (event){
    var index = event.target.dataset.index;
    this.setData({
      filterindex: index
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