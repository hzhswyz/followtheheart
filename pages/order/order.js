// pages/order/order.js
const app = getApp();
var durl = app.globalData.dynamicrequest;
var pageobject;

//已加载订单数量，用于赋值订单的sequenceid
var listsize = 0;
//当前加载的页数
var currentpage = 1;
//用于判断是否是点击查看详情页面后放回订单界面
var isviewdetails = false;
//点击详情的序列id
var touchsequenceid = 0;
//订单数组
var orderlistarray = [];

var userloginJs = require('../../userlogin.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 0, //是否显示左上角图标
      title: '我的订单', //导航栏 中间的标题
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 26,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    pageobject = this;
    wx.getSystemInfo({ 
      success: (res) => {
        app.globalData.windowHeightminusttabbar = res.windowHeight
        console.log("order windowHeightminusttabbar", res.windowHeight)
      }
    })
    this.setData({
      screenHeight: app.globalData.windowHeightminusttabbar - (app.globalData.height * 2 + 26)
    })
  },


  getdata: function (){
    userloginJs.userloginprocess().then(function () {

      wx.request({
        url: durl + "/order/gerorderlist",
        data: { currentpage: currentpage },
        header: { Cookie: "JSESSIONID=" + app.globalData.session },
        success: function (res) {
          if (res.data.status == 500) {
            wx.showToast({
              title: res.data.reason
            })
          }
          else {
            wx.hideLoading();
            console.log(res.data);
            //更改时间显示格式
            for (var i = 0; i < res.data.data.length; i++) {
              //序列id
              res.data.data[i].content = JSON.parse(res.data.data[i].content);
              res.data.data[i].sequenceid = listsize++;
              //商店头像
              res.data.data[i].store.image = durl + "/static/image/" + res.data.data[i].store.id + "image.jpg";
              if (res.data.data[i].paymenttime != null) {
                var d = new Date(res.data.data[i].paymenttime);
                var date = (d.getFullYear()) + "-" +
                  (d.getMonth() + 1) + "-" +
                  (d.getDate()) + " " +
                  (d.getHours()) + ":" +
                  (d.getMinutes()) + ":" +
                  (d.getSeconds());
                res.data.data[i].paymenttime = date;
                var d2 = new Date(res.data.data[i].transactiondate);
                var date2 = (d2.getFullYear()) + "-" +
                  (d2.getMonth() + 1) + "-" +
                  (d2.getDate()) + " " +
                  (d2.getHours()) + ":" +
                  (d2.getMinutes()) + ":" +
                  (d2.getSeconds());
                res.data.data[i].transactiondate = date2;
              }
            }
            //将加载后的数据添加到原数组
            orderlistarray = orderlistarray.concat(res.data.data);

            pageobject.setData({
              orderlist: orderlistarray
            });
          }
        }
      })

    }, function (err){
      wx.showToast({
        title: err.message,
        image:'/pages/static/img/indexpage/loginfail.png'
      })
    });
    
  },


  getdatabyorderid: function () {

    userloginJs.userloginprocess().then(function () {

      
      wx.request({
        url: durl + "/order/getorderandstore",
        data: { orderid: orderlistarray[touchsequenceid].id },
        header: { Cookie: "JSESSIONID=" + app.globalData.session },
        success: function (res) {
          if (res.data.status == 500) {
            wx.showToast({
              title: res.data.reason
            })
          }
          else {
            wx.hideLoading();
            console.log(res.data);
            //更改时间显示格式
            res.data.data.store.image = durl + "/static/image/" + res.data.data.store.id + "image.jpg";
            if (res.data.data.paymenttime != null) {
              var d = new Date(res.data.data.paymenttime);
              var date = (d.getFullYear()) + "-" +
                (d.getMonth() + 1) + "-" +
                (d.getDate()) + " " +
                (d.getHours()) + ":" +
                (d.getMinutes()) + ":" +
                (d.getSeconds());
              res.data.data.paymenttime = date;
              var d2 = new Date(res.data.data.transactiondate);
              var date2 = (d2.getFullYear()) + "-" +
                (d2.getMonth() + 1) + "-" +
                (d2.getDate()) + " " +
                (d2.getHours()) + ":" +
                (d2.getMinutes()) + ":" +
                (d2.getSeconds());
              res.data.data.transactiondate = date2;
            }
          }
          res.data.data.sequenceid = touchsequenceid;
          res.data.data.content = JSON.parse(res.data.data.content);
          //更新查看的详情后的订单
          orderlistarray[touchsequenceid] = res.data.data;

          pageobject.setData({
            orderlist: orderlistarray,
          });

        }
      });



    });

  },

  // 当距离scroll-view底部距离小于50像素时触发回调
  scrolltolower: function () {
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    currentpage++;
    this.getdata()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.showLoading({
      title: '正在加载',
      mask: true
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //点击tabbar进入的，需要置顶
    if(!isviewdetails){
     
     //scrollview置顶
      pageobject.setData({
        scrollTop : 0
      });

      //初始化参数
      orderlistarray = [];
      currentpage = 1;
      listsize = 0;
      touchsequenceid = 0;
      this.getdata()
      
    }else{
      //恢复标志
      isviewdetails = false;

      this.getdatabyorderid();
    }
   
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

  },
  vieworderdetails:function (event){
    touchsequenceid = event.currentTarget.dataset.sequenceid;
    isviewdetails = true;
    console.log(event,"查看订单详情")
    wx.navigateTo({
      url: 'orderdetails?orderid=' + event.currentTarget.dataset.orderid
    })
  },

})