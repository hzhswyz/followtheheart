const app = getApp();
var durl = app.globalData.dynamicrequest;

function userloginprocess () {
  
  //判断是否已经登陆
  function userislogin(){

    var islogin = new Promise(function (resolve, reject) {
      console.log("判断是否已经登陆 向服务器发送JSESSIONID： " + app.globalData.session);
      wx.request({
        url: durl + '/wxuser/islogin',
        header: { Cookie: "JSESSIONID=" + app.globalData.session },
        success: function (res) {
          var resp = res.data;
          if (resp.status == 200) {
            console.log("用户已经登录")
            reject(new Error("logined"));
          }
          else {
            console.log("用户未登录，重新登录")
            resolve();
          }
        },
        fail: function () {
          resolve();
        }
      })
    });
    return islogin;
  }


  //访问/login页面获取csrf
  function getcsrf(){

    var getlogincsrf = new Promise(function (resolve, reject) {
      console.log("向服务器发送JSESSIONID： " + app.globalData.session);
      wx.request({
        url: durl + '/login',
        header: { Cookie: "JSESSIONID=" + app.globalData.session },
        success: function (res) {
          //此session必须记录，因为服务段开启了csrf
          if ('Set-Cookie' in res.header) {
            console.log("服务器返回的JSESSIONID：", res.header["Set-Cookie"].split(";")[0].split("=")[1]);
            app.globalData.session = res.header["Set-Cookie"].split(";")[0].split("=")[1];
          }
          var str = res.data;
          var csrfstr = "";
          //<input type="hidden" name="_csrf" value="c7e5103d-0ffb-4975-bd1e-dc2d06c7db3c">
          try{
            csrfstr = str.match(/<input type="hidden" name="_csrf" value="(\S*)"/)[1];
          }catch(e){
          }
          if (csrfstr.length > 30) {
            console.log("成功获取_csrf: " + csrfstr)
            resolve(csrfstr);
          }
          else {
            reject(new Error("获取_csrf失败"));
          }
        }
      })
    });
    return getlogincsrf;
  }

  //获取usercode
  function getusercode(){

    var getusercode = new Promise(function (resolve, reject) {
      wx.login({
        timeout: 3000,
        success: function (res) {
          console.log("成功获取usercode: " + res.code)
          resolve(res.code)
        },
        fail: function () {
          reject(new Error("获取usercode失败"));
        }
      });
    })
    return getusercode;
  }

  function getusercodeandcsrf(){
    return Promise.all([getcsrf(),getusercode()])
  }

  //通过usercode与csrf进行登录
  function loginbyusercode(codeAndcsrf){

    var loginbycode = new Promise(function (resolve, reject) {
      wx.request({
        url: durl + '/login?logindevice=wx',
        method: 'POST',
        data: { username: codeAndcsrf[1], password: "wx", _csrf: codeAndcsrf[0] },
        header: { Cookie: "JSESSIONID=" + app.globalData.session, 'content-type': "application/x-www-form-urlencoded" },
        success: function (res) {
          console.log("登陆信息",res.data)
          var responsedata = res.data;
          if ("loginCode" in responsedata && responsedata.loginCode == 1) {
            app.globalData.userInfo = responsedata;
            console.log("登陆成功，服务器返回的JSESSIONID：" + responsedata.sessionId)
            app.globalData.session = responsedata.sessionId
            resolve();
          }
          else {
            reject(new Error("用户登录失败"));
          }
        },
        fail: function () {
          reject(new Error("用户登录失败"));
          console.log("用户登录失败");
        }
      })
    })
    return loginbycode;
  }

  
  var userisloginresolve;
  var userisloginreject;

  var flag = new Promise(function (resolve, reject) {
    userisloginresolve = resolve;
    userisloginreject = reject;
  });

  //判断用户是否已经登陆
  userislogin()
  //获取usercode与csrf
  .then(getusercodeandcsrf)
  //使用usercode与csrf进行认证
  .then(function (codeAndcsrf){
    return loginbyusercode(codeAndcsrf);
  })
  .then(function () {
    console.log("用户确认登录流程完成！");
    userisloginresolve();
  }).catch(function (error) {
    if (error.message == "logined")
        userisloginresolve();
    else{
      console.log(error);
      userisloginreject(error);
    }
  })

  return flag;
}

module.exports = {
  userloginprocess: userloginprocess
}