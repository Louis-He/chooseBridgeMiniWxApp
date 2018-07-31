// pages/comment/newComment/newUnivCom/newUnivCom.js
var requestUtil = require('../../../../utils/requestUtil.js'); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_modal_Hidden: true,
    is_modal_Msg: '我是一个自定义组件',
    is_modal_Title: '提示',
    "university": "上海脚痛大学（测试）",
    "campuses": [],
    "campusIndices": [],
    "campusIndex": 0,
    "campus": null,
    "reputation": 0,
    "academic": 0,
    "webService": 0,
    "dom": 0,
    "food": 0,
    "geo": 0,
    "activity": 0,
    "infrastructure": 0,
    "happiness": 0,
    "relationship": 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setScrollHeight();
    requestUtil.getSchoolInfo(4, function (result){
      console.log(result);
      that.setData({
        campuses: result[1],
        campusIndices: result[0],
        campus: result[1][0]
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

  bindCampusChange: function (e) {
    var that = this;
    console.log('picker country 发生选择改变，携带值为', this.data.campuses[e.detail.value]);

    this.setData({
      'campus': that.data.campuses[e.detail.value],
      'campusIndex': e.detail.value
    })
  },

  socialReputationChange: function (e) {
    this.setData({
      'reputation': e.detail.value
    })
  },

  academicLevelChange: function (e) {
    this.setData({
      'academic': e.detail.value
    })
  },

  WebServiceChange: function (e) {
    this.setData({
      'webService': e.detail.value
    })
  },

  domConditionChange: function (e) {
    this.setData({
      'dom': e.detail.value
    })
  },

  foodQualityChange: function (e) {
    this.setData({
      'food': e.detail.value
    })
  },

  geoLocationChange: function (e) {
    this.setData({
      'geo': e.detail.value
    })
  },

  activityChange: function (e) {
    this.setData({
      'activity': e.detail.value
    })
  },

  infrastructureChange: function (e) {
    this.setData({
      'infrastructure': e.detail.value
    })
  },

  happinessChange: function (e) {
    this.setData({
      'happiness': e.detail.value
    })
  },

  relationshipChange: function (e) {
    this.setData({
      'relationship': e.detail.value
    })
  },

  nextStep: function () {
    // Check the input
    /*
    if (!this.data.campus || this.data.reputation){
      console.log()
      var errorMsg = "请填写完整"

      this.setData({
        is_modal_Hidden: false,
        is_modal_Msg: errorMsg
      })
    }
    */
    
    this.setData({
      'tmpUnivComment': { "school_id": 4, "school_district_id": this.data.campusIndices[this.data.campusIndex], 'campus': this.data.campus, 'reputation': this.data.reputation, 'academic': this.data.academic, 'webService': this.data.webService, 'dom': this.data.dom, 'food': this.data.food, 'geo': this.data.geo, 'activity': this.data.activity, 'infrastructure': this.data.infrastructure, 'happiness': this.data.happiness, 'relationship': this.data.relationship, }
    })

    wx.setStorage({
      key: 'tmpUnivComment',
      data: this.data.tmpUnivComment,
    })

    wx.navigateTo({
      url: 'detailCom',
    })
  }
})