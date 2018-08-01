// pages/comment/comment.js
var requestUtil = require('../../utils/requestUtil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    accessible: true,
    courseBase: true,
    blankVal: "教授",
    showResults: false,
    universities: [],
    professors: []
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

  courseBase: function () {
    this.setData({
      blankVal: "教授",
      courseBase: true
    })
  },
  universityBase: function () {
    this.setData({
      blankVal: "高校",
      courseBase: false
    });
  },
  toResult: function() {
    this.setData({
      showResults: true
    });
    var that = this;
    if (!that.data.courseBase) {
      requestUtil.getSchoolByCondition(that.data.inputVal, function (result) {
        console.log(result);
        that.setData({
          universities: result
        })
      });
    } else {
      requestUtil.getProfessorByCondition(that.data.inputVal, function (result) {
        console.log(result);
        that.setData({
          professors: result
        })
      });
    }
  },
  toUnivResult: function() {
    this.setData({
      showResults: true
    });
    var that = this;
    requestUtil.getSchoolByCondition(that.data.inputVal, function (result) {
      console.log(result);
      that.setData({
        universities: result
      })
    });
  },
  toProfResult: function () {
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
  commentUniversity: function () {
    wx.navigateTo({
      url: 'newComment/newUnivCom/newUnivCom',
    })
  },
  commentProfessor: function () {
    wx.navigateTo({
      url: 'newComment/newProfCom/newProfCom',
    })
  },
  createNew: function () {
    wx.navigateTo({
      url: '../university/newUniversity/newUniversity'
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