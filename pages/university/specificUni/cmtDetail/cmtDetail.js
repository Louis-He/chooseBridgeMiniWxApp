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
    var that = this;
    wx.getStorage({
      key: 'cmtInfo',
      success: function(res) {
        // console.log(res);
        // that.setData({
        //   cmtData: {
        //     university: res.data.university,
        //     graduateYear: res.data.graduate,
        //     province: res.data.high,
        //     major: res.data.cmtData.major,
        //     comment: res.data.cmtData.comment,
        //     commentTime: res.data.time,
        //     score: res.data.cmtData.score,
        //     district: res.data.cmtData.school_district_name,
        //     socialReputation: res.data.cmtData.social_reputation,
        //     academic: res.data.cmtData.academic_level,
        //     network: res.data.cmtData.network_services,
        //     dorm: res.data.cmtData.accommodation,
        //     food: res.data.cmtData.food_quality,
        //     location: res.data.cmtData.campus_location,
        //     acticities: res.data.cmtData.extracurricular_activities,
        //     infra: res.data.cmtData.campus_infrastructure,
        //     happiness: res.data.cmtData.life_happiness_index,
        //     relation: res.data.cmtData.school_students_relations,
        //     index: res.data.index,
        //   }
        // })
        // dividing line
        requestUtil.getSchoolDetail(res.data.university_id,
          function (result) {
            var index = res.data.index;
            var studentID = result.ratesInfo[index].create_student_id;
            var createTime = result.ratesInfo[index].created_at.substring(0, 10);
            requestUtil.getStudentByID(studentID, function (studentResult) {
              var graduateYear = studentResult.student.graduate_year;
              var highSchool = studentResult.student.exam_province;

              // var cmtDetail = {
              //   university: result.schoolInfo.school_name,
              //   cmtData: result.ratesInfo[index],
              //   graduate: graduateYear,
              //   high: highSchool,
              //   time: createTime,
              //   index: index,
              // }
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
            if (!result.ratesInfo[that.data.cmtData.index].is_thumbs_up) {
              requestUtil.thumbsUpSchoolRate(result.ratesInfo[that.data.cmtData.index].school_rate_id,
                function (result) {
                })
              that.onLoad();
            } else {
              requestUtil.thumbsUpSchoolRate(result.ratesInfo[that.data.cmtData.index].school_rate_id,
                function (result) {
                })
              that.onLoad();
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
            if (!result.ratesInfo[that.data.cmtData.index].is_thumbs_down) {
              requestUtil.thumbsDownSchoolRate(result.ratesInfo[that.data.cmtData.index].school_rate_id,
                function (result) {
                  console.log(result);
                })
              that.onLoad();
            } else {
              requestUtil.thumbsDownSchoolRate(result.ratesInfo[that.data.cmtData.index].school_rate_id,
                function (result) {
                })
              that.onLoad();
            }
          })
      },
    })
  },
})