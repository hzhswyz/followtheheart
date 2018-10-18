//index.js
//获取应用实例
const app = getApp();
var rurl = app.globalData.requestdomainname;
var QQMapWX = require('../lib/map/qqmap-wx-jssdk.js');
var qqmapsdk;
var WxSearch = require('../../wxSearch/wxSearch.js');
var position = "";
var store_list;
var userinfo = {};
var search_display= false;
Page({
  data: {
    // wxSearchData:{
    //   view:{
    //     isShow: true
    //   }
    // }
    searchdisplay: search_display,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    swipercurrentindex: 0,
    //顶端图标对象数组 “bindtapfunction:”=点击回调函数“ “titletext”=图标对应的名称 imgsrc”=图片路径
    titlearray: [{
      bindtapfunction: 'clickorder',
      imgsrc: "/pages/static/img/indexpage/titlecontent0.png",
      titletext: "点餐"
    }, {
      bindtapfunction: 'clickorder',
        imgsrc: "/pages/static/img/indexpage/titlecontent1.png",
      titletext: "预定"
    }, {
      bindtapfunction: 'clickorder',
        imgsrc: "/pages/static/img/indexpage/titlecontent2.png",
      titletext: "订单"
    }, {
      bindtapfunction: 'clickorder',
        imgsrc: "/pages/static/img/indexpage/titlecontent3.png",
      titletext: "商店"
    }, {
      bindtapfunction: 'clickorder',
        imgsrc: "/pages/static/img/indexpage/titlecontent4.png",
      titletext: "活动"
    }],
    //图片滑动窗口对象数组 “imgsrc”=图片路径
    swiperarray: [{
      imgsrc: rurl+"/static/image/shareswiper1.png"
    }, {
        imgsrc: rurl +"/static/image/shareswiper2.png"
    }, {
        imgsrc: rurl +"/static/image/shareswiper3.png"
    }],
    recommendationiconshop:"/pages/static/img/indexpage/shop.png",
    recommendationiconposition:"/pages/static/img/indexpage/position.png",
    recommendationiconsales:"/pages/static/img/indexpage/sales.png",
    recommendationiconconsume:"/pages/static/img/indexpage/consume.png",
    choiceimg: "/pages/static/img/indexpage/choice.png"
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  clickswiper: function(event){
    console.log(event.currentTarget.dataset.swipercurrentindex)
  },
  changswiperindex: function (event){
    this.setData({
      swipercurrentindex: event.detail.current
    })
  },


  onLoad: function () {

    //pageobject为page对象
    var pageobject = this;
    //获取腾讯地图API
    qqmapsdk = new QQMapWX({
      key: 'OKWBZ-H3RRF-D76JH-JE5BA-U5FQ5-NXBTH'
    });

    var userpositionpromise = new Promise(function (resolve, reject) {
      //获取用户位置
      wx.getSetting({
        success: function (res) {
          console.log(res);
          if ("scope.userLocation" in res.authSetting) {
            console.log("已经获取用户位置授权了");
            resolve();
          }
          else{
            reject(new Error("error:没有获取位置授权，将通过wx.authorize获取用户位置获取"));
          }
        },
        fail: function (res) {
          console.log("调用wx.getSetting（）失败，将通过wx.authorize获取用户位置获取");
          console.log(res);
          reject(new Error("调用wx.getSetting（）失败，将通过wx.authorize获取用户位置获取"));
        }
      });
    });
    userpositionpromise.catch(function (){
      //通过wx.authorize获取用户位置权限
      var authorizepromise = new Promise(function (resolve, reject) {
        wx.authorize({
          scope: "scope.userLocation",
          success: function () {
            console.log("用户同意授权位置权限");
            resolve();
          },
          fail: function () {
            console.log("用户拒绝授权位置权限");
            reject();
          }
        });
      });
      return authorizepromise;
    }).then(function(){
      //通过wx.getLocation获取用户位置权限
      var getLocationpromise = new Promise(function (resolve, reject) {
        wx.getLocation({
          success: function (res) {
            console.log("经度" + res.latitude);
            console.log("纬度" + res.longitude);
            userinfo.latitude = res.latitude;
            userinfo.longitude = res.longitude;
            resolve();
          },
          fail: function (res) {
            console.log(res);
            reject();
          }
        });    
      });
      return getLocationpromise;
    }).then(function (){
      //通过qqmapsdk.reverseGeocoder将经纬度转换为普通地址，精确到街道
      var getuseraddresspromise = new Promise(function (resolve, reject) {
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: userinfo.latitude,
            longitude: userinfo.longitude
          },
          success: function (res) {
            console.log("经纬度转地址");
            console.log( res);
            var str = "无法定位";
            str = res.result.address_component.street;
            if (str.length>=6){
              str = str.substring(0, 4) +"‧‧‧‧";
            }
            pageobject.setData({
              position: str
            });
            resolve();
          },
          fail: function (res) {
            console.log(res);
            reject();
          }
        });
      });
      return getuseraddresspromise;
    }).then(function(){
      //通过request请求得到附件精选商户列表
      var getstorelistpromise = new Promise(function (resolve, reject) {
        wx.request({
          url: rurl + "/getrecommendationstore?format=json",
          success: function success(res) {
            var storelist = res.data.pageList;
            console.log("商店列表：");
            console.log(storelist);
            store_list = storelist;
            resolve();
          },
          dataType: "json",
          fail: function (res) {
            reject();
          }
        });
      });
      return getstorelistpromise;
      })/*.then(function () {
        var storeaddressresolution = new Promise(function (resolve, reject) {
          var count = 0;
          for (var i = 0; i < store_list.length; i++) {
            console.log(store_list[i].position);
            qqmapsdk.geocoder({
              num:i,
              address: store_list[i].position,
              success: function (res) {
                count++;
                console.log("store_list[" + this.num + "]" + res.result.location);
                store_list[this.num].lat = res.result.location.lat;
                store_list[this.num].lng = res.result.location.lng;
                if (count == store_list.length) {
                  resolve();
                }
              },
              fail: function (res) {
                console.log("商店地址转经纬度失败"+res);
                reject(new Error("商店地址转经纬度失败"));
              },
              complete: function (res) {
                console.log(res);
              }
            });
          }
        })
        return storeaddressresolution;
      })*/.then(function(){
      //通过qqmapsdk.calculateDistance获得用户与商店的距离
      var getdistancetpromise = new Promise(function (resolve, reject) {
        var count = 0;
        for (var i = 0; i < store_list.length; i++) {
          store_list[i].imgsrc = rurl + "/static/image/recommendimg" + store_list[i].id + ".jpg";
          store_list[i].type = store_list[i].type.split(",");
          //console.log(store_list[i].storeAddress.latitude + "  " + store_list[i].storeAddress.longitude)
          qqmapsdk.calculateDistance({
            //num避免success中store_list[i]产生闭包
            num:i,
            from: {
              latitude: userinfo.latitude,
              longitude: userinfo.longitude
            },
            to: [{
              latitude: store_list[i].storeAddress.latitude,
              longitude: store_list[i].storeAddress.longitude
            }],
            success: function (res) {
              console.log(res);
              count++;
              console.log("store_list[" + this.num + "] 距离我：" + res.result.elements[0].distance+"m")
              store_list[this.num].distance = res.result.elements[0].distance;
              if (count == store_list.length){
                resolve();
              } 
            },
            fail: function (res) {
              console.log(res);
              reject();
            }
          });
        }
      });
      return getdistancetpromise;
    }).then(function(){
      pageobject.setData({
        Recommendarray: store_list
      })
    }).catch(function(mes){
      console.log(mes)
    })

   
    /*获取用户位置
    wx.getSetting({
      success: function (res){
        console.log(res);
        if ("scope.userLocation" in res.authSetting){
          console.log("已经获取用户位置授权了");
          wx.getLocation({
            success: function (res) {
   
              console.log("经度"+res.latitude);
              console.log("纬度"+res.longitude);
              userinfo.latitude = res.latitude;
              userinfo.longitude = res.longitude;
             
              qqmapsdk.reverseGeocoder({
                location: {
                  latitude: res.latitude,
                  longitude: res.longitude},
                success:function(res){
                  console.log(res);
                  pageobject.setData({
                    position: res.result.address_component.street
                  })
                },
                fail: function (res) {
                  console.log(res);
                }
              });


            },
            fail: function (res) {
              console.log(res);
            }
          });
        }
        else{
            console.log("提前向用户获取位置授权");
            wx.authorize({
            scope: "scope.userLocation",
            success: function () {
              console.log("获取用户位置授权成功")
              wx.getLocation({
                success: function (res) {
                  userinfo.latitude = res.latitude;
                  userinfo.longitude = res.longitude;
                  console.log(res.latitude);
                  console.log(res.longitude);
                  console.log(res.accuracy);
                  console.log(res.verticalAccuracy);
                  console.log(res.horizontalAccuracy);
                }
              });
            },
            fail: function () {
              console.log("获取用户位置授权失败")
            }
          });
        }
      }
    });
    

    //初始化的时候向服务器获取首页精选商户对象数组 “imgsrc”=图片路径
    wx.request({
      url: rurl + "/getrecommendationstore?format=json",
      success: function success(res) {
        var storelist = res.data.pageList;
        console.log(storelist);
        for (var i = 0; i < storelist.length; i++) {
          storelist[i].imgsrc = rurl + "/static/image/recommendimg" + storelist[i].id + ".jpg";
          console.log(storelist[i].latitude + "  " + storelist[i].longitude)
          qqmapsdk.calculateDistance({
            //num避免success中storelist[i]产生闭包
            num: i,
            from: {
              latitude: 29.972889,
              longitude: 106.276791
            },
            to: [{
              latitude: storelist[i].latitude,
              longitude: storelist[i].longitude
            }],
            success: function (res) {
              console.log(res)
              storelist[this.num].distance = res.result.elements[0].distance;
            },
            fail: function (res) {
              console.log(res);
            }
          });
        }
        store_list = storelist;
        pageobject.setData({
          Recommendarray: storelist
        })
      },
      dataType: "json"
    });*/



    //初始化的时候渲染wxSearchdata
    WxSearch.init(pageobject, 50, ['小炒肉', '肉末茄子', '茄子牛肉', '麻辣串串香', '大盘鸡']);
    WxSearch.initMindKeys(['小炒肉', '肉末茄子', '茄子牛肉', '麻辣串串香', '大盘鸡']);

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }


  },


  
  onShareAppMessage(Object){
    var url = "/pages/index/share.png";
    return {
      title: '随心菜单',
      path: '/pages/index/index',
      imageUrl:url
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  handleTap3: function (event) {
    console.log(event)
  },
  handleTap2: function (event) {
    console.log(event)
  },
  handleTap1: function (event) {
    console.log(event)
  },
   wxSearchFn: function (e) {
    console.log("wxSearchFn");
    var that = this
    WxSearch.wxSearchAddHisKey(that);
  },
  wxSearchInput: function (e) {
    console.log("wxSearchInput");
    var that = this
    WxSearch.wxSearchInput(e, that);
  },
  wxSearchFocus: function (e) {
    console.log("wxSearchFocus");
    this.setData({
      searchdisplay: true
    });
    var that = this
    WxSearch.wxSearchFocus(e, that);
  },
  wxSearchBlur: function (e) {
    console.log("wxSearchBlur");
    var that = this
    WxSearch.wxSearchBlur(e, that);
  },
  wxSearchKeyTap: function (e) {
    console.log("wxSearchKeyTap");
    var that = this
    WxSearch.wxSearchKeyTap(e, that);
  },
  wxSearchDeleteKey: function (e) {
    console.log("wxSearchDeleteKey");
    var that = this
    WxSearch.wxSearchDeleteKey(e, that);
  },
  wxSearchDeleteAll: function (e) {
    console.log("wxSearchDeleteAll");
    var that = this
    WxSearch.wxSearchDeleteAll(that);
  },
  wxSearchTap: function (e) {
    console.log("wxSearchTap");
    this.setData({
      searchdisplay: false
    })
    var that = this
    WxSearch.wxSearchHiddenPancel(that);
  },
  openstore: function (event){
    console.log("点击第"+event.currentTarget.dataset.id)
    let str = JSON.stringify(store_list[event.currentTarget.dataset.id]);
    console.log(str)
    wx.navigateTo({
      url: '../store/commodity?storeinfo='+str
    })
  }
})
