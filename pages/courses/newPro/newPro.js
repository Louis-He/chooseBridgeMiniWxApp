// pages/courses/newPro/newPro.js
var requestUtil = require('../../../utils/requestUtil.js'); 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_modal_Hidden: true,
    is_modal_Msg: '我是一个自定义组件',
    is_modal_Title: '提示',
    allList: [],
    countries: [],
    countryIndex: 0,
    schools: [],
    schoolsShortForm: [],
    schoolIndex: 0,
    departments: [],
    departmentsShortForm: [],
    departmentIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    var that = this;
    requestUtil.getSchoolGroupByCountry(function (res) {
      that.setData({
        allList: res
      })

      var countryList = [];
      var count = 0;
      for(var sub in res){
        countryList[count] = sub;
        count ++;
      }
      that.setData({
        countries: countryList,
        countryIndex: 0,
        country: countryList[0],
      })

      var schoolRawData = res[countryList[that.data.countryIndex]];
      var schoolArray = [];
      var schoolsShortForm = [];
      var schoolIndicies = [];

      for (count = 0; count < schoolRawData.length; count++){
        schoolArray[count] = schoolRawData[count].school_name;
        schoolIndicies[count] = schoolRawData[count].school_id;
        if (schoolRawData[count].school_name.length > 25){
          schoolsShortForm[count] = schoolRawData[count].school_name.substring(0, 22) + '...'
        }else{
          schoolsShortForm[count] = schoolRawData[count].school_name
        }
      }

      console.log(schoolArray)
      console.log(schoolIndicies)

      that.setData({
        schools: schoolArray,
        schoolsShortForm: schoolsShortForm,
        schoolIndex: 0,
        schoolIndicies: schoolIndicies,
        school: schoolArray[0]
      })

      requestUtil.getCollegeBySchool(that.data.schoolIndicies[that.data.schoolIndex], function(res){
        // console.log(res)
        var departmentsShortForm = [];
        for(var i = 0; i < res[1].length; i++){
          if (res[1][i].length > 25) {
            departmentsShortForm[i] = res[1][i].substring(0, 22) + '...'
          } else {
            departmentsShortForm[i] = res[1][i]
          }
        }
        
        that.setData({
          departments: res[1],
          departmentsShortForm: departmentsShortForm,
          departmentIndices: res[0],
          departmentIndex: 0,
          department: res[1][0]
        })
      })
    })
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
  
  },

  /**
   * 确认创建按钮
   */
  confirm: function (){
    var errorMsg = "";
    var popError = false;
    if (!this.data.lastName){
      popError = true;
      if (errorMsg){
        errorMsg += ",教授姓";
      }else{
        errorMsg += "教授姓";
      }
    }
    if (!this.data.firstName) {
      popError = true;
      if (errorMsg) {
        errorMsg += ",教授名";
      } else {
        errorMsg += "教授名";
      }
    }
    if (!this.data.university) {
      popError = true;
      if (errorMsg) {
        errorMsg += ",学校";
      } else {
        errorMsg += "学校";
      }
    }
    if (!this.data.department) {
      popError = true;
      if (errorMsg) {
        errorMsg += ",学院";
      } else {
        errorMsg += "学院";
      }
    }
    
    //if (popError){
    if (false) {
      /* 填写检查不通过，要求用户重新填写 */
      errorMsg = "您有以下部分没有填写：\n" + errorMsg;
      this.setData({
        is_modal_Hidden: false,
        is_modal_Msg: errorMsg
      })
    }else{
      var tmpProInfo = {
        lastName : this.data.lastName,
        firstName : this.data.firstName,
        university : this.data.schools[this.data.schoolIndex],
        department: this.data.departments[this.data.departmentIndex],
        university_id: this.data.schoolIndicies[this.data.schoolIndex],
        department_id: this.data.departmentIndices[this.data.departmentIndex],
        homePage : this.data.homePage
      }

      console.log("填写检查通过: tmpProInfo = ")
      // console.log(tmpProInfo)
      wx.setStorage({
        key: 'tmpProInfo',
        data: tmpProInfo,
      })


      wx.redirectTo({
        url: 'confirmAdd',
      })
    }
    
  },

  /**
   * 以下六个方法为绑定文本框和变量
   */
  lastNameInput: function (e){
    this.setData({
      lastName: e.detail.value
    })
  },

  firstNameInput: function (e){
    this.setData({
      firstName: e.detail.value
    })
  },

  bindCountryChange: function (e) {
    var that = this;
    var count = 0;
    this.setData({
      country: that.data.countries[e.detail.value],
      countryIndex: parseInt(e.detail.value)
    })

    var schoolRawData = that.data.allList[that.data.countries[e.detail.value]];
    var schoolArray = [];
    var schoolsShortForm = [];
    var schoolIndicies = [];

    for (count = 0; count < schoolRawData.length; count++) {
      schoolArray[count] = schoolRawData[count].school_name;
      schoolIndicies[count] = schoolRawData[count].school_id;
      if (schoolRawData[count].school_name.length > 25) {
        schoolsShortForm[count] = schoolRawData[count].school_name.substring(0, 22) + '...'
      } else {
        schoolsShortForm[count] = schoolRawData[count].school_name
      }
    }

    console.log(schoolArray)
    console.log(schoolIndicies)

    that.setData({
      schools: schoolArray,
      schoolsShortForm: schoolsShortForm,
      schoolIndex: 0,
      schoolIndicies: schoolIndicies,
      school: schoolArray[0]
    })

    requestUtil.getCollegeBySchool(that.data.schoolIndicies[that.data.schoolIndex], function (res) {
      // console.log(res)
      var departmentsShortForm = [];
      for (var i = 0; i < res[1].length; i++) {
        if (res[1][i].length > 25) {
          departmentsShortForm[i] = res[1][i].substring(0, 22) + '...'
        } else {
          departmentsShortForm[i] = res[1][i]
        }
      }

      that.setData({
        departments: res[1],
        departmentsShortForm: departmentsShortForm,
        departmentIndices: res[0],
        departmentIndex: 0,
        department: res[1][0]
      })
    })
  },

  universityChange: function (e) {
    var that = this;
    this.setData({
      school: that.data.schools[e.detail.value],
      schoolIndex: parseInt(e.detail.value)
    })
    requestUtil.getCollegeBySchool(that.data.schoolIndicies[that.data.schoolIndex], function (res) {
      // console.log(res)
      var departmentsShortForm = [];
      for (var i = 0; i < res[1].length; i++) {
        if (res[1][i].length > 25) {
          departmentsShortForm[i] = res[1][i].substring(0, 22) + '...'
        } else {
          departmentsShortForm[i] = res[1][i]
        }
      }

      that.setData({
        departments: res[1],
        departmentsShortForm: departmentsShortForm,
        departmentIndices: res[0],
        departmentIndex: 0,
        department: res[1][0]
      })
    })
  },

  departmentChange: function (e) {
    var that = this;
    this.setData({
      department: that.data.countries[e.detail.value],
      departmentIndex: parseInt(e.detail.value)
    })
  },

  homePageInput: function (e) {
    this.setData({
      homePage: e.detail.value
    })
  }

})