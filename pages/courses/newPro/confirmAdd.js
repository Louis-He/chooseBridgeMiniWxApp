// pages/courses/newPro/confirmAdd.js
var requestUtil = require('../../../utils/requestUtil.js');
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
    wx.hideShareMenu()
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
      key: 'tmpProInfo',
      success: function (res) {
        console.log(res.data)
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
      key: 'tmpProInfo',
      success: function (res) {
        console.log("onHide: 用户离开确认页面，tmpProInfo缓存变量清除")
      },
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.removeStorage({
      key: 'tmpProInfo',
      success: function (res) {
        console.log("onHide: 用户离开确认页面，tmpProInfo缓存变量清除")
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

  edit: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  confirm: function () {
    var that = this;
    wx.getStorage({
      key: 'user_id',
      success: function (res) {
        requestUtil.getViewmycoursesToken(res.data, function (result) {
          // console.log(result)
          var explicitData = { "token": result };
          // console.log(explicitData)
          var getSign = requestUtil.getSign(explicitData)

          var requestedData = {
            token: result,
            sign: getSign
          }

          console.log(that.data.requestConfirmData)

          
          wx.request({
            url: 'https://api.viewmycourses.com//api/professor/create',
            method: 'POST',
            header: requestedData,
            data: {
              "professor_fisrt_name": that.data.requestConfirmData.lastName,
              "professor_second_name": that.data.requestConfirmData.firstName,
              "school_id": that.data.requestConfirmData.university_id,
              "_college_id": that.data.requestConfirmData.departmen,
              "college_id": that.data.requestConfirmData.department_id,
              "professor_web_site": that.data.requestConfirmData.homePage,
              "agreement": true
            },
            success: function (res) {
              console.log(res.data)
              wx.setStorage({
                key: 'tmpProfId',
                data: res.data.data.id,
              })
              wx.setStorage({
                key: 'professorID',
                data: res.data.data.id,
                success:function(res){
                  wx.setStorage({
                    key: 'professor_name_cmt',
                    data: that.data.requestConfirmData.lastName + " " + that.data.requestConfirmData.firstName,
                    success: function (res) {
                      wx.redirectTo({
                        url: 'success',
                      })
                    }
                  })
                }
              })
              
            }
          })          
        })
      },
    })
  }
})