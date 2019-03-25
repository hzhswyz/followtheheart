//index.js
//获取应用实例
const app = getApp();
var durl = app.globalData.dynamicrequest;
var QQMapWX = require('../lib/map/qqmap-wx-jssdk.js');
var qqmapsdk;
var WxSearch = require('../../wxSearch/wxSearch.js');
var position = "定位中";
var store_list;
var userinfo = {};
var search_display= false;
var tabbarishide = false;
Page({
  data: {
    // wxSearchData:{
    //   view:{
    //     isShow: true
    //   }
    // }
    positioncomplete:false,
    position:position,
    nvabarData: {
      showCapsule: 0, //是否显示左上角图标
      title: '随心菜单', //导航栏 中间的标题
      navbackground: "white"
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,
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
        bindtapfunction: 'clickreservation',
        imgsrc: "/pages/static/img/indexpage/titlecontent1.png",
      titletext: "预定"
    }, {
        bindtapfunction: 'clickorderlist',
        imgsrc: "/pages/static/img/indexpage/titlecontent2.png",
      titletext: "订单"
    }, {
        bindtapfunction: 'clicknearbyshop',
        imgsrc: "/pages/static/img/indexpage/titlecontent3.png",
      titletext: "商店"
    }, {
      bindtapfunction: 'clickactivity',
        imgsrc: "/pages/static/img/indexpage/titlecontent4.png",
      titletext: "活动"
    }],
    //图片滑动窗口对象数组 “imgsrc”=图片路径
    swiperarray: [{
      imgsrc: durl+"/static/image/shareswiper1.png"
    }, {
        imgsrc: durl +"/static/image/shareswiper2.png"
    }, {
        imgsrc: durl +"/static/image/shareswiper3.png"
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

    wx.getSystemInfo({
      success: (res) => {
        var showwidth = res.windowWidth*0.97;
        var showheight = showwidth/1.6;
        console.log("宽度：",showwidth,"高度：",showheight);
        pageobject.setData({
          showwidth: showwidth,
          showheight: showheight
        })
      }
    });
    
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
    //捕获获取位置失败时发生的异常
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
            reject(new Error("用户拒绝授权位置权限"));
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
            reject(new Error("wx.getLocation获取用户位置权限失败"));
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
              str = str.substring(0, 4) +"‧‧‧";
            }
            position = str;
            console.log("经纬度转地址成功：" + str);
            pageobject.setData({
              positioncomplete: true,
              position: position
            });
            resolve();
          },
          fail: function (res) {
            console.log(res);
            reject(new Error("经纬度转换失败"));
          }
        });
      });
      return getuseraddresspromise;
    }).then(function(){
      //通过request请求得到附件精选商户列表
      var getstorelistpromise = new Promise(function (resolve, reject) {
        console.log("用户JSESSIONID: " + app.globalData.session)
        wx.request({
          url: durl + "/store/getrecommendationstore",
          header: { Cookie: "JSESSIONID=" + app.globalData.session },
          success: function success(res) {
            if ('Set-Cookie' in res.header) {
              console.log("用户JSESSIONID：", res.header["Set-Cookie"].split(";")[0].split("=")[1]);
              app.globalData.session = res.header["Set-Cookie"].split(";")[0].split("=")[1];
            }
            console.log("回复",res)
            var storelist = res.data.data;
            console.log("商店列表：");
            console.log(storelist);
            store_list = storelist;
            resolve();
          },
          dataType: "json",
          fail: function (res) {
            reject(new Error("获取附件精选商户列表失败"));
          }
        });
      });
      return getstorelistpromise;
      }).then(function () {
        pageobject.setData({
          Recommendarray: store_list,
          position: position
        })
      })
        //通过qqmapsdk.calculateDistance获得用户与商店的距离
      .then(function(){
      var getdistancetpromise = new Promise(function (resolve, reject) {
        console.log("获得用户与商店的距离");
        var count = 0;
        for (var i = 0; i < store_list.length; i++) {
          store_list[i].imgsrc = durl + "/static/image/recommendimg" + store_list[i].id + ".jpg";
          store_list[i].type = store_list[i].type.split(",");
          qqmapsdk.calculateDistance({
            //num避免success中store_list[i]产生闭包
            num:i,
            from: {
              latitude: userinfo.latitude,
              longitude: userinfo.longitude
            },
            to: [{
              latitude: store_list[i].storeaddress.latitude,
              longitude: store_list[i].storeaddress.longitude
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
   
   

    //初始化的时候渲染wxSearchdata
    WxSearch.init(pageobject, 50 + app.globalData.height * 2 + 20, ['小炒肉', '肉末茄子', '茄子牛肉', '麻辣串串香', '大盘鸡']);
    WxSearch.initMindKeys(['小炒肉', '肉末茄子', '茄子牛肉', '麻辣串串香', '大盘鸡']);

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
  },
  /*onPageScroll: function (ev) {
    var _this = this;
    //当滚动的top值最大或者最小时，为什么要做这一步是由于在手机实测小程序的时候会发生滚动条回弹，所以为了解决回弹，设置默认最大最小值   
    if (ev.scrollTop <= 0) {
      ev.scrollTop = 0;
    } else if (ev.scrollTop > wx.getSystemInfoSync().windowHeight) {
      ev.scrollTop = wx.getSystemInfoSync().windowHeight;
    }
    //判断浏览器滚动条上下滚动   
    if (ev.scrollTop > this.data.scrollTop || ev.scrollTop == wx.getSystemInfoSync().windowHeight) {
      if (!tabbarishide){
        wx.hideTabBar({ animation: true })
        tabbarishide = !tabbarishide;
        console.log('向下滚动');
      }
    } else {
      
      if (tabbarishide) {
        wx.showTabBar({ animation: true })
        tabbarishide = !tabbarishide;
        console.log('向上滚动');
      }
      
    }
    //给scrollTop重新赋值    
    setTimeout(function () {
      _this.setData({
        scrollTop: ev.scrollTop
      })
    }, 0)
  }*/

})
