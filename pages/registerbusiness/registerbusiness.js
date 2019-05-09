// pages/registerbusiness/registerbusiness.js
const app = getApp();
var durl = app.globalData.dynamicrequest;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标
      title: '我要开店', //导航栏 中间的标题
      navbackground: "white"
    },
    height: app.globalData.height * 3,
    x: durl + "/static/image/recommendimg" + 1 + ".jpg",
    z: durl + "/static/image/" + 1 + "image.jpg",
    restype: ["中式快餐", "西式快餐","农家小炒"],
    restypetext: "中式快餐",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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