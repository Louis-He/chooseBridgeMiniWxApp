// pages/user/emailForm/emailForm.js
var requestUtil = require('../../../utils/requestUtil.js'); 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    "email": "example1@mail.example.com",
    "newEmail": ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    var that = this;
    wx.getStorage({
      key: 'unionId',
      success: function(res) {
        that.setData({
          unionId: res.data
        })
      },
    })
    wx.getStorage({
      key: 'email',
      success: function (res) {
        console.log(res.data)
        that.setData({
          email: res.data
        })
      },
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

  emailInput: function (e) {
    this.setData({
      newEmail: e.detail.value
    })
  },

  requestConfirm: function(){
    requestUtil.changeEmail(this.data.newEmail, this.data.unionId, function(result){
      console.log(result)
      if(!result.data.success){
        wx.navigateTo({
          url: 'fail',
        })
      }else{
        wx.navigateTo({
          url: 'tokenConfirm',
        })
      }
    });
  }
})