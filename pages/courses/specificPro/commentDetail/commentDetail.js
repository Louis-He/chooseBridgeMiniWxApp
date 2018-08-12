// pages/courses/specificPro/commentDetail/commentDetail.js
var requestUtil = require('../../../../utils/requestUtil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tags: [],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true,
      success: function (res) {
      }
    })
    this.setScrollHeight();
    var that = this;
    wx.getStorage({
      key: 'profCmtDetail',
      success: function(res) {
        console.log(res);
        //根据student_id获取点评学生信息
        requestUtil.getStudentByID(res.data.studentID, function (result) {
          console.log(result);
          that.setData({
            university: result.student.school_name,
            major: result.student.major,
            province: result.student.exam_province,
            graduate: result.student.graduate_year,
          })
        });


        //转换tags数据结构
        var tempTags = new Array();
        tempTags = res.data.tags.split(",");
        console.log(tempTags);
        //存储后台数据
        that.setData({
          tags: tempTags,
          date: res.data.date,
          effort: res.data.effort,
          courseName: res.data.courseName,
          courseCode: res.data.courseCode,
          attendence: res.data.btmRates.attendence,
          difficult: res.data.btmRates.difficult,
          homework: res.data.btmRates.homework,
          comment: res.data.comment,
          index: res.data.index,
        })
      },
    })
    wx.getStorage({
      key: 'professorID',
      success: function (res) {
        console.log(res);
        requestUtil.getProfessorDetail(res.data,
          function (result) {
            that.setData({
              likes: result.rateInfo[that.data.index].thumbs_up_percent,
              dislikes: result.rateInfo[that.data.index].thumbs_down_percent,
            })
          })
      },
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
    var unionId = '';
    wx.getStorage({
      key: 'unionId',
      success: function (res) {
        unionId = res.data
      },
    })
    return {
      title: '邀请您加入桥选学生社群！',
      path: '/pages/user/user?unionid=' + unionId,
      success: function (res) {
        var shareTickets = res.shareTickets;
        if (shareTickets.length == 0) {
          return false;
        }
        wx.getShareInfo({
          shareTicket: shareTickets[0],
          success: function (res) {
            console.log(res)

          }
        })
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  addLike: function () {
    var that = this;
    wx.getStorage({
      key: 'professorID',
      success: function (res) {
        requestUtil.getProfessorDetail(res.data,
          function (result) {
            //用户未点赞也未踩，直接反馈已点赞
            if (!result.rateInfo[that.data.index].is_thumbs_up
              && !result.rateInfo[that.data.index].is_thumbs_down) {
              requestUtil.thumbsUpProfessorRate(result.rateInfo[that.data.index].professor_rate_id,
                function (feedbackResult) {
                })
              that.onLoad();
              wx.showToast({
                title: '已点赞',
              })
              //用户未点赞但已踩，先取消踩再点赞，并反馈已点赞
            } else if (!result.rateInfo[that.data.index].is_thumbs_up
              && result.rateInfo[that.data.index].is_thumbs_down) {
              requestUtil.thumbsDownProfessorRate(result.rateInfo[that.data.index].professor_rate_id,
                function (feedbackResult) {
                  requestUtil.thumbsUpProfessorRate(result.rateInfo[that.data.index].professor_rate_id,
                    function (feedbackResult) {
                    })
                  that.onLoad();
                  wx.showToast({
                    title: '已点赞',
                  })
                })
              //用户已点赞并未踩，直接反馈已取消
            } else if (result.rateInfo[that.data.index].is_thumbs_up
              && !result.rateInfo[that.data.index].is_thumbs_down) {
              requestUtil.thumbsUpProfessorRate(result.rateInfo[that.data.index].professor_rate_id,
                function (feedbackResult) {
                })
              that.onLoad();
              wx.showToast({
                title: '已取消',
              })
            }
          })
      },
    })
  },
  share: function () {

  },
  addDislike: function () {
    var that = this;
    wx.getStorage({
      key: 'professorID',
      success: function (res) {
        requestUtil.getProfessorDetail(res.data,
          function (result) {
            //用户未踩未点赞，直接反馈已反对
            if (!result.rateInfo[that.data.index].is_thumbs_up
              && !result.rateInfo[that.data.index].is_thumbs_down) {
              requestUtil.thumbsDownProfessorRate(result.rateInfo[that.data.index].professor_rate_id,
                function (feedbackResult) {
                })
              that.onLoad();
              wx.showToast({
                title: '已反对',
              })
              //用户未踩但已点赞，先取消点赞再踩，并反馈已反对
            } else if (result.rateInfo[that.data.index].is_thumbs_up
              && !result.rateInfo[that.data.index].is_thumbs_down) {
              requestUtil.thumbsUpProfessorRate(result.rateInfo[that.data.index].professor_rate_id,
                function (feedbackResult) {
                  requestUtil.thumbsDownProfessorRate(result.rateInfo[that.data.index].professor_rate_id,
                    function (feedbackResult) {
                    })
                  that.onLoad();
                  wx.showToast({
                    title: '已反对',
                  })
                })
              //用户已踩未点赞，直接反馈已取消
            } else if (!result.rateInfo[that.data.index].is_thumbs_up
              && result.rateInfo[that.data.index].is_thumbs_down) {
              requestUtil.thumbsDownProfessorRate(result.rateInfo[that.data.index].professor_rate_id,
                function (feedbackResult) {
                })
              that.onLoad();
              wx.showToast({
                title: '已取消',
              })
            }
          })
      },
    })
  },
})