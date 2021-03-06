// pages/store/commodity.js
const app = getApp();
var durl = app.globalData.dynamicrequest;
var store_info;
var pageobject;
var foodtypeindex = 0;
var food_list;
var is_showorder = false;
var totalnum = 0;
var totalamount = 0;
var refresh = false;
var userloginJs = require('../../userlogin.js');
 /**
   * 记录所有商店点购的食物
   */
var store_food_map = app.globalData.store_food_map;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标
      title: '', //导航栏 中间的标题
      navbackground: "#f9d423"
    },
    starssrc:"/pages/static/img/indexpage/stars.png",
    typeindex: foodtypeindex,
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 3,
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
    storeinfo.image = durl + "/static/image/" + storeinfo.id + "image.jpg"
    store_info = storeinfo;
    this.setData({
      store: storeinfo,
      nvabarData: {
        showCapsule: 1, //是否显示左上角图标
        title: storeinfo.name, //导航栏 中间的标题
        navbackground: "#f9d423"
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.getSystemInfo({
      success: (res) => {
        var showwidth = res.windowWidth / 2;
        var showheight = showwidth * 0.6;
        app.globalData.windowHeight = res.windowHeight;
        console.log("conmmodity windowheight", res.windowHeight)
        pageobject.setData({
          showheight: showheight,
          screenHeight: app.globalData.windowHeight - 100 - (app.globalData.height * 3)
        })
      }
    });
    console.log(totalnum + " totalnum0")
    console.log("用户JSESSIONID： " + app.globalData.session);
    wx.request({
      url: durl + "/store/getstorefoods?storeid=" + store_info.id,
      header: { Cookie: "JSESSIONID=" + app.globalData.session },
      success: function success(res) {
        if ('Set-Cookie' in res.header) {
          console.log("用户JSESSIONID：", res.header["Set-Cookie"].split(";")[0].split("=")[1]);
          app.globalData.session = res.header["Set-Cookie"].split(";")[0].split("=")[1];
        }
        var foodlist = res.data.data;
        console.log("foodlist:", foodlist);
        //遍历商店的所有商品,与store_food_map中的商品对比,已查看商店内已经加入购物车的商品
        for (var i = 0; i < foodlist.length; i++) {

          if (foodlist[i].material != null)
            foodlist[i].material = foodlist[i].material.split(",");
          if (store_food_map.has(store_info.id) && store_food_map.get(store_info.id).has(foodlist[i].id)) {
            foodlist[i].num = store_food_map.get(store_info.id).get(foodlist[i].id).num;
            totalnum += foodlist[i].num;
            console.log("totalnum1:" + totalnum)
          }
          foodlist[i].imgsrc = durl + "/static/image/food/food" + foodlist[i].id + ".jpg";

          if (foodlist[i].moreimg != null) {
            foodlist[i].moreimg = foodlist[i].moreimg.split(",");
            for (var z = 0; z < foodlist[i].moreimg.length; z++)
              foodlist[i].moreimg[z] = durl + "/static/image/food/moreimg/" + foodlist[i].moreimg[z] + ".jpg";
            var length = foodlist[i].moreimg.length;
            foodlist[i].moreimg.unshift(foodlist[i].imgsrc);
          } else {
            foodlist[i].moreimg = [foodlist[i].imgsrc];
          }
        }
        food_list = foodlist;
        console.log("refresh")
        //refresh为true 则onShow时需要刷新
        refresh = true;
        console.log("totalnum2: " + totalnum)
        pageobject.setData({
          foodlist: foodlist,
          totalnum: totalnum
        })
      },
      dataType: "json"
    })
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

  //图片加载失败
  foodimgloadfail: function (event) {
    console.log("使用默认图片替换", event);
    var foodindex = event.currentTarget.dataset.indexid;
    food_list[foodindex].imgsrc = "/pages/static/img/indexpage/default.jpg";
    pageobject.setData({
      foodlist: food_list
    })
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

    // 用户触发了下拉刷新操作

    // 拉取新数据重新渲染界面

    // wx.stopPullDownRefresh() // 可以停止当前页面的下拉刷新。
    console.log("下拉刷新")

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
      scrollTop: 0,
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
        if (food_list[i].num == 0){
          store_food_map.get(store_info.id).delete(foodid); 
        }
        else{
          (store_food_map.get(store_info.id).get(foodid).num)--;
        }
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
   * 点击商品查看详情
   */
  fooddetail: function (even){
    app.globalData.food_list = food_list;
    app.globalData.totalnum = totalnum;
    console.log("商品索引:",even.currentTarget.dataset.indexid)
    let str = JSON.stringify(food_list[even.currentTarget.dataset.indexid]);
    wx.navigateTo({
      url: 'fooddetail/fooddetail?food=' + str
    })
  },
  /**
   * 什么也不做
   */
  donothing: function(){

  },
  /**
   * 用户账单生成
   */
  pay: function(){

    wx.showModal({

      title: '确认订单',

      content: '请核对订单，确认后进入付款界面',

      confirmText: '确认',

      cancelText: '取消',

      success: function (res) {

        if (res.confirm) {

          console.log('支付订单')
          //等待加载界面
          wx.showLoading({
            title: '正在支付',
            mask:true
          })
          userloginJs.userloginprocess().then(function () {
            //支付订单
            let foodmap = store_food_map.get(store_info.id);
            let foodarraylist = new Array();
            foodmap.forEach(function (value, key, map) {
              foodarraylist.push({ id: key, price: value.price, num: value.num, name: value.name });
            });
            let foodarrayliststr = JSON.stringify(foodarraylist);
            console.log("点餐内容" + foodarrayliststr);
            var payorder = new Promise(function (resolve, reject) {
              wx.request({
                url: durl + "/order/createorder",
                data: { content: foodarrayliststr, money: totalamount, 'store.id': store_info.id, 'store.name': store_info.name },
                header: { Cookie: "JSESSIONID=" + app.globalData.session },
                success: function (res) {
                  console.log(res)
                  if (res.data.status == 200)
                    resolve(res);
                  else{
                    if (res.data.reason == 'store closed')
                      reject(new Error("商店已经打烊了"));
                  }
                },
                fail: function () {
                  reject(new Error("支付失败"));
                }
              });
            });
            return payorder;
          }).then(function (res) {
            console.log("生成订单：", res);
            var payinfo = {};
            payinfo.money = res.data.data.money;
            payinfo.store = {};
            payinfo.store.name = res.data.data.store.name;
            payinfo.store.id = res.data.data.store.id;
            payinfo.id = res.data.data.orderid;
            payinfo.type = res.data.data.type;
            payinfo.state = res.data.data.state;
            //payinfo.content = 
            var d = new Date(res.data.data.transactiondate);
            var date = (d.getFullYear()) + "-" +
              (d.getMonth() + 1) + "-" +
              (d.getDate()) + " " +
              (d.getHours()) + ":" +
              (d.getMinutes()) + ":" +
              (d.getSeconds());
            payinfo.transdate = date;
            let str = JSON.stringify(payinfo);
            console.log(str)
            pageobject.setData({
              isshoworder: false
            });
            wx.hideLoading()
            wx.navigateTo({
              url: '../pay/pay?payinfo=' + str
            })
          }).catch(function (error) {
            wx.hideLoading()
            wx.showToast({ 
              image:'../static/img/indexpage/loginfail.png',
              title: error.message
               })
            console.log("error:" + error.message);
          })



        } else if (res.cancel) {

          console.log('取消')

        }

      }

    })

    
  }
})