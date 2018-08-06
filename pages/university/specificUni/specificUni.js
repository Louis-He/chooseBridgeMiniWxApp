// pages/university/specificUni/specificUni.js
var requestUtil = require('../../../utils/requestUtil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    arrowTouched: false,
    detailCmtLeft: [
      { category:'社会声誉: 3'},
      { category:'学术水平: 3'},
      { category:'网络服务: 3'},
      { category:'住宿条件: 3'},
      { category:'餐饮质量: 3'},
    ],
    detailCmtRight: [
      {category:'校园地理位置: 3'},
      {category:'校园课外活动: 3'},
      {category:'校园基础设施: 3'},
      {category:'生活幸福指数: 3'},
      {category:'校方与学生群体关系: 3'},
    ],
    swiperIdx: '0',
    schoolData: {},
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    this.setScrollHeight();
    var that = this;
    wx.getStorage({
      key: 'tempSchoolData',
      success: function(res) {
        var tempArray = res.data.ratesInfo;
        var tempScore = new Array();
        var tempCreatedTime = new Array();
        for (var i = 0; i < tempArray.length; i++) {
          tempScore[i] = tempArray[i].score.toString();
          tempScore[i] = parseFloat(tempScore[i]).toFixed(1);
          tempCreatedTime[i] = tempArray[i].created_at.substring(0, 10);
          that.setData({
            districtScore: tempScore,
            cmtCreatedTime: tempCreatedTime
          });
        }
        that.setData({
          schoolData: {
            schoolName: res.data.schoolName,
            city: res.data.city,
            province: res.data.province,
            country: res.data.country,
            rcmdProfessorName: res.data.rcmdProfessor.professor_full_name,
            rcmdProfessorID: res.data.rcmdProfessor.professor_id,
            overallScore: res.data.overallScore,
            schoolDistrictInfo: res.data.schoolDistrictInfo,
            ratesInfo: res.data.ratesInfo,
            likesNum: res.data.likesNum,
          }
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
      arrowTouched: !this.arrowTouched
    });
  },
  hide: function () {
    this.setData({
      arrowTouched: false
    });
  },
  onSlideChangeEnd: function (e) {
    var that = this;
    that.setData({
      swiperIdx: e.detail.current
    })
  },
  showCmtDetail: function (e) {
    var that = this;
    var index = parseInt(e.currentTarget.dataset.index);
    var studentID;
    var graduateYear;
    var highSchool;
    var createTime;
    wx.getStorage({
      key: 'tempSchoolData',
      success: function(res) {
        studentID = res.data.ratesInfo[index].create_student_id;
        createTime = res.data.ratesInfo[index].created_at.substring(0, 10);
        requestUtil.getStudentByID(studentID, function (result) {
          console.log(result);
          graduateYear = result.student.graduate_year;
          highSchool = result.student.exam_province;

          var cmtDetail = {
            university: res.data.schoolName,
            cmtData: res.data.ratesInfo[index],
            graduate: graduateYear,
            high: highSchool,
            time: createTime,
          }
          wx.setStorage({
            key: 'cmtDetail',
            data: cmtDetail,
            success: function () {
              wx.navigateTo({
                url: 'cmtDetail/cmtDetail',
              });
            }
          })
        });
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

  commentCourse: function() {
    wx.navigateTo({
      url: '../../comment/newComment/newUnivCom/newUnivCom',
    })
  },

  toResult: function () {
    var that = this;
    var infoForSearch = {
      uniName: that.data.inputVal,
      fromNextSearchFlag: true,
    }
    wx.setStorage({
      key: 'uniName',
      data: infoForSearch,
      success: function () {
        wx.switchTab({
          url: '../university',
        })
      }
    });
  },

  toRandomProf:function() {
    wx.setStorage({
      key: 'professorID',
      data: this.data.schoolData.rcmdProfessorID,
      success: function() {
        wx.navigateTo({
          url: '../../courses/specificPro/specificPro',
        })
      }
    })
  },

  addLike: function() {

  },
})