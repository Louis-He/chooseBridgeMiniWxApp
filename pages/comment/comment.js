// pages/comment/comment.js
var requestUtil = require('../../utils/requestUtil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    courseBase: true,
    blankVal: "教授",
    showResults: false,
    universities: [],
    professors: []
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
    wx.getStorage({
      key: 'isEmailEdu',
      success: function(res) {
        if(!res.data){
          wx.navigateTo({
            url: '../user/privilegeForm/errorEmail',
          })
        }
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

  courseBase: function () {
    this.setData({
      blankVal: "教授",
      courseBase: true
    })
  },
  universityBase: function () {
    this.setData({
      blankVal: "高校",
      courseBase: false
    });
  },
  toResult: function() {
    this.setData({
      showResults: true
    });
    var that = this;
    if (!that.data.courseBase) {
      requestUtil.getSchoolByCondition(that.data.inputVal, function (result) {
        console.log(result);
        that.setData({
          universities: result
        })
      });
    } else {
      requestUtil.getProfessorByCondition(that.data.inputVal, function (result) {
        console.log(result);
        that.setData({
          professors: result
        })
      });
    }
  },
  toUnivResult: function() {
    this.setData({
      showResults: true
    });
    var that = this;
    requestUtil.getSchoolByCondition(that.data.inputVal, function (result) {
      console.log(result);
      that.setData({
        universities: result
      })
    });
  },
  toProfResult: function () {
    var that = this;
    this.setData({
      firstView: false
    });
    requestUtil.getProfessorByCondition(that.data.inputVal, function (result) {
      console.log(result);
      that.setData({
        professors: result
      })
    });
  },
  commentUniversity: function (e) {
    var that = this;
    var index = parseInt(e.currentTarget.dataset.index);
    var pushTmpUniv = {
      school_name: that.data.universities[index].school_name,
      school_nickname: that.data.universities[index].school_nick_name,
      school_id: that.data.universities[index].school_id
    }
    wx.setStorage({
      key: 'pushTmpUniv',
      data: pushTmpUniv,
      success: function () {
        wx.navigateTo({
          url: 'newComment/newUnivCom/newUnivCom',
        })
      }
    });
  },
  commentProfessor: function (e) {
    var that = this;
    var index = parseInt(e.currentTarget.dataset.index);
    var professorID = that.data.professors[index].professor_id;
    var professor_name_cmt = that.data.professors[index].professor_full_name;
    wx.setStorage({
      key: 'professorID',
      data: professorID,
    });
    wx.setStorage({
      key: 'professor_name_cmt',
      data: professor_name_cmt,
      success: function () {
        wx.navigateTo({
          url: 'newComment/newProfCom/newProfCom',
        })
      }
    })
  },
  createNew: function () {
    wx.navigateTo({
      url: '../university/newUniversity/newUniversity'
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
  }
})