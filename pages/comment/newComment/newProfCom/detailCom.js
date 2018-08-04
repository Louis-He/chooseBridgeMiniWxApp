// pages/comment/newComment/newUnivCom/detailCom.js
var requestUtil = require('../../../../utils/requestUtil.js'); 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    "wordNumber": 0,
    "isLoad": false
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
    this.setData({
      "isLoad": false
    })
    var that = this;
    wx.getStorage({
      key: 'tmpProfCom',
      success: function (res) {
        that.setData({
          "isLoad": true,
          tmpProfCom: res.data
        })
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
    var that = this
    if (this.data.isLoad) {
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
              "professor_id": 1,
              "course_code": that.data.tmpProfCom.courseId,
              "course_name": that.data.tmpProfCom.course,
              "is_attend": that.data.tmpProfCom.isAttend,
              "difficult_level": that.data.tmpProfCom.courseDiff,
              "homework_num": that.data.tmpProfCom.homework,
              "course_related_quiz": that.data.tmpProfCom.relevance,
              "quiz_num": that.data.tmpProfCom.monthlyTest,
              "spend_course_time_at_week": that.data.tmpProfCom.extraTime,
              "grade": that.data.tmpProfCom.grade,
              "comment": that.data.comment,
              "tag": that.data.tags
            }
            // console.log(sendData)
            // console.log(that.data.tmpUnivComment)

            wx.request({
              url: 'https://api.viewmycourses.com//api/professor-rate/create',
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

            that.setData({
              tmpProfCom: null
            })
            wx.removeStorage({
              key: 'tmpProfCom',
              success: function (res) {
                console.log('用户离开界面，tmpProfComs删除');
              },
            })
          })
        },
      })
    } else {
      console.log('用户点击过快, 需要重新尝试')
    }
  }
})