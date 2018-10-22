// pages/store/commodity.js
const app = getApp();
var rurl = app.globalData.requestdomainname;
var store_info;
var pageobject;
var foodtypeindex = 0;
var food_list;
var is_showorder = false;
var totalnum = 0;
var totalamount = 0;
var refresh = false;
 /**
   * 记录所有商店点购的食物
   */
var store_food_map = new Map();
app.store_food_map = store_food_map;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    starssrc:"/pages/static/img/indexpage/stars.png",
    typeindex: foodtypeindex,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onlode")
    refresh = false;
    totalnum = 0;
    totalamount = 0;
    pageobject = this;
    let storeinfo = JSON.parse(options.storeinfo);
    storeinfo.image = rurl +"/static/image/" + storeinfo.id +"image.jpg"
    store_info = storeinfo;
    this.setData({
      store: storeinfo
    })
    wx.setNavigationBarTitle({
      title: storeinfo.name
    })
    console.log(totalnum + " totalnum0")
    wx.request({
      url: rurl + "/getstorefoods?format=json&storeid=" + storeinfo.id,
      success: function success(res) {
        var foodlist = res.data.pageList;
        console.log(foodlist); 
        for (var i = 0; i < foodlist.length; i++){
          if (store_food_map.has(store_info.id) && store_food_map.get(store_info.id).has(foodlist[i].id)){
          foodlist[i].num = store_food_map.get(store_info.id).get(foodlist[i].id).num;
          totalnum += foodlist[i].num;
            console.log(totalnum + "totalnum1")
          }
          foodlist[i].imgsrc = rurl +"/static/image/food/food" + foodlist[i].id + ".jpg";
        }
        food_list = foodlist;
        console.log("refresh")
        refresh = true;
        console.log(totalnum +" totalnum2")
        pageobject.setData({
          foodlist: foodlist,
          totalnum: totalnum
        })
      },
      dataType: "json"
    })
    wx.getSystemInfo({
      success: function(res) {
        pageobject.setData({
          screenHeight:res.windowHeight-105
        })
      }
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
    console.log("onshow")
    if (refresh){
    console.log("返回商店,更新点餐列表");
    totalnum = 0;
    for (var i = 0; i < food_list.length; i++) {
      food_list[i].num = 0;
      if (store_food_map.has(store_info.id) && store_food_map.get(store_info.id).has(food_list[i].id)) {
        food_list[i].num = store_food_map.get(store_info.id).get(food_list[i].id).num;
        totalnum += food_list[i].num;
      }
    }
    pageobject.setData({
      foodlist: food_list,
      totalnum: totalnum,
      foodarray:null
    })
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
  /**
   * 用户点击菜品分类
   */
  changefoodtype: function(event){
    foodtypeindex = event.target.dataset.index;
    this.setData({
      typeindex: foodtypeindex
    })
  },
/**
   * 用户添加菜品
   */
  addfood: function (event){
    var foodid = event.target.dataset.foodid;
    console.log("添加菜品ID：" +foodid)
    for(var i=0;i<food_list.length;i++){
      if (food_list[i].id==foodid){
        if ('num' in food_list[i]){
          food_list[i].num++;
        }
        else{
          food_list[i].num = 0;
          food_list[i].num++;
        }
        if (store_food_map.has(store_info.id)){
          if (store_food_map.get(store_info.id).has(foodid))
            store_food_map.get(store_info.id).get(foodid).num = food_list[i].num;
          else
            store_food_map.get(store_info.id).set(foodid, { num: food_list[i].num, price: food_list[i].price, name: food_list[i].name});
        }
        else {
          var food_map = new Map();
          food_map.set(foodid, { num: food_list[i].num, price: food_list[i].price, name: food_list[i].name});
          store_food_map.set(store_info.id, food_map);
        }
      }
    }
    totalnum++;
    pageobject.setData({
      foodlist: food_list,
      totalnum: totalnum
    })
  },
  /**
   * 用户减少菜品
   */
  reducefood: function (event){
    var foodid = event.target.dataset.foodid;
    console.log("减少菜品ID："+foodid)
    for (var i = 0; i < food_list.length; i++) {
      if (food_list[i].id == foodid) {
        food_list[i].num--;
        (store_food_map.get(store_info.id).get(foodid).num)--;
      }
    }
    totalnum--;
    pageobject.setData({
      foodlist: food_list,
      totalnum: totalnum
    })
  },
  /**
   * 显示某商店点餐列表
   */
  showorder: function (event){
    totalamount = 0;
    if (is_showorder==false){
      var foodarray = new Array();
      if (store_food_map.has(store_info.id)) {
        
        var foodmap = store_food_map.get(store_info.id);
        var i =0;
        foodmap.forEach(function (value, key, map) {
          if (value.num>0){
            foodarray[i++] = value;
            console.log(value.price + "  " + value.num + "  " + totalamount)
            totalamount += (value.price * value.num);
          }
        });
      }
      pageobject.setData({
        isshoworder: true,
        foodarray: foodarray,
        totalamount: totalamount
      });
      is_showorder = true;
    }
    else{
      pageobject.setData({
        isshoworder: false
      });
      is_showorder = false;
    }
  },
  /**
   * 用户支付账单
   */
  pay: function(){
    
    wx.login({
      timeout: 3000,
      success: function (res) {
        console.log("成功获取usercode")
        wx.request({
          url: rurl + "/getuserinfo?money="+totalamount+"&store.id="+store_info.id,
          data: { usercode: res.code, format: "json" },
          success: function (res) {
            console.log(res);
            var payinfo = {};
            payinfo.money = res.data.pageList.money;
            payinfo.store = {};
            payinfo.store.name = res.data.pageList.store.name;
            payinfo.store.id = res.data.pageList.store.id;
            payinfo.orderid = res.data.pageList.orderid;
            payinfo.type = res.data.pageList.type;
            payinfo.state = res.data.pageList.state;
            var d = new Date(res.data.pageList.transactiondate);
            var date = (d.getFullYear()) + "-" +
              (d.getMonth() + 1) + "-" +
              (d.getDate()) + " " +
              (d.getHours()) + ":" +
              (d.getMinutes()) + ":" +
              (d.getSeconds());
            payinfo.date = date;
            let str = JSON.stringify(payinfo);
            console.log(str)
            pageobject.setData({
              isshoworder: false
            });
            wx.navigateTo({
              url: '../pay/pay?payinfo=' + str
            })
          }
        })
      },
      fail: function () {
        console.log("登陆失败")
      }
    })
    
  }
})