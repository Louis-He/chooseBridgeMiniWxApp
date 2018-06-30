// pages/university/university.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blankVal: "请输入学校名称",
    inputVal: "",
    professor: "Dietrich Burbulla\n",
    school: "University of Toronto",
    college: "Department of mathematics"
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
      //初始化的时候渲染wxSearchdata
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
  nameBase: function () {
    this.setData({
      blankVal: "请输入学校名称"
    });
  },
  areaBase: function () {
    this.setData({
      blankVal: "请输入地区"
    });
  },
  toUniversity: function () {
    wx.navigateTo({
      url: '../university/result/result'
    });
  }
})