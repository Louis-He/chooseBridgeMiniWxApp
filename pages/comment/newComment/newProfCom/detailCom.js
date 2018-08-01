// pages/comment/newComment/newUnivCom/detailCom.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "wordNumber": 0
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
    wx.getStorage({
      key: 'tmpProfCom',
      success: function (res) {
        console.log(res.data)
      },
    })
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

  contentInput: function (e) {
    this.setData({
      "wordNumber": e.detail.cursor,
      "comment": e.detail.value
    })
  },

  nextStep: function () {
    wx.navigateTo({
      url: 'success',
    })
  }
})