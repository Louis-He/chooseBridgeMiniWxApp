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
    multiArray: [['中国', '美国', '加拿大'], ["ss", "天津", "河北省", "山西省", "内蒙古自治区", "辽宁省", "吉林省", "黑龙江省", "上海", "江苏省", "浙江省", "安徽省", "福建省", "江西省", "山东省", "河南省", "湖北省", "湖南省", "广东省", "广西壮族自治区", "海南省", "重庆", "重庆", "四川省", "贵州省", "云南省", "西藏自治区", "陕西省", "甘肃省", "青海省", "宁夏回族自治区", "新疆维吾尔自治区", "香港特別行政區", "澳門特別行政區", "臺灣"] ],
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
        //console.log(provincesResult)
        var data = {
          multiArray: that.data.multiArray,
        }
        data.multiArray[0] = tempLocationArray[0];
        data.multiArray[1] = provincesResult[1];
        that.setData(data);
      })
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
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
     for (var i = 0; i < data.multiArray[0].length; i++) {
       switch (data.multiIndex[0]) {
        case i:
          requestUtil.getProvinceByCountry(i + 1, function (provincesResult) {
          console.log(provincesResult);
          data.multiArray[1] = provincesResult[1];
          data.multiArray[2] = provincesResult[0];
          that.setData(data);
          //console.log(data.multiArray[1]);
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
            countryID = i;
            break;
          }
        }
        var provinceID = that.data.multiArray[2][that.data.multiIndex[1]];
        var pageSize = 10;
        var page = 0;
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
})