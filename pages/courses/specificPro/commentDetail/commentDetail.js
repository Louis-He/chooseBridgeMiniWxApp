// pages/courses/specificPro/commentDetail/commentDetail.js
var requestUtil = require('../../../../utils/requestUtil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tags: [],
    btmRates: [],
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
    wx.showLoading({
      title: "加载中..."
    })

    wx.getStorage({
      key: 'profCmtInfo',
      success: function (res) {
        requestUtil.getProfessorDetail(res.data.profID, function (result) {
          console.log(result);
          //截取点评时间年月
          var length = result.rateInfo.length;
          var tempCommentTime = new Array();
          for (var i = 0; i < length; i++) {
            tempCommentTime.push(result.rateInfo[i].created_at.date.substring(0, 7));
          }

          //转换用户点评数字成文字含义
          var temprate = result.rateInfo;
          var tempDifficult;
          var tempHomework;
          var tempAttendence;
          for (var i = 0; i < temprate.length; i++) {
            if (temprate[i].difficult_level == 1) tempDifficult = "简单";
            if (temprate[i].difficult_level == 2) tempDifficult = "较易";
            if (temprate[i].difficult_level == 3) tempDifficult = "中等";
            if (temprate[i].difficult_level == 4) tempDifficult = "较难";
            if (temprate[i].difficult_level == 5) tempDifficult = "很难";
            if (temprate[i].homework_num == 1) tempHomework = "很少";
            if (temprate[i].homework_num == 2) tempHomework = "较少";
            if (temprate[i].homework_num == 3) tempHomework = "中等";
            if (temprate[i].homework_num == 4) tempHomework = "较多";
            if (temprate[i].homework_num == 5) tempHomework = "很多";
            if (temprate[i].is_attend == 1) tempAttendence = "是";
            if (temprate[i].is_attend == 2) tempAttendence = "否";
            that.data.btmRates[i] = {
              difficult: tempDifficult,
              homework: tempHomework,
              attendence: tempAttendence,
            }
          }
          that.setData({
            btmRates: that.data.btmRates,
          })

          //转换tags数据结构
          var index = res.data.index;
          var tempTags = new Array();
          tempTags = result.rateInfo[index].tag.split(",");
          console.log(tempTags);

          //存储后台数据
          that.setData({
            commentTime: tempCommentTime,
            date: tempCommentTime[index],
            tags: tempTags,
            index: index,
            comment: result.rateInfo[index].comment,
            effort: result.rateInfo[index].effort,
            courseName: result.rateInfo[index].course_name,
            courseCode: result.rateInfo[index].course_code, 
            attendence: that.data.btmRates[index].attendence,
            difficult: that.data.btmRates[index].difficult,
            homework: that.data.btmRates[index].homework,
            studentID: result.rateInfo[index].create_student_id,
          })

          //根据student_id获取点评学生信息
          requestUtil.getStudentByID(result.rateInfo[index].create_student_id, function (stuRes) {
            console.log(stuRes);
            that.setData({
              university: stuRes.student.school_name,
              major: stuRes.student.major,
              province: stuRes.student.exam_province,
              graduate: stuRes.student.graduate_year,
            })
          });
        }
      )}
    })

    wx.getStorage({
      key: 'profCmtInfo',
      success: function (res) {
        console.log(res);
        requestUtil.getProfessorDetail(res.data.profID,
          function (result) {
            console.log(that.data.index);
            that.setData({
              likes: result.rateInfo[res.data.index].thumbs_up_percent,
              dislikes: result.rateInfo[res.data.index].thumbs_down_percent,
            })
            wx.hideLoading();
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
    var that = this;
    var unionId = '';
    var professorName = '';
    wx.getStorage({
      key: 'unionId',
      success: function (res) {
        unionId = res.data
      },
    })
    professorName = wx.getStorageSync('professor_name_cmt');
    return {
      title: '查看' + professorName + '详细评价',
      path: '/pages/courses/specificPro/specificPro?unionid=' + unionId + '&professorID=' + that.data.info.professorID,
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

  /* 点赞功能 */ 
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