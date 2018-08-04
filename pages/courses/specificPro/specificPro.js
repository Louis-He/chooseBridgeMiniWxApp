// pages/courses/specificPro/specificPro.js
var requestUtil = require('../../../utils/requestUtil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    proName: "Effrosyni Seitaridou",
    uniName: "University of Illinois at Urbana-Champaign",
    schoolName: "College of Agricultural, Consumer & Environmental Sci.",
    numOfLikes: "999+",
    tagsDown: [
      { tag: '和蔼可亲', num: '(99+)' },
      { tag: '公平公正', num: '(99+)' },
      { tag: '反馈及时', num: '(99+)' },
      { tag: '课后沟通多', num: '(99+)'}
    ],
    workingIndex: '3.2',
    arrowTouched: false,
    hide: true,
    commentTimee: '2018-06',
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
          tempEffort = tempEffort / result.coursesInfo.length;
          that.setData({
            avgEffort: tempEffort,
          })

          //截取点评时间年月
          var length = result.rateInfo.length;
          var tempCommentTime;
          for (var i = 0; i < length; i++) {
            tempCommentTime = result.rateInfo[i].created_at.date.substring(0, 7);
          }

          //转换tags数据结构
          var tempTags = new Array();
          for (var key in result.tagsInfo) {
            tempTags.push({ tag: key, num: '(' + result.tagsInfo[key] + ')' });
          }
          that.setData({
            tagsUp: tempTags
          })

          //转换用户点评数字成文字含义
          var temprate = result.rateInfo;
          var tempDifficult = "";
          var tempHomework;
          var tempAttendence;
          for (var i = 0; i < temprate.length; i++) {
            if (parseInt(temprate.difficult_level) == 4) {
              tempDifficult = "较难";
              console.log("eyeyey");
            }
          }
          console.log(temprate);
          console.log(tempDifficult);
          console.log(temprate.difficult_level);

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
            }
          })
          console.log(that.data.info);
        });
      },
    })
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
  commentCourse: function () {
    wx.navigateTo({
      url: '../../comment/newComment/newProfCom/newProfCom',
    })
  },
  showCmtDetail: function () {
    wx.navigateTo({
      url: 'commentDetail/commentDetail',
    })
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