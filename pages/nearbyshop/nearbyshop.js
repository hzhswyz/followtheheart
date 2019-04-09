// pages/nearbyshop/nearbyshop.js
const app = getApp();
var pageobject;
var filter_index = 0;
var durl = app.globalData.dynamicrequest;
var storelist;
var isshowreserve = false;
var reservetime = '09:10';
var reservestore;
var userloginJs = require('../../userlogin.js');
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
    starssrc: "/pages/static/img/indexpage/stars.png"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      itemheight: 150,
    })
    pageobject = this;


    //检查用户是否授予定位权限
    function positionpromise() {
      var userpositionpromise = new Promise(function (resolve, reject) {
        //获取用户位置
        wx.getSetting({
          success: function (res) {
            console.log(res);
            if (res.authSetting['scope.userLocation']) {
              console.log("userpositionpromise 已经获取用户位置授权了");
              resolve();
            }
            else {
              reject(new Error("没有获取位置授权，将通过wx.authorize获取用户位置获取"));
            }
          },
          fail: function (res) {
            console.log("调用wx.getSetting（）失败，将通过wx.authorize获取用户位置获取");
            reject(new Error("调用wx.getSetting（）失败"));
          }
        });
      });
      return userpositionpromise;
    }

    //向用户获取位置权限
    function getlocaltionauthorizepromise() {

      var authorizepromise = new Promise(function (resolve, reject) {
        wx.authorize({
          scope: "scope.userLocation",
          success: function () {
            console.log("用户同意授权位置权限");
            resolve();
          },
          fail: function () {
            console.log("用户拒绝授权位置权限");
            reject(new Error("用户拒绝授权位置权限"));
          }
        });
      });
      return authorizepromise;
    }

    //获取用户位置信息（经纬度信息）
    function getlocationpromise() {

      var longitudeandlatitude = new Promise(function (resolve, reject) {
        wx.getLocation({
          success: function (res) {
            console.log("经度" + res.latitude);
            console.log("纬度" + res.longitude);
            var latitude = res.latitude;
            var longitude = res.longitude;
            resolve({la: latitude, lo: longitude});
          },
          fail: function (res) {
            console.log("getLocationpromise", res);
            reject(new Error("wx.getLocation获取用户位置失败"));
          }
        });
      });
      return longitudeandlatitude;
    }

    function getstorespromise(localinfo) {
      var data = { latitude: localinfo.la, longitude: localinfo.lo };

      if (filter_index == 0)
        data.distance = 5
      if (filter_index == 1)
        data.sales = 5
      if (filter_index == 2)
        data.consume = 5

      console.log("data",data)

      wx.request({
        url: durl + "/store/getnearbyshops",
        header: { Cookie: "JSESSIONID=" + app.globalData.session },
        data: data,
        success: function success(res) {
          if ('Set-Cookie' in res.header) {
            console.log("用户JSESSIONID：", res.header["Set-Cookie"].split(";")[0].split("=")[1]);
            app.globalData.session = res.header["Set-Cookie"].split(";")[0].split("=")[1];
          }
          console.log("res.data.data", res.data.data)
          storelist = res.data.data;
          for (var i = 0; i < storelist.length; i++) {
            storelist[i].type = storelist[i].type.split(",");
            storelist[i].imgsrc = durl + "/static/image/recommendimg" + storelist[i].id + ".jpg";
          }
          pageobject.setData({
            store: storelist,
            filterindex: filter_index
          })
        }
      })
    }
    
    function change() {
      //检查用户是否授予定位权限
      positionpromise()
        .catch(function (res) {
          //向用户获取位置权限
          return getlocaltionauthorizepromise();
        })
        .then(function (res) {
          //获取用户位置信息（经纬度信息）
          return getlocationpromise();
        })
        .then(function (res) {
          getstorespromise(res)
        })
    }

    pageobject.change = change;

    change();

    var systime = this.getSysTimeHM();
    console.log(systime)
    this.setData({
      systime: systime
    })

  },

  openstore: function (event) {
    console.log("点击第" + event.currentTarget.dataset.id)
    let str = JSON.stringify(storelist[event.currentTarget.dataset.id]);
    console.log(str)
    wx.navigateTo({
      url: '../store/commodity?storeinfo=' + str
    })
  },

  changefilter: function (event){
    var index = event.target.dataset.index;
    filter_index = index;
    this.change();
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})