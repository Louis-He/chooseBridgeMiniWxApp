// pages/university/specificUni/specificUni.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    arrowTouched: false,
    uniName: "University of Illinois Urbana Champaign",
    location: "Urbana-Champaign, Illinois 美国",
    campusName: "Atlanta Campus",
    detailCmtLeft: [
      { category:'社会声誉: 3'},
      { category:'学术水平: 3'},
      { category:'网络服务: 3'},
      { category:'住宿条件: 3'},
      { category:'餐饮质量: 3'},
    ],
    detailCmtRight: [
      {category:'校园地理位置: 3'},
      {category:'校园课外活动: 3'},
      {category:'校园基础设施: 3'},
      {category:'生活幸福指数: 3'},
      {category:'校方与学生群体关系: 3'},
    ],
    swiperIdx: '0',
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    this.setScrollHeight();
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
  showMore: function () {
    this.setData({
      arrowTouched: !this.arrowTouched
    });
  },
  hide: function () {
    this.setData({
      arrowTouched: false
    });
  },
  onSlideChangeEnd: function (e) {
    var that = this;
    that.setData({
      swiperIdx: e.detail.current
    })
  },
  showCmtDetail: function () {
    wx.navigateTo({
      url: 'cmtDetail/cmtDetail',
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
  commentCourse: function() {
    wx.navigateTo({
      url: '../../comment/newComment/newUnivCom/newUnivCom',
    })
  }
})