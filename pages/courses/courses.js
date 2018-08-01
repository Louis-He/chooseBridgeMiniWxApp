// pages/courses/courses/result.js
var requestUtil = require('../../utils/requestUtil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    firstView: true,
    inputShowed: false,
    inputVal: "",
    professor: "Federico Mandelman",
    school: "Emory University",
    college: "Emory College of Arts and Science",
    blankUni: "学校",
    blankPro: "教授",
    inputVal: "",
    professors: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setScrollHeight();
    var that = this;
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
  toResult: function () {
    var that = this;
    this.setData({
      firstView: false
    });
    requestUtil.getProfessorByCondition(that.data.inputVal, function (result) {
      console.log(result);
      that.setData({
        professors: result
      })
    });
  },
  toProfessor: function() {
    wx.navigateTo({
      url: 'specificPro/specificPro',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
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
      url: 'newPro/newPro'
    })
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