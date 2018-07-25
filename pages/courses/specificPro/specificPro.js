// pages/courses/specificPro/specificPro.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    proName: "Effrosyni Seitaridou",
    uniName: "University of Illinois at Urbana-Champaign",
    schoolName: "College of Agricultural, Consumer & Environmental Sci.",
    numOfLikes: "999+",
    tagsUp: [
      {tag: '风趣幽默', num: '(99+)'},
      {tag: '严谨认真', num: '(99+)'},
      {tag: '学识渊博', num: '(99+)' },
      {tag: '超赞讲师', num: '(99+)' }
    ],
    tagsDown: [
      { tag: '和蔼可亲', num: '(99+)' },
      { tag: '公平公正', num: '(99+)' },
      { tag: '反馈及时', num: '(99+)' },
      { tag: '课后沟通多', num: '(99+)'}
    ],
    workingIndex: '3.2',
    arrowTouched: false,
    hide: true,
    commentTime: '2018-06'
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
      arrowTouched: true
    });
  },
  hide: function () {
    this.setData({
      arrowTouched: false
    })
  },
  commentCourse: function () {
    wx.navigateTo({
      url: '../../comment/newComment/newProfCom/newProfCom',
    })
  },
  showCmtDetail: function () {
    wx.navigateTo({
      url: 'commentDetail/commentDetail',
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
  }
})