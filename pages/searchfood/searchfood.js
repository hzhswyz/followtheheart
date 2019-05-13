// pages/searchfood/searchfood.js
const app = getApp();
var durl = app.globalData.dynamicrequest;
var storelist = [];
var pageobject;
//当前加载的页数
var currentpage = 1;
var keyword = ""
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标
      title: '相关商店', //导航栏 中间的标题
      navbackground: "white"
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 3,
    starssrc: "/pages/static/img/indexpage/stars.png",
    rmbimg: "/pages/static/img/indexpage/rmb.png",
  },
  openstore:function(event){
    console.log("点击第" + event.currentTarget.dataset.index)
    let str = JSON.stringify(storelist[event.currentTarget.dataset.index]);
    console.log(str)
    wx.navigateTo({
      url: '../store/commodity?storeinfo=' + str
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  getstores:function () {


    var localinfo = {};
    localinfo.la = app.globalData.latitude;
    localinfo.lo = app.globalData.longitude;


    var data = { latitude: localinfo.la, longitude: localinfo.lo, currentpage: currentpage, keyword: keyword };

    console.log("data", data)

      wx.request({
      url: durl + "/store/searchfood",
      header: { Cookie: "JSESSIONID=" + app.globalData.session },
      data: data,
      success: function (res) {
        if (res.data.status == 200) {
          console.log("相关商店", res.data.data)
          var list = res.data.data;
          wx.hideLoading();
          if (list.length == 0) {
            wx.showToast({
              icon: "none",
              title: "没有更多数据了",
            })
            return;
          }
          for (var i = 0; i < list.length; i++) {
            list[i].type = list[i].type.split(",");
            list[i].imgsrc = durl + "/static/image/" + list[i].id + "image.jpg";
            for (var z = 0; z < list[i].foodlist.length; z++)
              list[i].foodlist[z].foodimg = durl + "/static/image/food/food" + list[i].foodlist[z].foodid + ".jpg";
          }
          storelist = storelist.concat(list);
          pageobject.setData({
            storearray: storelist,
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '加载失败',
          })
        }
      },
      fail: function () {
        wx.showToast({
          icon: 'none',
          title: '加载失败',
        })
      }
    })
  },

  onLoad: function (options) {
    storelist = [];
    currentpage = 1;
    pageobject = this;
    keyword = options.keyword;
    pageobject.getstores();

  },
  /**
     * 页面上拉触底事件的处理函数
     */
  onReachBottom: function () {
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    currentpage++;
    this.getstores();
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