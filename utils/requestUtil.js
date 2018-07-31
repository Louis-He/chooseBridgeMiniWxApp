var utilMd5 = require('util.js'); 

// 以下为用户信息请求函数
/**
 *  得到用户UnionID
 *  传入数据：firstRequestedData， tmpUserInfo
 *  函数类型：回掉函数
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
 * 传入数据：unionId
 * 函数类型：回掉函数
 * 用法：requestUtil.getChooseBridgeUserInfo(unionId, function(res){
              })
 */
function getChooseBridgeUserInfo(unionID, _callback){
  var that = this;
  var explicitData = {"union_id": unionID};
  
  var requestData = {"union_id": unionID, "sign": that.getSign(explicitData)}
  //console.log(requetData);
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
 * 传入数据：userid
 * 函数类型：回掉函数
 * 用法：getViewmycoursesUserInfo(userid, function(res){
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
 * 传入用户entities->id，返回用户viewmycourses中的Token
 * 传入数据：userid
 * 函数类型：回掉函数
 * 用法：getViewmycoursesToken(userid, function(res){
              })
 */
function getViewmycoursesToken(userid, _callback) {
  var that = this;
  var explicitData = { "ucenter_id": userid };
  var requestData = { "ucenter_id": userid, "sign": that.getSign(explicitData) };

  wx.request({
    url: 'https://api.viewmycourses.com/api/wechat/login',
    method: 'POST',
    data: requestData,
    success: function (res) {
      _callback(res.data.token);
    }
  })
}

// 以下为非用户信息请求很熟
/**
 * 得到支持的所有国家地区列表
 * 传入数据：无需
 * 函数类型：回掉函数
 */
function getCountries(_callback){
  wx.request({
    url: 'https://api.viewmycourses.com//open-api/geo/get-all-countrys',
    method: 'GET',
    success: function(res){
      console.log(res);
      var arrayLength = res.data.data.length;
      var countryList = new Array()
      var i = 0;
      for (i = 0; i < arrayLength; i++) {
        countryList[i] = res.data.data[i].country_name
      }
      // console.log(countryList)
      
      _callback(countryList)
    }
  })
}

/**
 * 得到特定国家支持的所有省份或联邦州列表
 * 传入数据：countryID
 * 函数类型：回掉函数
 * 注意：countryID为在getCountries()函数中获取的countryID
 */
function getProvinceByCountry(countryID, _callback) {
  // console.log(countryID)
  wx.request({
    url: 'https://api.viewmycourses.com//open-api/geo/get-province-by-country',
    method: 'POST',
    data: {"country_id": countryID},
    success: function (res) {
      // console.log(res)
      var arrayLength = res.data.data.length;
      var provinceList = new Array();
      var provinceIndicesList = new Array();
      var i = 0;
      for (i = 0; i < arrayLength; i++) {
        provinceList[i] = res.data.data[i].province_name;
        provinceIndicesList[i] = res.data.data[i].province_id;
      }
      // console.log(provinceList)
      _callback([provinceIndicesList, provinceList])
    }
  })
}

/**
 * 得到特定地区支持的所有城市列表
 * 传入数据：provinceID
 * 函数类型：回掉函数
 * 注意：provinceID为在getProvinceByCountry()函数中获取的provinceID
 */
function getCityByProvince(provinceID, _callback) {
  // console.log(provinceID)
  wx.request({
    url: 'https://api.viewmycourses.com//open-api/geo/get-city-by-province',
    method: 'POST',
    data: { "province_id": provinceID },
    success: function (res) {
      // console.log(res)
      var arrayLength = res.data.data.length;
      var cityList = new Array();
      var cityIndicesList = new Array();
      var i = 0;
      for (i = 0; i < arrayLength; i++) {
        cityList[i] = res.data.data[i].city_name;
        cityIndicesList[i] = res.data.data[i].city_id;
      }
      // console.log(provinceList)
      _callback([cityIndicesList,cityList])
    }
  })
}

/**
 * 数据库中搜索用户输入的大学名称
 * 返回相对应的大学数据
 */
function getSchoolByCondition(schoolName, _callback) {
  var that = this;
  wx.getStorage({
    key: 'user_id',
    success: function(res) {
      that.getViewmycoursesToken(res.data, function(result) {
        var explicitData = { "token": result };
        var getSign = that.getSign(explicitData)

        var requestedData = {
          token: result,
          sign: getSign
        }
        wx.request({
          url: 'https://api.viewmycourses.com//api/get-school-by-condition',
          data: { "school_name": schoolName },
          header: requestedData,
          method: 'GET',
          success: function (res) {
            //console.log(res);
            var arrayLength = res.data.data.schools.length;
            var schoolList = new Array ();
            for (var i = 0; i < arrayLength; i++) {
              schoolList[i] = res.data.data.schools[i];
            }
            _callback(schoolList);
          }
        })
      })
    },
  })
}

/**
 * 
 * 
 */
function getProfessorByCondition(professorName, _callback) {
  var that = this;
  wx.getStorage({
    key: 'user_id',
    success: function (res) {
      that.getViewmycoursesToken(res.data, function (result) {
        var explicitData = { "token": result };
        var getSign = that.getSign(explicitData)

        var requestedData = {
          token: result,
          sign: getSign
        }
        wx.request({
          url: 'https://api.viewmycourses.com//api/get-professor-by-condition',
          data: { "professor_name": professorName },
          header: requestedData,
          method: 'GET',
          success: function (res) {
            console.log(res);
            var arrayLength = res.data.data.professors.length;
            var professorList = new Array();
            for (var i = 0; i < arrayLength; i++) {
              professorList[i] = res.data.data.professors[i];
            }
            _callback(professorList);
          }
        })
      })
    },
  })
}

// 以下为辅助函数
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
  getViewmycoursesToken: getViewmycoursesToken,
  getCountries: getCountries,
  getProvinceByCountry: getProvinceByCountry,
  getCityByProvince: getCityByProvince,
  getSign: getSign,
  getSchoolByCondition: getSchoolByCondition,
  getProfessorByCondition: getProfessorByCondition
}

