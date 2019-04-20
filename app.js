//app.js
App({
  onLaunch: function (options) {
    if (options.scene == 1007 || options.scene == 1008) {
      this.globalData.share = true
    } else {
      this.globalData.share = false
    };
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.height = res.statusBarHeight;
        console.log("状态栏高度：",res.statusBarHeight)
        console.log("导航栏高度",res.statusBarHeight * 3)
        console.log("屏幕高度",res.screenHeight);
        console.log("可用高度",res.windowHeight);
      }
    });
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {//120.79.16.31 localhost hzhb2c.xin
    userInfo: {},
    requestdomainname:"http://120.79.16.31:8080",
    dynamicrequest:"https://localhost:8443/IntelligentMenus",
    share: false,  // 分享默认为false
    height: 0,
    store_food_map : new Map(),
    windowHeight:0,
    windowHeightminusttabbar:0,
    session:null,
  }
})

