//index.js
//获取应用实例
const app = getApp();
var durl = app.globalData.dynamicrequest;
var QQMapWX = require('../lib/map/qqmap-wx-jssdk.js');
var qqmapsdk;
var WxSearch = require('../../wxSearch/wxSearch.js');
var userloginJs = require('../../userlogin.js');
var position = "定位中";
//获取的商店列表
var store_list = [];
var search_display= false;
//代表当前商店列表的总数
var sumindex = 0;
//pageobject为page对象
var pageobject;
var titlearray;
//当前页
var currentpage = 1;
//经纬度
var latitude = null;
var longitude = null;
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
    height: app.globalData.height * 3,
    searchdisplay: search_display,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    swipercurrentindex: 0,
    //图片滑动窗口对象数组 “imgsrc”=图片路径
    swiperarray: [{
      imgsrc: durl + "/static/image/shareswiper1.png"
    }, {
      imgsrc: durl + "/static/image/shareswiper2.png"
    }, {
      imgsrc: durl + "/static/image/shareswiper3.png"
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
    pageobject = this;
    wx.getSystemInfo({
      success: (res) => {
        var showwidth = res.windowWidth*0.97;
        var showheight = showwidth/1.6;
        pageobject.setData({
          showwidth: showwidth,
          showheight: showheight
        })
      }
    });

    //初始化的时候渲染wxSearchdata
    WxSearch.init(pageobject, 50 + app.globalData.height * 2 + 20, ['小炒肉', '肉末茄子', '茄子牛肉', '麻辣串串香', '大盘鸡']);
    WxSearch.initMindKeys(['小炒肉', '肉末茄子', '茄子牛肉', '麻辣串串香', '大盘鸡']);

    //顶端图标对象数组 “bindtapfunction:”=点击回调函数“ “titletext”=图标对应的名称 imgsrc”=图片路径
    titlearray = [{
      bindtapfunction: 'clickorder',
      imgsrc: "/pages/static/img/indexpage/titlecontent0.png",
      titletext: "点餐"
    }, {
      bindtapfunction: 'clickreservation',
      imgsrc: "/pages/static/img/indexpage/titlecontent1.png",
      titletext: "预定"
    }, {
      bindtapfunction: 'clicknearbyshop',
      imgsrc: "/pages/static/img/indexpage/titlecontent3.png",
      titletext: "商店"
    }, {
      bindtapfunction: 'clickactivity',
      imgsrc: "/pages/static/img/indexpage/titlecontent4.png",
      titletext: "活动"
    }];

    pageobject.setData({
      titlearray: titlearray
    });

    //获取腾讯地图API
    qqmapsdk = new QQMapWX({
      key: 'OKWBZ-H3RRF-D76JH-JE5BA-U5FQ5-NXBTH'
    });

    this.getData();
    this.relogin();
  },

  //用户登录，确定用户是商户后显示商户管理图标
  relogin:function(){
    userloginJs.userloginprocess().then(function () {
      if (app.globalData.userInfo.IsBusiness) {
        titlearray[4] = {
          bindtapfunction: 'clickmanage',
          imgsrc: "/pages/static/img/indexpage/titlecontent2.png",
          titletext: "管理"
        };
      }
      pageobject.setData({
        titlearray: titlearray
      })
    }).catch(function (error) {
      wx.showModal({
        content: error.message,
        confirmText: "重新登陆",
        showCancel: false,
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            pageobject.relogin();
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        },
        fail(res) {
          console.log('用户点击取消')
        }
      })
    });
  },


  //加载精选商户
  getData: function () {

    wx.showLoading({
      title: '正在加载',
      mask: true
    })

    //检查用户是否授予定位权限
    function positionpromise() {
      var userpositionpromise = new Promise(function (resolve, reject) {
        //获取用户位置
        wx.getSetting({
          success: function (res) {
            console.log("权限信息", res);
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
            resolve();
          },
          fail: function (res) {
            console.log("getLocationpromise", res);
            reject(new Error("wx.getLocation获取用户位置失败"));
          }
        });
      });
      return longitudeandlatitude;
    }

    //进行经纬度转街道地址
    function addresstranslationpromise() {
      var getuseraddresspromise = new Promise(function (resolve, reject) {
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function (res) {
            console.log("经纬度转地址: ", res);
            var str = "无法定位";
            str = res.result.address_component.street;
            if (str.length >= 6) {
              str = str.substring(0, 4) + "‧‧‧";
            }
            position = str;
            console.log("经纬度转街道地址成功：" + str);
            pageobject.setData({
              positioncomplete: true,
              position: position
            });
            resolve();
          },
          fail: function (res) {
            console.log("getuseraddresspromise", res);
            reject(new Error("经纬度转换失败"));
          }
        });
      });
      return getuseraddresspromise;
    }

    //获取推荐商店
    function getstorespromise() {
      var getstorelistpromise = new Promise(function (resolve, reject) {
        console.log("向服务器发送JSESSIONID：" + app.globalData.session)
        wx.request({
          url: durl + "/store/getrecommendationstore?currentpage=" + currentpage,
          header: { Cookie: "JSESSIONID=" + app.globalData.session },
          success: function success(res) {
            if ('Set-Cookie' in res.header) {
              console.log("服务器返回的JSESSIONID：", res.header["Set-Cookie"].split(";")[0].split("=")[1]);
              app.globalData.session = res.header["Set-Cookie"].split(";")[0].split("=")[1];
            }
            var storelist = res.data.data;
            console.log("商店列表：", storelist);
            if (storelist.length == 0) {
              reject(new Error("no data"));
            }
            store_list = store_list.concat(storelist);
            resolve();
          },
          fail: function (res) {
            reject(new Error("获取附件精选商户列表失败"));
          }
        });
      });
      return getstorelistpromise;
    }

    function sleep(d) {
      for (var t = Date.now(); Date.now() - t <= d;);
    }

    //利用商店经纬度信息与用户经纬度信息计算双方距离
    function getstoredistancetpromise() {
      var getdistancetpromise = new Promise(function (resolve, reject) {
        for (var i = sumindex; i < store_list.length; i++) {
          store_list[i].imgsrc = durl + "/static/image/recommendimg" + store_list[i].id + ".jpg";
          store_list[i].type = store_list[i].type.split(",");
          //避免key到达请求上限
          sleep(300);
          qqmapsdk.calculateDistance({
            //num避免success中store_list[i]产生闭包
            num: i,
            from: {
              latitude: latitude,
              longitude: longitude
            },
            to: [{
              latitude: store_list[i].storeaddress.latitude,
              longitude: store_list[i].storeaddress.longitude
            }],
            success: function (res) {
              sumindex++;
              console.log("store_list[" + this.num + "] 距离用户：" + res.result.elements[0].distance + "m")
              store_list[this.num].distance = res.result.elements[0].distance;
              if (sumindex == store_list.length) {
                resolve();
              }
            },
            fail: function (res) {
              console.log(res);
              reject(new Error("请求达到上限"));
            }
          });
        }
      });
      return getdistancetpromise;
    }

    function needGetLatitudeAndLongitude(){
      if (latitude == null || longitude == null) {
        console.log("需要获取经纬度")
        return positionpromise()
          .catch(function () {
            //向用户获取位置权限
            return getlocaltionauthorizepromise();
          })
          .then(function () {
            //获取用户位置信息（经纬度信息）
            return getlocationpromise();
          })
          .then(
            //进行经纬度转街道地址
            addresstranslationpromise
          )
          .then(
            //获取推荐商店
            getstorespromise
          );
      }else{
        console.log("不需要获取经纬度")
        return getstorespromise();
      }
    }

    needGetLatitudeAndLongitude()
    .then(function () {
        pageobject.setData({
          position: position
        })
      })
      .then(
        //利用商店经纬度信息与用户经纬度信息计算双方距离
        getstoredistancetpromise
      )
      .then(function () {
        wx.hideLoading();
        console.log("dddd", store_list)
        pageobject.setData({
          recommendarray: store_list
        })
      }).catch(function (mes) {
        if (mes.message == 'no data') {
          wx.showToast({
            icon: "none",
            title: "没有更多数据了",
          })
          return;
        }
        console.log(mes)
        wx.showModal({
          content: mes.message,
          confirmText: "重新加载",
          showCancel: false,
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
              pageobject.getData();
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          },
          fail(res) {
            console.log('用户点击取消')
          }
        })
      });

  },

  //用户点击分享
  onShareAppMessage(Object){
    var url = "/pages/index/share.png";
    return {
      title: '随心菜单',
      path: '/pages/index/index',
      imageUrl:url
    }
  },

/*
  handleTap3: function (event) {
    console.log("handleTap3",event)
  },

  handleTap2: function (event) {
    console.log("handleTap2",event)
  },

  handleTap1: function (event) {
    console.log("handleTap1",event)
  },*/

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

  //点击商店
  openstore: function (event){
    console.log("点击第"+event.currentTarget.dataset.id)
    let str = JSON.stringify(store_list[event.currentTarget.dataset.id]);
    console.log(str)
    wx.navigateTo({
      url: '../store/commodity?storeinfo='+str
    })
  },


  /**
     * 生命周期函数--监听页面显示
     */
  onShow: function () {
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    currentpage++;
    this.getData();
  },
  onReady: function(){

  }
})
