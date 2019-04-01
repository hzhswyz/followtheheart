// pages/manage/manage.js
const app = getApp();
var durl = app.globalData.dynamicrequest;
var userloginJs = require('../../userlogin.js');
var storelist;
var pageobject;
var showwidth;
var showheight;
var wxCharts = require('../lib/wx-charts-master/dist/wxcharts.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isMainChartDisplay: true,
    nvabarData: {
    showCapsule: 1, //是否显示左上角图标
    title: '我的商店', //导航栏 中间的标题
    navbackground: "white"
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 26
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    pageobject = this;
    wx.getSystemInfo({
      success: (res) => {
        showwidth = res.windowWidth * 0.97;
        showheight = showwidth / 1.6;
        //console.log("宽度：",showwidth,"高度：",showheight);
        pageobject.setData({
          showwidth: showwidth,
          showheight: showheight
        })
      }
    });

    userloginJs.userloginprocess().then(function () {
      wx.request({
        url: durl + "/store/getmystores",
        header: { Cookie: "JSESSIONID=" + app.globalData.session },
        success: function (res) {
          console.log("我的商店:", res.data.data)
          storelist = res.data.data;
          var wc = 0;
          for (var i = 0; i < storelist.length; i++) {

            storelist[i].storeInfomation.imgsrc = durl + "/static/image/recommendimg" + storelist[i].storeInfomation.id + ".jpg";
            storelist[i].storeInfomation.type = storelist[i].storeInfomation.type.split(",");

            let chart = new wxCharts({
              background: 'rgba(255, 255, 255, 0)',
              canvasId: 'columnCanvas' + i,
              type: 'column',
              categories: storelist[i].thePastSixMonthsSaleAndCost.date,
              series: [{
                name: '成本',
                data: storelist[i].thePastSixMonthsSaleAndCost.costlist,
                color: '#ff6600',
              }, {
                name: '销售额',
                  data: storelist[i].thePastSixMonthsSaleAndCost.salelist
              }],
              xAxis: {
                gridColor: '#ffffff',
                fontColor: '#ffffff',
                disableGrid: true
              },
              yAxis: {
                gridColor: '#ffffff',
                fontColor: '#ffffff',
                titleFontColor: '#ffffff',
                format: function (val) {
                  return val + '元';
                }
              },
              extra: {
                legendTextColor: 'white'
              },
              width: showwidth,
              height: showheight * 0.86
            });
            chart.addEventListener('renderComplete', () => {
              // your code here
              wc += 1;
              if (wc == storelist.length){
                pageobject.setData({
                  ifshowcoverview: true
                })
              }
            });
          }
          pageobject.setData({
            storelist: storelist
          })
        }
      });
    })

  },

  openstore: function (event) {
    console.log("点击第" + event.currentTarget.dataset.id)
    let str = JSON.stringify(storelist[event.currentTarget.dataset.id].storeInfomation);
    console.log(str)
    wx.navigateTo({
      url: 'modifycommodity/modifycommodity?storeinfo=' + str
    })
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