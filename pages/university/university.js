// pages/university/university/result.js
var requestUtil = require('../../utils/requestUtil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    universities: [],
    firstView: true,
    nameBase: true,
    blankVal: "高校",
    inputVal: "",
    professor: "Dietrich Burbulla\n",
    school: "University of Toronto",
    college: "Department of mathematics",
    schoolData: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setScrollHeight();
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
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  createNew: function () {
    wx.navigateTo({
      url: 'newUniversity/newUniversity'
    })
  },
  nameBase: function () {
    this.setData({
      blankVal: "请输入学校名称",
      nameBase: true
    });
  },
  areaBase: function () {
    this.setData({
      blankVal: "所在省份/state",
      nameBase: false
    });
  },
  toResult: function () {
    var that = this;
    this.setData({
      firstView: false
    });
    requestUtil.getSchoolByCondition(that.data.inputVal, function(result) {
      //console.log(result);
      that.setData({
        universities: result
      })
    });
  },

  toUniversity: function(e) {
    var that = this;
    var index = parseInt(e.currentTarget.dataset.index);
    var pushTmpUniv = {
      school_name: that.data.universities[index].school_name,
      school_nickname: that.data.universities[index].school_nick_name,
      school_id: that.data.universities[index].school_id
    }
    wx.setStorage({
      key: 'pushTmpUniv',
      data: pushTmpUniv,
    });
    requestUtil.getSchoolDetail(that.data.universities[index].school_id,
    function (result) {
      console.log(result);
      var tempSchoolData = {
        schoolName: result.schoolInfo.school_name,
        city: result.schoolInfo.city,
        province: result.schoolInfo.province,
        country: result.schoolInfo.country,
        rcmdProfessor: result.randomProfessor,
        overallScore: result.schoolInfo.school_score,
        likesNum: result.schoolInfo.thumbs_up_num,
        schoolDistrictInfo: result.schoolDistrictInfo,
        ratesInfo: result.ratesInfo
      };
      wx.setStorage({
        key: 'tempSchoolData',
        data: tempSchoolData,
        success: function() {
          wx.navigateTo({
            url: 'specificUni/specificUni'
          });
        }
      })
    });
    
  },

  setScrollHeight: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.info(res.windowHeight);
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
  },
})