// pages/manage/modifycommodity/modifycommodity.js
var foodtypeindex = 0;
const app = getApp();
var durl = app.globalData.dynamicrequest;
var store_info;
var pageobject;
var food_list;
var userloginJs = require('../../../userlogin.js');
//是否显示修改窗口
var isshoweditfood = false;
//是否显示修改商店公告的窗口
var isshoweditnotic = false;
//编辑的商品对象
var editfood;
//要上传的图片链接
var tempimgsrc = null;
//商品在food_list中的索引
var foodindex;
var isaddfood = false;
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
    height: app.globalData.height * 3,
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
        pageobject.setData({
          showheight: showheight,
          screenHeight: app.globalData.windowHeight - 100 - (app.globalData.height * 3)
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
    //请求店内商品列表
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
          foodlist: food_list
        })
      }
    })

  },

  /**
   * 用户点击菜品分类
   */
  changefoodtype: function (event) {
    foodtypeindex = event.target.dataset.index;
    this.setData({
      scrollTop: 0,
      typeindex: foodtypeindex
    })
  },

  //删除商品
  deletefood:function(event){
    console.log("删除商品ID：",event.currentTarget.dataset.indexid)
    var index = event.currentTarget.dataset.indexid;
    var deletefood = food_list[index];

    wx.showModal({
      content: "确定删除吗？此操作不可撤销！",
      title: deletefood.name,
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          userloginJs.userloginprocess().then(function () {
            wx.request({
              url: durl + "/rest/food/deletefood",
              data: { foodid: deletefood.id},
              method: 'POST',
              header: { Cookie: "JSESSIONID=" + app.globalData.session, 'content-type': "application/x-www-form-urlencoded"},
              success: function (res) {
                console.log("success",res.data)
                if (res.data.status == 200) {
                  food_list.splice(index,1);
                  pageobject.setData({
                    foodlist: food_list
                  })
                  wx.showToast({
                    title: "删除成功!"
                  })
                }else{
                  wx.showToast({
                    icon: "none",
                    title: res.data.reason
                  })
                }
              },
              fail: function(res){
                console.log("fail",res.data)
                wx.showToast({
                  icon: "none",
                  title: res.data.reason
                })
              }
            })
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      },
      fail(res) {
        console.log('用户点击取消')
      }
    })
    
  },

  //图片加载失败
  foodimgloadfail:function(event){
    console.log("使用默认图片替换",event);
    var foodindex = event.currentTarget.dataset.indexid;
    food_list[foodindex].imgsrc = "/pages/static/img/indexpage/default.jpg";
    pageobject.setData({
      foodlist: food_list
    })
  },

  //添加商品
  addfood:function(){
    //tempimgsrc = ["/pages/static/img/indexpage/default.jpg"];
    editfood = {};
    editfood.issale = 1;
    editfood.type = 0;
    editfood.imgsrc = "../../static/img/indexpage/default.jpg";
    foodindex = food_list.length;
    isaddfood = true;
    pageobject.setData({
      editfood: editfood,
      isshoweditfood: true
    })
  },

  //编辑商品
  editfood: function (event) {
    isaddfood = false;
    foodindex = event.currentTarget.dataset.indexid;
    editfood = food_list[foodindex];
    tempimgsrc = null;
    console.log("商品ID", editfood.id)
    pageobject.setData({
      isshoweditfood: true,
      editfood: editfood
    })
  },

  //关闭编辑界面
  isshowout:function(){
    editfood = null;
    pageobject.setData({
      isshoweditfood: false
    })
  },

  //展示编辑店铺公告窗口
  isshownoticout: function(){
    isshoweditnotic = !isshoweditnotic;
    pageobject.setData({
      isshoweditnotic: isshoweditnotic
    })
  },
  
  //提交店铺公告form
  noticeformsubmit:function(event){
    console.log("修改公告为：", event.detail.value.notice);
    var notice = event.detail.value.notice;
    wx.showLoading({
      title: '正在修改',
    })
    userloginJs.userloginprocess()
      .then(function(){
        wx.request({
          url: durl + "/rest/store/editnotic",
          data: {
            notice: notice,
            id: store_info.id
          },
          method: 'POST',
          header: { Cookie: "JSESSIONID=" + app.globalData.session, 'content-type': "application/x-www-form-urlencoded" },
          success: function (res) {
            console.log("success", res.data);
            if (res.data.status == 200) {
              store_info.notice = notice;
              pageobject.setData({
                store: store_info
              })
              wx.showToast({
                title: '修改完成',
              })
            }
            else {
              wx.showToast({
                title: '修改失败',
              })
            }
          },
          fail(res) {
            console.log("fail(res)", res.data);
            wx.showToast({
              title: '修改失败',
            })
          },
          complete(){
            pageobject.isshownoticout();
          }
        });
      })
  },

  //用于阻止事件冒泡
  donothing:function(){

  },

  //picke是否销售
  issalepickerbindchange: function (event){
    editfood.issale = parseInt(event.detail.value);
    pageobject.setData({
      editfood: editfood
    })
  },

 //picke更改商品类型
  typepickerbindchange: function (event){
    editfood.type = parseInt(event.detail.value);
    pageobject.setData({
      editfood: editfood
    })
  },


  
  //选择商品照片
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
            editfood.imgsrc = tempimgsrc;
            pageobject.setData({
              editfood: editfood
            });
            resolve();
          },
          fail: function () {
            reject(new Error("选取照片错误"));
          }
        });
      })
      return getimg;
    }

    getcameraauth()
    .then(getimg)
    .catch(function(error){
      console.log(error.message);
    })

  },

  //提交表单
  formsubmit:function(event){
    console.log("修改商品为：",event.detail.value);

    var targeturl ;
    if (!isaddfood){
      targeturl = durl + "/rest/food/editnameandprice";
    }
    else{
      targeturl = durl + "/rest/food/addfood"
    }

    function sendfoodinfo(){
      var foodinfo = new Promise(function (resolve, reject) {
        wx.request({
          url: targeturl,
          data: { 
            id: event.detail.value.id,
            name: event.detail.value.name,
            price: event.detail.value.price,
            issale: event.detail.value.issale,
            material: event.detail.value.material,
            type: event.detail.value.type,
            cost: event.detail.value.cost,
            storeid: store_info.id
           },
          method: 'POST',
          header: { Cookie: "JSESSIONID=" + app.globalData.session, 'content-type': "application/x-www-form-urlencoded" },
          success: function (res) {
            console.log("success",res.data);
            if (res.data.status == 200) {
              if (!isaddfood){
                food_list[foodindex].name = event.detail.value.name;
                food_list[foodindex].price = event.detail.value.price;
                food_list[foodindex].cost = event.detail.value.cost;
                food_list[foodindex].issale = event.detail.value.issale;
                food_list[foodindex].type = event.detail.value.type;
                food_list[foodindex].material = event.detail.value.material;
              }
              else{
                editfood.id = res.data.data;
                food_list[foodindex] = editfood;
              }
              pageobject.setData({
                isshoweditfood: false,
                foodlist: food_list
              })
              resolve();
            }
            else {
              reject(new Error("修改失败"));
            }
          },
          fail(res){
            console.log("fail(res)",res.data);
            reject(new Error("修改失败"));
          }
        })
      });
      return foodinfo;
    }

    function sendimg() {
      if (tempimgsrc != null) {
        var getimg = new Promise(function (resolve, reject) {
          wx.uploadFile({
            url: durl + "/rest/food/uploadfoodimg",
            filePath: tempimgsrc[0],
            name: 'foodimg',
            header: { Cookie: "JSESSIONID=" + app.globalData.session },
            formData: {
              foodid: editfood.id
            },
            success(res) {
              res.data = JSON.parse(res.data);
              console.log("success(res)", res.data);
              if (res.data.status == 200) {
                const data = res.data
                wx.showToast({
                  title: "修改成功"
                });
                food_list[foodindex].imgsrc = tempimgsrc;
                pageobject.setData({
                  foodlist: food_list
                })
                tempimgsrc = null;
                resolve();
              }
              else{
                reject(new Error("修改图片失败"));
              }
            },
            fail(res){
              console.log("fail(res)", res);
              reject(new Error("修改图片失败"));
            }
          })
        })
        return getimg;
      }else{
        wx.showToast({
          title: "修改成功"
        });
      }
    }

    wx.showLoading({
      title: '正在修改',
      mask: true
    })

    userloginJs.userloginprocess()
    .then(sendfoodinfo)
    .then(sendimg)
    .catch(function (res) {
      tempimgsrc = null;
      targeturl = false;
      console.log(res.message);
      wx.showToast({
        icon:"none",
        title: res.message,
      });
    });
    

  },

  formreset:function(){
    editfood = null;
    tempimgsrc = null;
  },
  

  namebar: function (event){
    console.log(event.detail.value)
    editfood.name = event.detail.value;
  },
  materialbar: function (event) {
    console.log(event.detail.value)
    editfood.material = event.detail.value;
  },
  pricebar: function (event) {
    console.log(event.detail.value)
    editfood.price = event.detail.value;
  },
  costbar: function (event) {
    console.log(event.detail.value)
    editfood.cost = event.detail.value;
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