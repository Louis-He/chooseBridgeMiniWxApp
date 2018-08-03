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
 * 获取某个学校的具体信息，主要为了获取所有校区信息
 * 传入数据：school_id
 * 返回数据：[campusIndicesList, campusList]
 * 函数类型：回掉函数
 */
function getSchoolInfo(schoolID, _callback){
  wx.request({
    url: 'https://api.viewmycourses.com//open-api/get-school-detail',
    method: 'GET',
    data: { "school_id": schoolID },
    success: function(res){
      var campusJson = res.data.data.schoolDistrictInfo;
      var arrayLength = campusJson.length;
      var campusList = new Array();
      var campusIndicesList = new Array();
      var i = 0;
      for (i = 0; i < arrayLength; i++) {
        campusList[i] = campusJson[i].school_district_name;
        campusIndicesList[i] = campusJson[i].school_district_id;
      }

      _callback([campusIndicesList, campusList])
    }
  })
}

/**
 * 数据库中搜索用户输入的大学名称
 * 返回相对应的大学数据
 * 传入数据：用户输入的schoolName
 * 函数类型：回掉函数
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
 * 数据库中搜索用户输入的教授名称
 * 返回相对应的教授数据
 * 传入数据：用户输入的教授名称
 * 函数类型：回掉函数
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

/**
 * 数据库中根据国家搜索学校组名称
 * 返回所有的国家中所有的学校
 * 传入数据：无需
 * 函数类型：回掉函数
 */
function getSchoolGroupByCountry(_callback) {
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
          url: 'https://api.viewmycourses.com//api/get-school-group-by-country',
          header: requestedData,
          method: 'GET',
          success: function (res) {
            _callback(res.data.data);
          }
        })
      })
    },
  })
}

/**
 * 数据库中根据学校获得所有部门名称
 * 返回某个学校所有的学术部门
 * 传入数据：学校ID
 * 返回数据：一个array
 * 函数类型：回掉函数
 */
function getCollegeBySchool(schoolId, _callback) {
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
          url: 'https://api.viewmycourses.com//api/get-college-by-school',
          header: requestedData,
          method: 'POST',
          data: {school_id: schoolId},
          success: function (res) {
            var departmentArray = [];
            var departmentIndices = [];
            var count =  0;

            for(count = 0; count < res.data.data.length; count++){
              departmentArray[count] = res.data.data[count].college_name;
              departmentIndices[count] = res.data.data[count].college_id;
            }

            _callback([departmentIndices, departmentArray]);
          }
        })
      })
    },
  })
}

/**
 * 数据库中根据学校ID
 * 返回所有学校相关信息
 * 传入数据： 学校ID
 * 函数类型：回掉函数
 */
function getSchoolDetail(schoolId, _callback) {
  wx.request({
    url: 'https://api.viewmycourses.com/open-api/get-school-detail',
    method: 'GET',
    data: {school_id: schoolId},
    success: function(res) {
      console.log(res);
      var schoolData = res.data.data;
      _callback(schoolData);
    }
  })
}

/**
 * 数据库中根据教授ID
 * 返回所有教授相关信息
 * 传入数据： 教授ID
 * 函数类型： 回掉函数
 */
function getProfessorDetail(professorID, _callback) {
  wx.request({
    url: 'http://api.viewmycourses.com/open-api/get-professor-detail',
    method: 'GET',
    data: {professor_id: professorID},
    success: function(res) {
      var professorData = res.data.data;
      _callback(professorData);
    }
  })
}

/**
 * 
 */
function getStudentByID(studentID, _callback) {
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
          url: 'https://api.viewmycourses.com//api/get-student-by-id',
          method: 'GET',
          header: requestedData,
          data: { student_id: studentID },
          success: function (res) {
            console.log(res);
            _callback(res.data.data);
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
  getSchoolInfo: getSchoolInfo,
  getSchoolByCondition: getSchoolByCondition,
  getProfessorByCondition: getProfessorByCondition,
  getSchoolGroupByCountry: getSchoolGroupByCountry,
  getCollegeBySchool: getCollegeBySchool,
  getSchoolDetail: getSchoolDetail,
  getProfessorDetail: getProfessorDetail,
  getStudentByID: getStudentByID,
  getSign: getSign
}

