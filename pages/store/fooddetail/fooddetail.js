// pages/store/fooddetail/fooddetail.js
const app = getApp();
var pageobject;
var food;
var store_food_map = app.globalData.store_food_map;
var durl = app.globalData.dynamicrequest;
var food_list;
var totalnum;
var utils = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: app.globalData.height * 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    food_list = app.globalData.food_list;
    totalnum = app.globalData.totalnum;
    pageobject = this;
    wx.getSystemInfo({
      success: (res) => {
        var showheight = res.windowHeight;
        console.log("fooddetail windowheight:", showheight)
        pageobject.setData({
          showheight: showheight,
        })
      }
    });
    food = JSON.parse(options.food);
    pageobject.setData({
      food: food,
    });
    console.log(food);
  },
  /**
     * 用户添加菜品
     */
  addfood: function (event) {
    var foodid = event.target.dataset.foodid;
    console.log("添加菜品ID：" + foodid)
    console.log(food_list.length)
    for (var i = 0; i < food_list.length; i++) {
      if (food_list[i].id == foodid) {
        if ('num' in food_list[i]) {
          food_list[i].num++;
          food.num++;
        }
        else {
          food_list[i].num = 0;
          food_list[i].num++;
          food.num = 0;
          food.num++;
        }
        if (store_food_map.has(food.storeid)) {
          if (store_food_map.get(food.storeid).has(foodid))
            store_food_map.get(food.storeid).get(foodid).num = food_list[i].num;
          else
            store_food_map.get(food.storeid).set(foodid, { num: food_list[i].num, price: food_list[i].price, name: food_list[i].name });
        }
        else {
          var food_map = new Map();
          food_map.set(foodid, { num: food_list[i].num, price: food_list[i].price, name: food_list[i].name });
          store_food_map.set(food.storeid, food_map);
        }
      }
    }
    totalnum++;
    console.log(food.num)
    pageobject.setData({
      food: food
    })
  },
  /**
   * 用户减少菜品
   */
  reducefood: function (event) {
    var foodid = event.target.dataset.foodid;
    console.log("减少菜品ID：" + foodid)
    for (var i = 0; i < food_list.length; i++) {
      if (food_list[i].id == foodid) {
        food_list[i].num--;
        food.num--;
        if (food_list[i].num == 0) {
          store_food_map.get(food.storeid).delete(foodid);
        }
        else {
          (store_food_map.get(food.storeid).get(foodid).num)--;
        }
      }
    }
    totalnum--;
    pageobject.setData({
      food: food
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.request({
      url: durl + "/rest/comment/getFoodComment?foodid=" + food.id,
      success: function success(res) {
        if (res.data.status == 500) {
          wx.showToast({
            icon: "none",
            title: res.data.reason
          })
        }
        else {
          for (var item in res.data.data){
            res.data.data[item].time = utils.formatTime(new Date(res.data.data[item].time))
            res.data.data[item].userimg = durl + "/static/image/user/" + res.data.data[item].userimg + ".jpg";
          }
          console.log(res.data.data);
          pageobject.setData({
            comments: res.data.data
          })
        }
      },
    })
  },
  onback:function(){
    wx.navigateBack();
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