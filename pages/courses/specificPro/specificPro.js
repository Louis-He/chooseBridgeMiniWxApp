// pages/courses/specificPro/specificPro.js
var requestUtil = require('../../../utils/requestUtil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    arrowTouched: false,
    hide: true,
    btmRates: [],
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    this.setScrollHeight();
    var that = this;
    wx.getStorage({
      key: 'professorID',
      success: function(res) {
        requestUtil.getProfessorDetail(res.data, function (result) {
          console.log(result);

          // 计算平均努力指数
          var tempEffort = 0.0;
          for (var i = 0; i < result.coursesInfo.length; i++) {
            tempEffort += parseFloat(result.coursesInfo[i].effort);
          }
          tempEffort = (tempEffort / result.coursesInfo.length).toFixed(1);
          that.setData({
            avgEffort: tempEffort,
          })

          //截取点评时间年月
          var length = result.rateInfo.length;
          var tempCommentTime = new Array();
          for (var i = 0; i < length; i++) {
            tempCommentTime.push(result.rateInfo[i].created_at.date.substring(0, 7));
          }

          //转换tags数据结构
          var tempTags = new Array();
          for (var key in result.tagsInfo) {
            tempTags.push({ tag: key, num: '(' + result.tagsInfo[key] + ')' });
            if (tempTags.length == 4) break;
          }
          var tempTagsDown = new Array();
          var i = 0;
          for (var key in result.tagsInfo) {
            if (i < 4) i++;
            else tempTagsDown.push({ tag: key, num: '(' + result.tagsInfo[key] + ')' });
          }
          that.setData({
            tagsUp: tempTags,
            tagsDown: tempTagsDown
          })
          console.log(that.data.tagsDown);

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

          //存储后台数据
          that.setData({
            commentTime: tempCommentTime,
            info: {
              name: result.professorInfo.professor_full_name,
              university: result.professorInfo.school,
              college: result.professorInfo.college,
              website: result.professorInfo.professor_web_site,
              likes: result.professorInfo.thumbs_up_num,
              tags: result.tagsInfo,
              courses: result.coursesInfo,
              rates: result.rateInfo,
              professorID: res.data,
            }
          })
          that.setData({
            thumbsSync: result.rateInfo,
          })
        });
      },
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.onLoad();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  showMore: function () {
    this.setData({
      arrowTouched: true
    });
  },
  hide: function () {
    this.setData({
      arrowTouched: false
    })
  },
  toResult: function () {
    var that = this;
    var infoForSearch = {
      profName: that.data.inputVal,
      fromNextSearchFlag: true,
    }
    wx.setStorage({
      key: 'professorName',
      data: infoForSearch,
      success: function() {
        wx.switchTab({
          url: '../courses',
        })
      }
    });
  },
  commentCourse: function () {
    wx.navigateTo({
      url: '../../comment/newComment/newProfCom/newProfCom',
    })
  },
  showCmtDetail: function (e) {
    var that = this;
    var index = parseInt(e.currentTarget.dataset.index);
    var profCmtDetail = {
      tags: that.data.info.rates[index].tag,
      btmRates: that.data.btmRates[index],
      grade: that.data.info.rates[index].grade,
      courseCode: that.data.info.rates[index].course_code,
      courseName: that.data.info.rates[index].course_name,
      comment: that.data.info.rates[index].comment,
      effort: that.data.info.rates[index].effort,
      date: that.data.commentTime[index],
      likes: that.data.info.rates[index].thumbs_up_percent,
      dislikes: that.data.info.rates[index].thumbs_down_percent,
      studentID: that.data.info.rates[index].create_student_id,
      index: index,
    }
    wx.setStorage({
      key: 'profCmtDetail',
      data: profCmtDetail,
      success: function() {
        wx.navigateTo({
          url: 'commentDetail/commentDetail',
        })
      }
    })
  },

  addLike: function() {
    var that = this;
    requestUtil.getProfessorDetail(that.data.info.professorID,
      function (result) {
        if (!result.professorInfo.is_thumbs_up) {
          requestUtil.thumbsUpProfessor(that.data.info.professorID,
            function (result) {
            })
          that.onLoad();
        } else {
          requestUtil.thumbsUpProfessor(that.data.info.professorID,
            function (result) {
            })
          that.onLoad();
        }
      })
  },

  toPersonalPage:function() {

  },

  setScrollHeight: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
  }
})