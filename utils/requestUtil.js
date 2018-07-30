var utilMd5 = require('util.js'); 

/**
 *  得到用户UnionID
 *  注意： 传入firstRequestedData和tmpUserInfo
 */
function getUserUnionID(firstRequestedData, tmpUserInfo, _callback) {
  var that = this
  var session_key = {}
  wx.request({
    url: 'https://i.choosebridge.com/api/wechat/openid',
    method: 'POST',
    data: firstRequestedData,
    success: function (res) {
      //console.log(res)
      session_key = res.data.data.session_key

      // 在此处返回敏感数据
      // res.encryptedData
      var explicitData = { session_key: session_key, encrypted_data: tmpUserInfo.encryptedData, iv: tmpUserInfo.iv };
      //console.log(explicitData)
      var getSign = that.getSign(explicitData)

      var requestedData = {
        session_key: session_key,
        encrypted_data: tmpUserInfo.encryptedData,
        iv: tmpUserInfo.iv,
        sign: getSign
      }

      wx.request({
        url: 'https://i.choosebridge.com/api/wechat/decrypt',
        method: 'POST',
        data: requestedData,
        success: function (res) {
          // 'unionId': res.userInfo.nickName
          var result = res;
          _callback(result);
        }
      })
      // 'username': res.userInfo.nickName
    }
  })
}

/**
 * 得到用户在ChooseBridge服务器上的个人信息
 * 用法：
 * requestUtil.getChooseBridgeUserInfo(unionId, function(res){
              })
 */
function getChooseBridgeUserInfo(unionID, _callback){
  var that = this;
  var explicitData = {"union_id": unionID};
  
  var requestData = {"union_id": unionID, "sign": that.getSign(explicitData)}
  //console.log(requetsData);
  wx.request({
    url: 'https://i.choosebridge.com/api/wechat/login',
    method: 'POST',
    data: requestData,
    success: function (res){
      //console.log(res)
      _callback(res);
    }
  })
}

/**
 * 传入用户entities->id，返回用户viewmycourses中的个人信息
 * 用法：
 * getViewmycoursesUserInfo(userid, function(res){
              })
 */
function getViewmycoursesUserInfo(userid, _callback){
  var that = this;
  var explicitData = { "ucenter_id": userid };
  var requestData = { "ucenter_id": userid, "sign": that.getSign(explicitData) };

  wx.request({
    url: 'https://api.viewmycourses.com/api/wechat/login',
    method: 'POST',
    data: requestData,
    success: function(res){
      var header = { "token": res.data.token };
      wx.request({
        url: 'https://api.viewmycourses.com/api/get-student',
        method: 'GET',
        header: header,
        success: function (res) {
          _callback(res);
        }
      })
    }
  })
}

/**
 * 加密工具函数
 * 对于inputData进行md5加密
 */
function getSign(inputData) {
  var enc = "";
  for (var k in inputData) {
    enc += k + ":" + inputData[k] + ";";
  }
  enc += "ch00sebr1dge";
  return utilMd5.hexMD5(enc);
}

module.exports = {
  getChooseBridgeUserInfo: getChooseBridgeUserInfo,
  getUserUnionID: getUserUnionID,
  getViewmycoursesUserInfo: getViewmycoursesUserInfo,
  getSign: getSign
}

