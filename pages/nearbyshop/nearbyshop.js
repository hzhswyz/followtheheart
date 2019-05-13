// pages/nearbyshop/nearbyshop.js
const app = getApp();
var pageobject;
var filter_index = 0;
var durl = app.globalData.dynamicrequest;
var storelist = [];
var isshowreserve = false;
var reservetime = '09:10';
var reservestore;
var userloginJs = require('../../userlogin.js');

//当前加载的页数
var currentpage = 1;
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
    height: app.globalData.height * 3,
    starssrc: "/pages/static/img/indexpage/stars.png"
  },

  /**
   * 生命周期函数--监听页面加载
   */

  getstores: function () {

    var localinfo = {};
    localinfo.la = app.globalData.latitude;
    localinfo.lo = app.globalData.longitude;

    var data = { latitude: localinfo.la, longitude: localinfo.lo, currentpage: currentpage };

    if(filter_index == 0)
      data.distance = 5
    if (filter_index == 1)
      data.sales = 5
    if (filter_index == 2)
      data.consume = 5

    console.log("data", data)
    wx.request({
      url: durl + "/store/getnearbyshops",
      header: { Cookie: "JSESSIONID=" + app.globalData.session },
      data: data,
      success: function (res) {
        if (res.data.status == 200) {
          console.log("附近商店", res.data.data)
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
            list[i].imgsrc = durl + "/static/image/recommendimg" + list[i].id + ".jpg";
          }
          storelist = storelist.concat(list);
          pageobject.setData({
            store: storelist,
            filterindex: filter_index
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
    
    currentpage = 1;
    storelist = [];

    this.setData({
      itemheight: 150,
    })

    pageobject = this;

    pageobject.getstores();

    var systime = this.getSysTimeHM();
    console.log(systime)
    this.setData({
      systime: systime
    })

  },

  choseposition: function (resolve, reject) {
    wx.chooseLocation({
      success: function (result) {
        console.log(result)
        if (result.name != "") {
          latitude = result.latitude;
          longitude = result.longitude;
        }
      },
      complete:function(){
        resolve();
      }
    });
  },
  openstore: function (event) {
    console.log("点击第" + event.currentTarget.dataset.id)
    let str = JSON.stringify(storelist[event.currentTarget.dataset.id]);
    console.log(str)
    wx.navigateTo({
      url: '../store/commodity?storeinfo=' + str
    })
  },

//更改选择条件
  changefilter: function (event){
    currentpage = 1;
    storelist = [];
    wx.showLoading({
      title: '正在加载',
    })
    this.setData({
      store: storelist,
    });
    var index = event.target.dataset.index;
    filter_index = index;
    this.getstores();
  },

  //点击预定
  reserve:function(event){
    console.log(event.currentTarget.dataset.index)
    var d = new Date();
    var y = d.getFullYear();
    var M = d.getMonth() + 1;
    var day = d.getDate();
    if (parseInt(day) < 10)
      day = '0' + day;
    if (parseInt(M) < 10)
      M = '0' + M;
    var h = d.getHours();
    if(parseInt(h)<10)
      h = '0'+h;
    var m = d.getMinutes();
    if (parseInt(m) < 10)
      m = '0' + m;
    var date = y + '-' + M + '-' + day + ' ' + h + ":" + m + ":00";
    reservetime = h + ":" + m ;
    console.log("预定时间：",reservetime)
    reservestore = storelist[event.currentTarget.dataset.index];
    this.isshowreserve();
    this.getQueuingNumber(date, reservestore.id);
  },
  //展示预定界面
  isshowreserve:function (event){
    isshowreserve = !isshowreserve;
    var systemtimehm = this.getSysTimeHM();
    //console.log("系统时间：",systemtimehm)
    pageobject.setData({
      reservestore: reservestore,
      isshowreserve: isshowreserve,
      reservetime: reservetime,
      systemtime: systemtimehm
    })
  },
  //获取当前排队人数
  getQueuingNumber:function(date,storeid){

    wx.request({
      url: durl + "/rest/reserve/getqueuingnumber",
      data: {
        storeid: storeid,
        date: date
      },
      header: { Cookie: "JSESSIONID=" + app.globalData.session, 'content-type': "application/x-www-form-urlencoded" },
      success: function (res) {
        if (res.data.status == 200) {
          pageobject.setData({
            queuingnumber: res.data.data
          })
        }
        else{
        }
      },
      fail:function(){
      }
    });
  },
  //阻止事件冒泡
  donothing:function(){

  },
  //获取系统时间
  getSysTimeHM(){
    var d = new Date();
    var h = d.getHours();
    if (parseInt(h) < 10)
      h = '0' + h;
    var m = d.getMinutes();
    if (parseInt(m) < 10)
      m = '0' + m;
    return h+":"+m;
  },
  //更改预定时间
  bindTimeChange:function(event){
    console.log(event.detail.value);
    reservetime = event.detail.value;
    var systemtimehm = this.getSysTimeHM();
    pageobject.setData({
      reservetime: reservetime,
      systemtime: systemtimehm
    })

    var d = new Date();
    var y = d.getFullYear();
    var M = d.getMonth() + 1;
    var day = d.getDate();
    if (parseInt(day) < 10)
      day = '0' + day;
    if (parseInt(M) < 10)
      M = '0' + M;
    var date = y + '-' + M + '-' + day + ' ' + reservetime +":00";
    this.getQueuingNumber(date, reservestore.id);
  },
  //提交预定表单
  reserveformsubmit: function (event){
    wx.showLoading({
      title: '预定中',
    })
    console.log(event.detail.value);
    userloginJs.userloginprocess().then(function () {
      var time = event.detail.value.time
      var d = new Date();
      var y = d.getFullYear();
      var m = d.getMonth() + 1;
      var day = d.getDate();
      if (parseInt(day) < 10)
        day = '0' + day;
      if (parseInt(m)<10)
        m = '0' + m;
      time = y + '-' + m + '-' + day + ' ' + time + ":00";
      console.log(time)
      wx.request({
        url: durl + "/rest/reserve/creatreserve",
        data: {
          storeid: reservestore.id,
          time: time,
          peoplenum: event.detail.value.peoplenum,
          remarks: event.detail.value.remarks
        },
        header: { Cookie: "JSESSIONID=" + app.globalData.session, 'content-type': "application/x-www-form-urlencoded" },
        method: 'POST',
        success: function (res) {
          if (res.data.status == 200) {
            wx.showToast({
              title: '预定成功',
            })
          }
          else{
            console.log(res)
            if (res.data.reason == 'intervaltime error')
              wx.showToast({
                icon:'none',
                image:"../static/img/indexpage/indexfail.png",
                title: '已经预定过此店',
              })
            else
              wx.showToast({
                title: '预定失败',
              })
          }
        },
        fail:function(){
          wx.showToast({
            title: '预定失败',
          })
        },
        complete:function(){
          pageobject.isshowreserve();
        }
      });
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
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    currentpage++;
    this.getstores();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})