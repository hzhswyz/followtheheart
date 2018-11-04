const app = getApp();
var rurl = app.globalData.requestdomainname;
var durl = app.globalData.dynamicrequest;

function userloginprocess () {
  var userisloginresolve;
  var userisloginreject;
  var flag = new Promise(function (resolve, reject) {
    userisloginresolve = resolve;
    userisloginreject = reject;
  });
    //通过userlogin获取usercode进行登录
    var getusercodeAndlogin = new Promise(function (resolve, reject) {
      wx.login({
        timeout: 3000,
        success: function (res) {
          console.log("成功获取usercode:")
          wx.request({
            url: durl + '/MainController/wxuserlogin',
            data: { usercode: res.code, format: "json" },
            header: { Cookie: "JSESSIONID=" + app.globalData.session },
            success: function (res) {
              if (res.data.pageList) {
                if ('Set-Cookie' in res.header){
                console.log("用户登录成功，JSESSIONID：", res.header["Set-Cookie"].split(";")[0].split("=")[1]);
                app.globalData.session = res.header["Set-Cookie"].split(";")[0].split("=")[1];
                }
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
  getusercodeAndlogin.then(function () {
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