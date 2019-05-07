// pages/searchfood/searchfood.js
const app = getApp();
var durl = app.globalData.dynamicrequest;
var storelist = [];
var latitude = null;
var longitude = null;
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
  onLoad: function (options) {
    storelist = [];
    currentpage = 1;
    pageobject = this;
    keyword = options.keyword;
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
            latitude = res.latitude;
            longitude = res.longitude;
            resolve({ la: latitude, lo: longitude });
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

      //没有执行getlocationpromise（）方法情况下
      if (localinfo == undefined) {
        localinfo = {};
        localinfo.la = latitude;
        localinfo.lo = longitude;
      }

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
    }

    function change() {
      //检查用户是否授予定位权限
      positionpromise()
        .catch(function (res) {
          //向用户获取位置权限
          return getlocaltionauthorizepromise();
        })
        .then(function (res) {
          if (latitude == null || longitude == null || (latitude == 0 && longitude == 0)) {
            //获取用户位置信息（经纬度信息）
            return getlocationpromise();
          }
        })
        .then(function (res) {
          getstorespromise(res)
        })
    }

    pageobject.change = change;

    change();

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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})