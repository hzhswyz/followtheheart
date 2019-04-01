// pages/nearbyshop/nearbyshop.js
const app = getApp();
var pageobject;
var filter_index = 0;
var durl = app.globalData.dynamicrequest;
var storelist;
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