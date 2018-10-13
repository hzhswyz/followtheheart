//index.js
//获取应用实例
const app = getApp();
var rurl = app.globalData.requestdomainname;
var QQMapWX = require('../lib/map/qqmap-wx-jssdk.js');
var qqmapsdk;
var WxSearch = require('../../wxSearch/wxSearch.js');
var position = "";
var store_list;
Page({
  data: {
    // wxSearchData:{
    //   view:{
    //     isShow: true
    //   }
    // }
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
    qqmapsdk = new QQMapWX({
      key: 'OKWBZ-H3RRF-D76JH-JE5BA-U5FQ5-NXBTH'
    });
    //pageobject为page对象
    var pageobject = this;
    //获取用户位置
    wx.getSetting({
      success: function (res){
        console.log(res);
        if ("scope.userLocation" in res.authSetting){
          console.log("已经获取用户位置授权了");
          wx.getLocation({
            success: function (res) {
   
              console.log("经度"+res.latitude);
              console.log("纬度"+res.longitude);
             
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
      url: rurl +"/getrecommendationstore?format=json",
      success: function success(res){
        var storelist = res.data.pageList;
        console.log(storelist);
        for (var i = 0; i < storelist.length; i++)
          storelist[i].imgsrc = rurl +"/static/image/recommendimg" + storelist[i].id +".jpg";
        store_list = storelist;
        pageobject.setData({
          Recommendarray: storelist
        })
      },
      dataType:"json"
    });

    //初始化的时候渲染wxSearchdata
    WxSearch.init(pageobject, 43, ['weappdev', '小程序', 'wxParse', 'wxSearch', 'wxNotification']);
    WxSearch.initMindKeys(['weappdev.com', '微信小程序开发', '微信开发', '微信小程序']);

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
  }, wxSearchFn: function (e) {
    var that = this
    WxSearch.wxSearchAddHisKey(that);

  },
  wxSearchInput: function (e) {
    var that = this
    WxSearch.wxSearchInput(e, that);
  },
  wxSerchFocus: function (e) {
    var that = this
    WxSearch.wxSearchFocus(e, that);
  },
  wxSearchBlur: function (e) {
    var that = this
    WxSearch.wxSearchBlur(e, that);
  },
  wxSearchKeyTap: function (e) {
    var that = this
    WxSearch.wxSearchKeyTap(e, that);
  },
  wxSearchDeleteKey: function (e) {
    var that = this
    WxSearch.wxSearchDeleteKey(e, that);
  },
  wxSearchDeleteAll: function (e) {
    var that = this;
    WxSearch.wxSearchDeleteAll(that);
  },
  wxSearchTap: function (e) {
    var that = this
    WxSearch.wxSearchHiddenPancel(that);
  },
  openstore: function (event){
    console.log("点击第"+event.currentTarget.dataset.id)
    let str = JSON.stringify(store_list[event.currentTarget.dataset.id]);
    wx.navigateTo({
      url: '../store/commodity?storeinfo='+str
    })
  }
})
