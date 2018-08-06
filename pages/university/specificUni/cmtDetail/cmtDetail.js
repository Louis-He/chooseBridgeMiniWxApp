// pages/university/specificUni/cmtDetail/cmtDetail.js
var requestUtil = require('../../../../utils/requestUtil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailCmtLeft: [
      { category: '社会声誉: 3' },
      { category: '学术水平: 3' },
      { category: '网络服务: 3' },
      { category: '住宿条件: 3' },
      { category: '餐饮质量: 3' },
    ],
    detailCmtRight: [
      { category: '校园地理位置: 3' },
      { category: '校园课外活动: 3' },
      { category: '校园基础设施: 3' },
      { category: '生活幸福指数: 3' },
      { category: '校方与学生群体关系: 3' },
    ],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setScrollHeight();
    var that = this;
    wx.getStorage({
      key: 'cmtDetail',
      success: function(res) {
        console.log(res);
        that.setData({
          cmtData: {
            university: res.data.university,
            graduateYear: res.data.graduate,
            province: res.data.high,
            major: res.data.cmtData.major,
            comment: res.data.cmtData.comment,
            commentTime: res.data.time,
            //likes: res.data.cmtData.thumbs_up_percent,
            //dislikes: res.data.cmtData.thumbs_down_percent,
            score: res.data.cmtData.score,
            district: res.data.cmtData.school_district_name,
            socialReputation: res.data.cmtData.social_reputation,
            academic: res.data.cmtData.academic_level,
            network: res.data.cmtData.network_services,
            dorm: res.data.cmtData.accommodation,
            food: res.data.cmtData.food_quality,
            location: res.data.cmtData.campus_location,
            acticities: res.data.cmtData.extracurricular_activities,
            infra: res.data.cmtData.campus_infrastructure,
            happiness: res.data.cmtData.life_happiness_index,
            relation: res.data.cmtData.school_students_relations,
            index: res.data.index,
          }
        })
      },
    });
    wx.getStorage({
      key: 'pushTmpUniv',
      success: function(res) {
        console.log(res);
        requestUtil.getSchoolDetail(res.data.school_id,
          function (result) {
            that.setData({
              likes: result.ratesInfo[that.data.cmtData.index].thumbs_up_percent,
              dislikes: result.ratesInfo[that.data.cmtData.index].thumbs_down_percent,
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