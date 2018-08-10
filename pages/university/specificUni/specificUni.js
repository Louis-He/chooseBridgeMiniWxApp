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
    swiperIdx: '0',
    schoolData: {},
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
            schoolID: res.data.schoolID,
          }
        })
        requestUtil.getSchoolDetail(res.data.schoolID,
          function (result) {
            that.setData({
              likesNum: result.schoolInfo.thumbs_up_num,
              thumbsSync: result,
            })
          })
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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
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
      title: '查看' + this.data.schoolData.schoolName,
      path: 'pages/university/specificUni/specificUni?unionid=' + unionId,
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
            index: index,
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
    var that = this;
    requestUtil.getSchoolDetail(that.data.schoolData.schoolID,
      function (result) {
        if (!result.schoolInfo.is_thumbs_up) {
          requestUtil.thumbsUpSchool(that.data.schoolData.schoolID,
            function (result) {
            })
            that.onLoad();
        } else {
          requestUtil.thumbsUpSchool(that.data.schoolData.schoolID,
            function (result) {
            })
          that.onLoad();
        }
      })
  },
})