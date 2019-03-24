const app = getApp();
var durl = app.globalData.dynamicrequest;

function userloginprocess () {
  var userisloginresolve;
  var userisloginreject;
  var flag = new Promise(function (resolve, reject) {
    userisloginresolve = resolve;
    userisloginreject = reject;
  });

  var islogin = new Promise(function (resolve, reject) {
    console.log("用户JSESSIONID： " + app.globalData.session);
    wx.request({
      url: durl + '/wxuser/islogin',
      header: { Cookie: "JSESSIONID=" + app.globalData.session },
      success: function (res) {
        var resp = res.data;
        if (resp.status == 200 ){
          console.log("用户已经登录")
          reject(new Error("logined"));
        }
        else{
          console.log("用户未登录，重新登录")
          resolve();
        }
      },
      fail:function(){
        resolve();
      }
    })
  });

  var csrfstr = "";
  islogin.then(function () {
    var getlogincsrf = new Promise(function (resolve, reject) {
      console.log("用户JSESSIONID： " + app.globalData.session);
      wx.request({
        url: durl + '/login',
        header: { Cookie: "JSESSIONID=" + app.globalData.session },
        success: function (res) {
          console.log("res:")
          console.log(res)
          if ('Set-Cookie' in res.header) {
            console.log("用户JSESSIONID：", res.header["Set-Cookie"].split(";")[0].split("=")[1]);
            app.globalData.session = res.header["Set-Cookie"].split(";")[0].split("=")[1];
          }
          var str = res.data;
          //<input type="hidden" name="_csrf" value="c7e5103d-0ffb-4975-bd1e-dc2d06c7db3c">
          csrfstr = str.match(/<input type="hidden" name="_csrf" value="(\S*)"/)[1];
          if (str.length > 30) {
            console.log("获取_csrf:" + csrfstr)
            resolve();
          }
          else {
            reject(new Error("获取_csrf失败"));
          }
        }
      })
    });
    return getlogincsrf;
  }).then(function () {
    //通过userlogin获取usercode进行登录
    var getusercodeAndlogin = new Promise(function (resolve, reject) {
      wx.login({
        timeout: 3000,
        success: function (res) {
          console.log("成功获取usercode:" + res.code)
          //console.log("_csrf:" + csrfstr)
          console.log("用户JSESSIONID： " + app.globalData.session);
          wx.request({
            url: durl + '/login?logindevice=wx',
            method: 'POST',
            data: { username: res.code, password: "wx", _csrf:csrfstr },
            header: {Cookie: "JSESSIONID=" + app.globalData.session, 'content-type': "application/x-www-form-urlencoded" },
            success: function (res) {
              console.log(res.data)
              var responsedata = res.data;
              if ("loginCode" in responsedata && responsedata.loginCode == 1) {
                console.log("登陆成功:")
                app.globalData.session = responsedata.sessionId
                resolve();
              }
              else{
                reject(new Error("用户登录失败"));
              }
            },
            fail: function () {
              reject(new Error("用户登录失败"));
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
    
    if (error.message == "logined")
        userisloginresolve();
    else{
      console.log(error);
      userisloginreject();
    }
  
  })
  return flag;
}

module.exports = {
  userloginprocess: userloginprocess
}