// pages/manage/modifycommodity/modifycommodity.js
var foodtypeindex = 0;
const app = getApp();
var durl = app.globalData.dynamicrequest;
var store_info;
var pageobject;
var food_list;
var userloginJs = require('../../../userlogin.js');
var isshoweditfood = false;
var editfood;
var tempimgsrc;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    starssrc: "/pages/static/img/indexpage/stars.png",
    typeindex: foodtypeindex,
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标
      title: '商店管理', //导航栏 中间的标题
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    pageobject = this;
    wx.getSystemInfo({
      success: (res) => {
        var showwidth = res.windowWidth / 2;
        var showheight = showwidth * 0.6;
        app.globalData.windowHeight = res.windowHeight;
        console.log("conmmodity windowheight", res.windowHeight)
        //console.log("宽度：", showwidth, "高度：", showheight);
        pageobject.setData({
          showheight: showheight
        })
      }
    });
    let storeinfo = JSON.parse(options.storeinfo);
    storeinfo.image = durl + "/static/image/" + storeinfo.id + "image.jpg"
    store_info = storeinfo;
    this.setData({
      store: storeinfo,
      issalearray: ['禁售',"在售"],
      nvabarData: {
        showCapsule: 1, //是否显示左上角图标
        title: storeinfo.name, //导航栏 中间的标题
        navbackground: "#f9d423"
      }
    })
    console.log("用户JSESSIONID： " + app.globalData.session);
    wx.request({
      url: durl + "/store/getstorefoods?storeid=" + storeinfo.id,
      header: { Cookie: "JSESSIONID=" + app.globalData.session },
      success: function success(res) {
        if ('Set-Cookie' in res.header) {
          console.log("用户JSESSIONID：", res.header["Set-Cookie"].split(";")[0].split("=")[1]);
          app.globalData.session = res.header["Set-Cookie"].split(";")[0].split("=")[1];
        }
        var foodlist = res.data.data;
        console.log("foodlist:", foodlist); 
        for (var i = 0; i < foodlist.length; i++) {
          foodlist[i].imgsrc = durl + "/static/image/food/food" + foodlist[i].id + ".jpg";
        }
        food_list = foodlist;
        pageobject.setData({
          foodlist: foodlist
        })
      }
    })
    pageobject.setData({
      screenHeight: app.globalData.windowHeight - 105 - (app.globalData.height * 2 + 20)
    })

  },

  editfood: function (event) {
    let index = event.currentTarget.dataset.indexid;
    editfood = food_list[index];
    console.log("商品ID", editfood.id)
    pageobject.setData({
      isshoweditfood: true,
      editfood: editfood,
      tempimgsrc: editfood.imgsrc
    })
  },

  isshowout:function(){
    pageobject.setData({
      isshoweditfood: false
    })
  },

  donothing:function(){

  },

  issalepickerbindchange: function (event){
    editfood.issale = parseInt(event.detail.value);
    pageobject.setData({
      editfood: editfood
    })
  },

  typepickerbindchange: function (event){
    editfood.type = parseInt(event.detail.value);
    pageobject.setData({
      editfood: editfood
    })
  },


  

  choseimg:function(){

    function getcameraauth() {
      var cameraauth = new Promise(function (resolve, reject) {
        wx.authorize({
          scope: "scope.camera",
          success() {
            resolve();
          },
          fail(){
            resolve();
          }
        });
      })
      return cameraauth;
    };

    function getimg(){
      var getimg = new Promise(function (resolve, reject) {
        wx.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          success: function (res) {
            tempimgsrc = res.tempFilePaths;
            pageobject.setData({
            tempimgsrc: tempimgsrc
            })
          },
          fail: function () {

          }
        });
      })
      return getimg;
    }

    getcameraauth().then(function () {
      return getimg();
    })

  },

  formsubmit:function(event){
    console.log(event.detail.value);
   /* userloginJs.userloginprocess().then(function () {
      wx.request({
        url: durl + "/rest/food/editnameandprice",
        data: { id: event.detail.value.foodid, name: event.detail.value.name, price: event.detail.value.price},
        method:'POST',
        header: { Cookie: "JSESSIONID=" + app.globalData.session, 'content-type': "application/x-www-form-urlencoded" },
        success: function (res) {
          if (res.data.status == 500) {
            wx.showToast({
              title: res.data.reason
            })
          }
          else {
            wx.showToast({
              title:"修改成功"
            })
            food_list[event.detail.value].name = event.detail.value.name;
            food_list[event.detail.value].price = event.detail.value.price;
            food_list[event.detail.value].cost = event.detail.value.cost;
            food_list[event.detail.value].issale = event.detail.value.issale;
            food_list[event.detail.value].type = event.detail.value.type;
            food_list[event.detail.value].material = event.detail.value.material;
            pageobject.setData({
              isshoweditfood: false
            })
            console.log(res.data);
          }
        }
      })
    })*/
  },

  formreset:function(){
    tempimgsrc = null;
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