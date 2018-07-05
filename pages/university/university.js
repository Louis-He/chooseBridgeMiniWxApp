// pages/university/university/result.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    university: "Emory University",
    state: "Atlanta, Georgia",
    uiuc: "University of Illinois at Urbana-Champaign",
    uiucState: "Urbana, Iliinois",
    country: "美国",
    firstView: true,
    nameBase: true,
    blankVal: "高校",
    inputVal: "",
    professor: "Dietrich Burbulla\n",
    school: "University of Toronto",
    college: "Department of mathematics"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
      url: '../../comment/comment.wxml'
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
  toUniversity: function () {
    this.setData({
      firstView: false
    });
  }
})