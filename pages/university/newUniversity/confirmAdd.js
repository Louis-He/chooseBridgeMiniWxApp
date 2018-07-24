// pages/university/newUniversity/confirmAdd.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
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
    var that = this
    wx.getStorage({
      key: 'tmpUniv',
      success: function(res) {
        that.setData({
          "requestConfirmData": res.data
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
   wx.removeStorage({
     key: 'tmpUniv',
     success: function(res) {
       console.log("onHide: 用户离开确认页面，tmpUniv缓存变量清除")
     },
   })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.removeStorage({
      key: 'tmpUniv',
      success: function (res) {
        console.log("onUnload: 用户离开确认页面，tmpUniv缓存变量清除")
      },
    })
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

  edit: function(){
    wx.navigateBack({
      delta: 1
    })
  },

  confirm: function(){
    wx.navigateTo({
      url: 'success',
    })
  }
})