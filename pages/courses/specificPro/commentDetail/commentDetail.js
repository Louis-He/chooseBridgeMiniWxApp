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
  
  },
  addLike: function () {
    var that = this;
    wx.getStorage({
      key: 'professorID',
      success: function (res) {
        requestUtil.getProfessorDetail(res.data,
          function (result) {
            requestUtil.thumbsUpProfessorRate
              (result.rateInfo[that.data.index].professor_rate_id,
                function (result) {
                  //console.log(result);
                })
              that.onLoad();
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
            requestUtil.thumbsDownProfessorRate
                (result.rateInfo[that.data.index].professor_rate_id,
                function (result) {
                  //console.log(result);
                })
              that.onLoad();
          })
      },
    })
  },
})