// pages/comment/newComment/newProfCom/newProfCom.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_modal_Hidden: true,
    is_modal_Msg: '我是一个自定义组件',
    is_modal_Title: '提示',
    "profName": "TEST",
    "grades": ["请选择", "A", "B", "C","D","F","未完成"],
    "gradeIndex": 0,
    "grade": null,
    "isAttend": true,
    "tagsUp": [{ tags: "风趣幽默", selected: false }, { tags: "和蔼可亲", selected: false }, { tags: "严谨认真", selected: false }, { tags: "反馈及时", selected: false }, { tags: "学识渊博", selected: false }],
    "tagsDown": [{ tags: "超赞讲师", selected: false }, { tags: "课后沟通多", selected: false }, { tags: "公平公正", selected: false }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setScrollHeight();
    var that = this;
    wx.getStorage({
      key: 'professor_name_cmt',
      success: function(res) {
        that.setData({
          profName: res.data
        })
      },
    })
    wx.getStorage({
      key: 'professorID',
      success: function (res) {
        that.setData({
          professorID: res.data
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

  codeInput: function (e) {
    this.setData({
      courseId: e.detail.value
    })
  },

  courseInput: function (e) {
    this.setData({
      course: e.detail.value
    })
  },

  courseDifficultyChange: function (e) {
    this.setData({
      courseDiff: e.detail.value
    })
  },

  homeworkChange: function (e){
    this.setData({
      homework: e.detail.value
    })
  },

  relevanceChange: function (e){
    this.setData({
      relevance: e.detail.value
    })
  },

  monthlyTestChange: function (e){
    this.setData({
      monthlyTest: e.detail.value
    })
  },

  extraTimeChange: function (e){
    this.setData({
      extraTime: e.detail.value
    })
  },

  isAttendChange: function (e){
    this.setData({
      isAttend: e.detail.value
    })
  },

  bindGradeChange: function (e) {
    var that = this;
    console.log('picker country 发生选择改变，携带值为', this.data.grades[e.detail.value]);

    this.setData({
      'grade': that.data.grades[e.detail.value],
      'gradeIndex': e.detail.value
    })
  },

  chooseUpTag: function (e) {
    // console.log(e.currentTarget.dataset.index);
    var currentData = this.data.tagsUp
    if (!currentData[e.currentTarget.dataset.index].selected){
      currentData[e.currentTarget.dataset.index].selected = true;
    }else{
      currentData[e.currentTarget.dataset.index].selected = false;
    }
    // console.log(currentData)
    this.setData({
      tagsUp: currentData
    })
  },

  chooseDownTag: function (e) {
    // console.log(e.currentTarget.dataset.index);
    var currentData = this.data.tagsDown
    if (!currentData[e.currentTarget.dataset.index].selected) {
      currentData[e.currentTarget.dataset.index].selected = true;
    } else {
      currentData[e.currentTarget.dataset.index].selected = false;
    }
    // console.log(currentData)
    this.setData({
      tagsDown: currentData
    })
  },

  nextStep: function (){
    // 统计 tags，并写入一个字符串
    var tags = "";
    for (var i = 0; i < this.data.tagsUp.length; i++){
      // console.log(this.data.tagsUp[i])
      if (tags != "" && this.data.tagsUp[i].selected) {
        tags += ',' + this.data.tagsUp[i].tags
      }
      if(tags == "" && this.data.tagsUp[i].selected){
        tags += this.data.tagsUp[i].tags
      }
    }
    for (var i = 0; i < this.data.tagsDown.length; i++) {
      // console.log(this.data.tagsDown[i])
      if (tags != "" && this.data.tagsDown[i].selected) {
        tags += ',' + this.data.tagsDown[i].tags
      }
      if (tags == "" && this.data.tagsDown[i].selected) {
        tags += this.data.tagsDown[i].tags
      }
    }

    var summaryData = {
      professorID: this.data.professorID,
      isAttend: this.data.isAttend,
      courseId: this.data.courseId,
      course: this.data.course,
      courseDiff: this.data.courseDiff,
      homework: this.data.homework,
      relevance: this.data.relevance,
      monthlyTest: this.data.monthlyTest,
      extraTime: this.data.extraTime,
      grade: this.data.grade,
      tags: tags
    };

    wx.setStorage({
      key: 'tmpProfCom',
      data: summaryData,
    });

    //console.log(summaryData)

    wx.navigateTo({
      url: 'detailCom',
    });
  }
})