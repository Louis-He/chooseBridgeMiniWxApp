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
    if (typeof (options) != undefined && options.universityID != undefined) {
      wx.setStorageSync('university_id', options.universityID)
      console.log(options.universityID)
    }

    wx.showShareMenu({
      withShareTicket: true,
      success: function (res) {
      }
    })
    this.setScrollHeight();
    var that = this;
    wx.getStorage({
      key: 'university_id',
      success: function(res) {
        requestUtil.getSchoolDetail(res.data,
          function (result) {
            console.log(result);
            var tempArray = result.ratesInfo;
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
                schoolName: result.schoolInfo.school_name,
                city: result.schoolInfo.city,
                province: res.data.province,
                country: result.schoolInfo.country,
                rcmdProfessorName: result.randomProfessor.professor_full_name,
                rcmdProfessorID: result.randomProfessor.professor_id,
                overallScore: result.schoolInfo.school_score,
                schoolDistrictInfo: result.schoolDistrictInfo,
                ratesInfo: result.ratesInfo,
                schoolID: res.data,
              }
            })
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
    var that = this;
    var unionId = '';
    wx.getStorage({
      key: 'unionId', 
      success: function (res) {
        unionId = res.data
      },
    })
    return {
      title: '查看' + this.data.schoolData.schoolName,
      path: 'pages/university/specificUni/specificUni?unionid=' + unionId + '&universityID=' + that.data.schoolData.schoolID,
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
    wx.getStorage({
      key: 'university_id',
      success: function(res) {
        requestUtil.getSchoolDetail(res.data,
          function (result) {
            var cmtInfo = {
              university_id: res.data,
              index: index
            }
              wx.setStorage({
                key: 'cmtInfo',
                data: cmtInfo,
                success: function () {
                  wx.navigateTo({
                    url: 'cmtDetail/cmtDetail',
                  });
                }
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
            wx.showToast({
              title: '已点赞',
            })
        } else {
          requestUtil.thumbsUpSchool(that.data.schoolData.schoolID,
            function (result) {
            })
          that.onLoad();
          wx.showToast({
            title: '已取消',
          })
        }
      })
  },
})