// pages/comment/newComment/newUnivCom/newUnivCom.js
var requestUtil = require('../../../../utils/requestUtil.js'); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    popErrorMsg: '',
    "university": "Loading",
    "campuses": [],
    "campusIndices": [],
    "campusIndex": 0,
    "campus": null,
    "reputation": 0,
    "academic": 0,
    "webService": 0,
    "dom": 0,
    "food": 0,
    "geo": 0,
    "activity": 0,
    "infrastructure": 0,
    "happiness": 0,
    "relationship": 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    var that = this;
    this.setScrollHeight();
    wx.getStorage({
      key: 'pushTmpUniv',
      success: function(res) {
        if (res.data.school_name.length > 20){
          that.setData({
            universityShow: res.data.school_name.substring(0, 20) + '...'
          })
        }else{
          that.setData({
            universityShow: res.data.school_name
          })
        }
        that.setData({
          university: res.data.school_name
        })
        requestUtil.getSchoolInfo(res.data.school_id, function (result) {
          console.log(result);
          that.setData({
            campuses: result[1],
            campusIndices: result[0],
            campus: result[1][0]
          })
        })
        wx.removeStorage({
          key: 'pushTmpUniv',
          success: function (res) {
            console.log("注意：pushTmpUniv缓存变量清除")
          },
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
    wx.getStorage({
      key: 'isEmailEdu',
      success: function (res) {
        if (!res.data) {
          wx.navigateTo({
            url: '../../../user/privilegeForm/errorEmail',
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

  bindCampusChange: function (e) {
    var that = this;
    console.log('picker country 发生选择改变，携带值为', this.data.campuses[e.detail.value]);

    this.setData({
      'campus': that.data.campuses[e.detail.value],
      'campusIndex': e.detail.value
    })
  },

  socialReputationChange: function (e) {
    this.setData({
      'reputation': e.detail.value
    })
  },

  academicLevelChange: function (e) {
    this.setData({
      'academic': e.detail.value
    })
  },

  WebServiceChange: function (e) {
    this.setData({
      'webService': e.detail.value
    })
  },

  domConditionChange: function (e) {
    this.setData({
      'dom': e.detail.value
    })
  },

  foodQualityChange: function (e) {
    this.setData({
      'food': e.detail.value
    })
  },

  geoLocationChange: function (e) {
    this.setData({
      'geo': e.detail.value
    })
  },

  activityChange: function (e) {
    this.setData({
      'activity': e.detail.value
    })
  },

  infrastructureChange: function (e) {
    this.setData({
      'infrastructure': e.detail.value
    })
  },

  happinessChange: function (e) {
    this.setData({
      'happiness': e.detail.value
    })
  },

  relationshipChange: function (e) {
    this.setData({
      'relationship': e.detail.value
    })
  },

  nextStep: function () {
    // Check the input
    
    var errorMsg = "";
    var popError = false;
    if (this.data.reputation == 0){
      popError = true;
      if (errorMsg) {
        errorMsg += "、社会名誉";
      } else {
        errorMsg += "社会名誉";
      }
    }
    if (this.data.academic == 0) {
      popError = true;
      if (errorMsg) {
        errorMsg += "、学术水平";
      } else {
        errorMsg += "学术水平";
      }
    }
    if (this.data.webService == 0) {
      popError = true;
      if (errorMsg) {
        errorMsg += "、网络服务";
      } else {
        errorMsg += "网络服务";
      }
    }
    if (this.data.dom == 0) {
      popError = true;
      if (errorMsg) {
        errorMsg += "、住宿条件";
      } else {
        errorMsg += "住宿条件";
      }
    }
    if (this.data.food == 0) {
      popError = true;
      if (errorMsg) {
        errorMsg += "、餐饮质量";
      } else {
        errorMsg += "餐饮质量";
      }
    }
    if (this.data.geo == 0) {
      popError = true;
      if (errorMsg) {
        errorMsg += "、地理位置";
      } else {
        errorMsg += "地理位置";
      }
    }
    if (this.data.activity == 0) {
      popError = true;
      if (errorMsg) {
        errorMsg += "、课外活动";
      } else {
        errorMsg += "课外活动";
      }
    }
    if (this.data.infrastructure == 0) {
      popError = true;
      if (errorMsg) {
        errorMsg += "、基础设施";
      } else {
        errorMsg += "基础设施";
      }
    }
    if (this.data.happiness == 0) {
      popError = true;
      if (errorMsg) {
        errorMsg += "、幸福指数";
      } else {
        errorMsg += "幸福指数";
      }
    }
    if (this.data.relationship == 0) {
      popError = true;
      if (errorMsg) {
        errorMsg += "、校方与学生关系";
      } else {
        errorMsg += "校方与学生关系";
      }
    }

    if (popError) {
      /* 填写检查不通过，要求用户重新填写 */
      errorMsg = "您有以下部分没有填写：\n" + errorMsg;
      if (errorMsg.length < 25) {
        this.setData({
          popErrorMsg: errorMsg
        })
      } else {
        this.setData({
          popErrorMsg: '您有多处必填项未完成填写，请检查'
        })
      }
    } else {
      this.setData({
        'tmpUnivComment': { "school_id": 4, "school_district_id": this.data.campusIndices[this.data.campusIndex], 'campus': this.data.campus, 'reputation': this.data.reputation, 'academic': this.data.academic, 'webService': this.data.webService, 'dom': this.data.dom, 'food': this.data.food, 'geo': this.data.geo, 'activity': this.data.activity, 'infrastructure': this.data.infrastructure, 'happiness': this.data.happiness, 'relationship': this.data.relationship, }
      })

      wx.setStorage({
        key: 'tmpUnivComment',
        data: this.data.tmpUnivComment,
      })

      wx.navigateTo({
        url: 'detailCom',
      })
    }
  }
})