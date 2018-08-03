// pages/comment/newComment/newProfCom/newProfCom.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_modal_Hidden: true,
    is_modal_Msg: '我是一个自定义组件',
    is_modal_Title: '提示',
    "grades": ["请选择", "A", "B", "C","D","F","Dropped the course"],
    "gradeIndex": 0,
    "grade": null,
    "isAttend": true
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

  codeInput: function (e) {
    this.setData({
      courseId: e.detail.value
    })
  },

  courseInput: function (e) {
    this.setData({
      course: e.detail.value
    })
  },

  courseDifficultyChange: function (e) {
    this.setData({
      courseDiff: e.detail.value
    })
  },

  homeworkChange: function (e){
    this.setData({
      homework: e.detail.value
    })
  },

  relevanceChange: function (e){
    this.setData({
      relevance: e.detail.value
    })
  },

  monthlyTestChange: function (e){
    this.setData({
      monthlyTest: e.detail.value
    })
  },

  extraTimeChange: function (e){
    this.setData({
      extraTime: e.detail.value
    })
  },

  isAttendChange: function (e){
    this.setData({
      isAttend: e.detail.value
    })
  },

  bindGradeChange: function (e) {
    var that = this;
    console.log('picker country 发生选择改变，携带值为', this.data.grades[e.detail.value]);

    this.setData({
      'grade': that.data.grades[e.detail.value],
      'gradeIndex': e.detail.value
    })
  },

  nextStep: function (){
    var summaryData = {
      isAttend: this.data.isAttend,
      courseId: this.data.courseId,
      course: this.data.course,
      courseDiff: this.data.courseDiff,
      homework: this.data.homework,
      relevance: this.data.relevance,
      monthlyTest: this.data.monthlyTest,
      extraTime: this.data.extraTime,
      grade: this.data.grade
    }

    wx.setStorage({
      key: 'tmpProfCom',
      data: summaryData,
    })

    //console.log(summaryData)

    wx.navigateTo({
      url: 'detailCom',
    })
  }
})