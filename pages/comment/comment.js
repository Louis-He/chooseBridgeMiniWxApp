// pages/comment/comment.js
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
    accessible: true,
    courseBase: true,
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
  toResult: function () {
    if (this.data.courseBase == true)
    {
      wx.switchTab({
        url: '../courses/courses',
      })
    } else {
      wx.switchTab({
        url: '../university/university',
      })
    }
  },
  toUniversity: function () {
    wx.navigateTo({
      url: 'specificUni/specificUni',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  }
})