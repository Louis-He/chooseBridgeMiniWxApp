// pages/comment/newComment/newUnivCom/detailCom.js
var requestUtil = require('../../../../utils/requestUtil.js'); 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    "isLoad": false,
    "wordNumber": 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'tmpUnivComment',
      success: function(res) {
        that.setData({
          "isLoad": true,
          tmpUnivComment: res.data
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

  contentInput: function (e) {
    this.setData({
      "wordNumber": e.detail.cursor,
      "commentDetail": e.detail.value
    })
  },

  nextStep: function (){
    var that = this
    if(this.data.isLoad){
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

            var sendData = {
              "school_id": that.data.tmpUnivComment.school_id,
              "school_district_id": that.data.tmpUnivComment.school_district_id,
              "social_reputation": that.data.tmpUnivComment.reputation,
              "academic_level": that.data.tmpUnivComment.academic,
              "network_services": that.data.tmpUnivComment.webService,
              "accommodation": that.data.tmpUnivComment.dom,
              "food_quality": that.data.tmpUnivComment.food,
              "campus_location": that.data.tmpUnivComment.geo,
              "extracurricular_activities": that.data.tmpUnivComment.activity,
              "campus_infrastructure": that.data.tmpUnivComment.infrastructure,
              "life_happiness_index": that.data.tmpUnivComment.happiness,
              "school_students_relations": that.data.tmpUnivComment.relationship,
              "comment": that.data.commentDetail,
            }
            // console.log(sendData)
            // console.log(that.data.tmpUnivComment)

            wx.request({
              url: 'https://api.viewmycourses.com//api/school-rate/create',
              method: 'POST',
              header: requestedData,
              data: sendData,
              success: function (res) {
                console.log(res.data)
                wx.navigateTo({
                  url: 'success',
                })
              }
            })
            
            wx.removeStorage({
              key: 'tmpUnivComment',
              success: function (res) {
                console.log("onHide: 用户离开确认页面, tmpUnivComment缓存变量清除")
              },
            })
          })
        },
      })
    }else{
      console.log('用户点击过快, 需要重新尝试')
    }
  },

})