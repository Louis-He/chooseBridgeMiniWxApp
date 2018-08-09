// pages/university/university/result.js
var requestUtil = require('../../utils/requestUtil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    universities: [],
    firstView: true,
    nameBase: true,
    blankVal: "高校",
    inputVal: "",
    multiIndex: [0,0],
    multiArray: [[], [] ],
    pickerChose: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setScrollHeight();
    var that = this;
    // 初始化multiArray
    requestUtil.getCountries(function (result) {
      console.log(result);
      var tempLocationArray = new Array();
      tempLocationArray[0] = result;


      requestUtil.getProvinceByCountry(1, function (provincesResult) {
        console.log(provincesResult)
        var data = {
          multiArray: that.data.multiArray,
        }
        data.multiArray[0] = tempLocationArray[0];
        data.multiArray[1] = provincesResult[1];
        that.setData(data);
      })
    })
    wx.getStorage({
      key: 'isEmailEdu',
      success: function (res) {
        if (!res.data) {
          wx.navigateTo({
            url: '../user/privilegeForm/errorEmail',
          })
        }
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
    var that = this;
    wx.getStorage({
      key: 'uniName',
      success: function (res) {
        requestUtil.getSchoolByCondition(res.data.uniName, function (result) {
          that.setData({
            universities: result
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
      key: 'uniName',
      success: function (res) { },
    });
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

  },

  /**
   * 两个picker处理函数
   */
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },

  bindMultiPickerColumnChange: function(e) {
    var that = this;
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex,
      provinceIndex: [],
    };
    data.multiIndex[e.detail.column] = e.detail.value;
     for (var i = 0; i < data.multiArray[0].length; i++) {
       switch (data.multiIndex[0]) {
        case i:
          requestUtil.getProvinceByCountry(i + 1, function (provincesResult) {
          console.log(provincesResult);
          data.multiArray[1] = provincesResult[1];
          data.provinceIndex = provincesResult[0];
          //截取省份前十个字符
          var multiArrayDisplay = new Array();
          multiArrayDisplay = that.data.multiArray[1];
          var pattern = new RegExp("[\u4E00-\u9FA5]+");
          for (var i = 0; i < that.data.multiArray[1].length; i++) {
            if (pattern.test(that.data.multiArray[1][i]) && that.data.multiArray[1][i].length > 5) {
              multiArrayDisplay[i] = that.data.multiArray[1][i].substring(0, 5) + "...";
            } else if (!pattern.test(that.data.multiArray[1][i]) &&
            that.data.multiArray[1][i].length > 9) {                
              multiArrayDisplay[i] = that.data.multiArray[1][i].substring(0, 9) + "...";
            }
          }
          //data.multiArray[1] = provincesResult[1];
          that.setData(data);
          console.log(provincesResult[1]);
        })
        break;
      }
      //console.log(data.multiArray[1]);
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
  createNew: function () {
    wx.navigateTo({
      url: 'newUniversity/newUniversity'
    })
  },
  nameBase: function () {
    this.setData({
      blankVal: "请输入学校名称",
      nameBase: true
    });
  },
  areaBase: function () {
    this.setData({
      blankVal: "所在省份/state",
      nameBase: false
    });
  },
  toResult: function () {
    var that = this;
    this.setData({
      firstView: false
    });
    //按名称搜索学校部分
    if (that.data.nameBase) {
      requestUtil.getSchoolByCondition(that.data.inputVal, function (result) {
        //console.log(result);
        that.setData({
          universities: result
        })
      });
    //按地区搜索学校部分
    } else {
      requestUtil.getCountries(function (result) {
        var countryID = 0;
        for (var i = 0; i < result.length; i++) {
          if (result[i] == that.data.multiArray[0][that.data.multiIndex[0]]) {
            countryID = i + 1;
            break;
          }
        }
        var provinceID = that.data.provinceIndex[that.data.multiIndex[1]];
        var pageSize = 10;
        var page = 1;
        console.log(countryID, provinceID);
        requestUtil.getSchoolByLocation(countryID, provinceID, pageSize, page, function (result) {
          console.log(result);
          that.setData({
            universities: result.schools,
          })
        })
      })
    }
    
  },

  toUniversity: function(e) {
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
    });
    requestUtil.getSchoolDetail(that.data.universities[index].school_id,
    function (result) {
      console.log(result);
      var tempSchoolData = {
        schoolName: result.schoolInfo.school_name,
        city: result.schoolInfo.city,
        province: result.schoolInfo.province,
        country: result.schoolInfo.country,
        rcmdProfessor: result.randomProfessor,
        overallScore: result.schoolInfo.school_score,
        likesNum: result.schoolInfo.thumbs_up_num,
        schoolDistrictInfo: result.schoolDistrictInfo,
        ratesInfo: result.ratesInfo,
        schoolID: that.data.universities[index].school_id,
      };
      wx.setStorage({
        key: 'tempSchoolData',
        data: tempSchoolData,
        success: function() {
          wx.navigateTo({
            url: 'specificUni/specificUni'
          });
        }
      })
    });
    
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
  usePicker: function () {
    this.setData({
      pickerChose: true,
    })
  }
})