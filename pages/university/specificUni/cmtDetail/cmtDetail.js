// pages/university/specificUni/cmtDetail/cmtDetail.js
var requestUtil = require('../../../../utils/requestUtil.js');
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
    wx.showShareMenu({
      withShareTicket: true,
      success: function (res) {
      }
    })
    this.setScrollHeight();
    wx.showLoading({
      title: "加载中..."
    })
    var that = this;
    wx.getStorage({
      key: 'cmtInfo',
      success: function(res) {
        requestUtil.getSchoolDetail(res.data.university_id,
          function (result) {
            var index = res.data.index;
            var studentID = result.ratesInfo[index].create_student_id;
            var createTime = result.ratesInfo[index].created_at.substring(0, 10);
            requestUtil.getStudentByID(studentID, function (studentResult) {
              var graduateYear = studentResult.student.graduate_year;
              var highSchool = studentResult.student.exam_province;
              that.setData({
                cmtData: {
                  university: result.schoolInfo.school_name,
                  graduateYear: graduateYear,
                  province: highSchool,
                  major: result.ratesInfo[index].major,
                  comment: result.ratesInfo[index].comment,
                  commentTime: createTime,
                  score: result.ratesInfo[index].score,
                  district: result.ratesInfo[index].school_district_name,
                  socialReputation: result.ratesInfo[index].social_reputation,
                  academic: result.ratesInfo[index].academic_level,
                  network: result.ratesInfo[index].network_services,
                  dorm: result.ratesInfo[index].accommodation,
                  food: result.ratesInfo[index].food_quality,
                  location: result.ratesInfo[index].campus_location,
                  acticities: result.ratesInfo[index].extracurricular_activities,
                  infra: result.ratesInfo[index].campus_infrastructure,
                  happiness: result.ratesInfo[index].life_happiness_index,
                  relation: result.ratesInfo[index].school_students_relations,
                  index: index,
                }
              })
            });
          })
      },
    });
    wx.getStorage({
      key: 'cmtInfo',
      success: function(res) {
        //console.log(res);
        requestUtil.getSchoolDetail(res.data.university_id,
          function (result) {
            that.setData({
              likes: result.ratesInfo[res.data.index].thumbs_up_percent,
              dislikes: result.ratesInfo[res.data.index].thumbs_down_percent,
            })
            wx.hideLoading();
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
  addLike: function() {
    var that = this;
    wx.getStorage({
      key: 'pushTmpUniv',
      success: function(res) {
        requestUtil.getSchoolDetail(res.data.school_id,
          function (result) {
            //用户未点赞也未踩，直接反馈已点赞
            if (!result.ratesInfo[that.data.cmtData.index].is_thumbs_up 
            && !result.ratesInfo[that.data.cmtData.index].is_thumbs_down) {
              requestUtil.thumbsUpSchoolRate(result.ratesInfo[that.data.cmtData.index].school_rate_id,
                function (feedbackResult) {
                })
              that.onLoad();
              wx.showToast({
                title: '加载中',
                icon: 'loading',
              })
              wx.showToast({
                title: '已点赞',
              })
              //用户未点赞但已踩，先取消踩再点赞，并反馈已点赞
            } else if (!result.ratesInfo[that.data.cmtData.index].is_thumbs_up
              && result.ratesInfo[that.data.cmtData.index].is_thumbs_down) {
              requestUtil.thumbsDownSchoolRate(result.ratesInfo[that.data.cmtData.index].school_rate_id,
                function (feedbackResult) {
                  requestUtil.thumbsUpSchoolRate(result.ratesInfo[that.data.cmtData.index].school_rate_id,
                    function (feedbackResult) {
                    })
                  that.onLoad();
                  wx.showToast({
                    title: '加载中',
                    icon: 'loading',
                  })
                  wx.showToast({
                    title: '已点赞',
                  })
                })
              //用户已点赞并未踩，直接反馈已取消
            } else if (result.ratesInfo[that.data.cmtData.index].is_thumbs_up
            && !result.ratesInfo[that.data.cmtData.index].is_thumbs_down) {
              requestUtil.thumbsUpSchoolRate(result.ratesInfo[that.data.cmtData.index].school_rate_id,
                function (feedbackResult) {
                })
              that.onLoad();
              wx.showToast({
                title: '加载中',
                icon: 'loading',
              })
              wx.showToast({
                title: '已取消',
              })
            }
          })
      },
    })
  },
  share: function() {

  },
  addDislike: function() {
    var that = this;
    wx.getStorage({
      key: 'pushTmpUniv',
      success: function (res) {
        requestUtil.getSchoolDetail(res.data.school_id,
          function (result) {
            //用户未踩未点赞，直接反馈已反对
            if (!result.ratesInfo[that.data.cmtData.index].is_thumbs_down
              && !result.ratesInfo[that.data.cmtData.index].is_thumbs_up) {
              requestUtil.thumbsDownSchoolRate(result.ratesInfo[that.data.cmtData.index].school_rate_id,
                function (feedbackResult) {
                  //console.log(result);
                })
              that.onLoad();
              wx.showToast({
                title: '已反对',
              })
            //用户未踩但已点赞，先取消点赞再踩，并反馈已反对  
            } else if (!result.ratesInfo[that.data.cmtData.index].is_thumbs_down
            && result.ratesInfo[that.data.cmtData.index].is_thumbs_up) {
              requestUtil.thumbsUpSchoolRate(result.ratesInfo[that.data.cmtData.index].school_rate_id,
                function (feedbackResult) {
                  requestUtil.thumbsDownSchoolRate(result.ratesInfo[that.data.cmtData.index].school_rate_id,
                    function (feedbackResult) {
                    })
                  that.onLoad();
                  wx.showToast({
                    title: '已反对',
                  })
                })
              //用户已踩未点赞，直接反馈已取消
            } else if (result.ratesInfo[that.data.cmtData.index].is_thumbs_down
              && !result.ratesInfo[that.data.cmtData.index].is_thumbs_up) {
              requestUtil.thumbsDownSchoolRate(result.ratesInfo[that.data.cmtData.index].school_rate_id,
                function (feedbackResult) {
                  console.log(result);
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