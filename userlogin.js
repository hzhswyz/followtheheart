const app = getApp();
var rurl = app.globalData.requestdomainname;
function userloginprocess () {
  var userisloginresolve;
  var userisloginreject;
  var flag = new Promise(function (resolve, reject) {
    userisloginresolve = resolve;
    userisloginreject = reject;
  });
  var userislogin = new Promise(function (resolve, reject) {
    wx.checkSession({
      success() {
        //session_key 未过期，并且在本生命周期一直有效
        if (app.globalData.session != null) {
          console.log("用户已经登录");
          resolve();
        }
        else{
          console.log("sessionid 为null，需要重新执行登录流程");
          reject(new Error("sessionid 为null，需要重新执行登录流程"))
        }
      },
      fail() {
        console.log("session_key 已经失效，需要重新执行登录流程");
        reject(new Error("session_key 已经失效，需要重新执行登录流程"));
      }
    })
  });
  userislogin.catch(function () {
    //通过userlogin获取usercode进行登录
    var getusercodeAndlogin = new Promise(function (resolve, reject) {
      wx.login({
        timeout: 3000,
        success: function (res) {
          console.log("成功获取usercode:")
          wx.request({
            url: rurl + '/wxuserlogin',
            data: { usercode: res.code, format: "json" },
            success: function (res) {
              if (res.data.pageList) {
                console.log("用户登录成功，JSESSIONID：", res.header["Set-Cookie"].split(";")[0].split("=")[1]);
                app.globalData.session = res.header["Set-Cookie"].split(";")[0].split("=")[1];
                resolve();
              }
            },
            fail: function () {
              console.log("用户登录失败");
            }
          })
        },
        fail: function () {
          reject(new Error("获取usercode失败"));
        }
      });
    });
    return getusercodeAndlogin;
  }).then(function () {
    console.log("用户登录流程完成");
    userisloginresolve();
  }).catch(function (error) {
    console.log(error);
    userisloginreject();
  })
  return flag;
}

module.exports = {
  userloginprocess: userloginprocess
}