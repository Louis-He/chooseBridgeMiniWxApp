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
    "grade": null
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

  bindGradeChange: function (e) {
    var that = this;
    console.log('picker country 发生选择改变，携带值为', this.data.grades[e.detail.value]);

    this.setData({
      'grade': that.data.grades[e.detail.value],
      'gradeIndex': e.detail.value
    })
  },

  nextStep: function (){
    wx.navigateTo({
      url: 'detailCom',
    })
  }
})