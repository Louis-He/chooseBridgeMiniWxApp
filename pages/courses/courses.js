// pages/courses/courses/result.js
var requestUtil = require('../../utils/requestUtil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    firstView: true,
    inputShowed: false,
    blankUni: "学校",
    blankPro: "教授",
    inputVal: "",
    professors: [],
    multiIndex: [0, 0],
    multiArray: [[], []],
    pickerChose: false,
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
    // 初始化multiArray
      var tempLocationArray = new Array();
      requestUtil.getSchoolGroupByCountry(function (schoolResult) {
        console.log(schoolResult)
        var data = {
          multiArray: that.data.multiArray,
        }
        var tempArray = new Array();
        for (var i = 0; i < schoolResult["美国"].length; i++) {
          tempArray.push(schoolResult["美国"][i].school_name);
        }
        for (var key in schoolResult) {
          tempLocationArray.push(key);
        }
        console.log(tempLocationArray);
        data.multiArray[0] = tempLocationArray;
        data.multiArray[1] = tempArray;
        that.setData(data);
      })
    wx.getStorage({
      key: 'is_vip',
      success: function (res) {
        if (!res.data) {
          wx.navigateTo({
            url: '../user/privilegeForm/errorEmail',
          })
        }
      },
      fail: function () {
        wx.navigateTo({
          url: '../../user/privilegeForm/errorEmail',
        })
      }
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
    var that = this;
    wx.getStorage({
      key: 'professorName',
      success: function (res) {
        requestUtil.getProfessorByCondition(res.data.profName, function (result) {
          console.log(result);
          that.setData({
            professors: result
          })
        });
        if (res.data.fromNextSearchFlag) {
          that.setData({
            firstView: false,
          })
        }
      },
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.removeStorage({
      key: 'professorName',
      success: function(res) {},
    })
    this.setData({
      firstView: true,
    });
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

  /**
   * 两个picker处理函数
   */
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value,
      schoolBase: true
    });
    this.data.pickerChose = true;
  },

  bindMultiPickerColumnChange: function (e) {
    var that = this;
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    for (var i = 0; i < data.multiArray[0].length; i++) {
      switch (data.multiIndex[0]) {
        case i:
          requestUtil.getSchoolGroupByCountry(function (schoolResult) {
            console.log(schoolResult);
            var tempArray = new Array();
            var key = data.multiArray[0][data.multiIndex[0]];
            for (var j = 0; j < schoolResult[key].length; j++) {
              tempArray.push(schoolResult[key][j].school_name);
            }
            //console.log(tempArray);
            data.multiArray[1] = tempArray;
            //截取省份前十个字符
            var multiArrayDisplay = new Array();
            multiArrayDisplay = that.data.multiArray[1];
            var pattern = new RegExp("[\u4E00-\u9FA5]+");
            for (var i = 0; i < that.data.multiArray[1].length; i++) {
              if (pattern.test(that.data.multiArray[1][i]) && that.data.multiArray[1][i].length > 6) {
                multiArrayDisplay[i] = that.data.multiArray[1][i].substring(0, 6) + "...";
              } else if (!pattern.test(that.data.multiArray[1][i]) &&
                that.data.multiArray[1][i].length > 20) {
                multiArrayDisplay[i] = that.data.multiArray[1][i].substring(0, 20) + "...";
              }
            }
            
            that.setData(data);
            //console.log(data.multiArray[1]);
          })
          break;
      }
      //console.log(data.multiArray[1]);
    }
  },


  toResult: function () {
    var that = this;
    this.setData({
      firstView: false
    });
    if (!that.data.schoolBase) {
      requestUtil.getProfessorByCondition(that.data.inputVal, function (result) {
        console.log(result);
        that.setData({
          professors: result
        })
      });
    } else {
      requestUtil.getProfessorBySchool(that.data.multiArray[1][that.data.multiIndex[1]],
      that.data.inputVal, 10, 1, function (result) {
        console.log(result);
        that.setData({
          professors: result.professors,
        })
      });
    }
    
  },
  toProfessor: function(e) {
    var that = this;
    var index = parseInt(e.currentTarget.dataset.index);
    var professorID = that.data.professors[index].professor_id;
    var professor_name_cmt = that.data.professors[index].professor_full_name;
    wx.setStorage({
      key: 'professorID',
      data: professorID,
      success: function() {
        wx.navigateTo({
          url: 'specificPro/specificPro',
        })
      }
    });
    wx.setStorage({
      key: 'professor_name_cmt',
      data: professor_name_cmt,
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
  createNew: function () {
    wx.navigateTo({
      url: 'newPro/newPro'
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
  usePicker: function() {
    this.setData({
      pickerChose: true,
    })
  }
})