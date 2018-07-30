// pages/university/newUniversity/newUniversity.js
var requestUtil = require('../../../utils/requestUtil.js'); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_modal_Hidden: true,
    is_modal_Msg: '我是一个自定义组件',
    is_modal_Title: '提示',
    countries: [],
    countryIndex: 0,
    provinces: [],
    provinceIndices: [],
    provinceIndex: 0,
    cities: [],
    cityIndices: [],
    cityIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 初始化国家信息
    requestUtil.getCountries(function(result){
      that.setData({
        countries: result,
        country: result[0],
        countryIndex: 0
      })
      // 初始化省份信息
      requestUtil.getProvinceByCountry(parseInt(that.data.countryIndex) + 1, function (provincesResult) {
        // console.log(provincesResult)
        that.setData({
          provinceIndices: provincesResult[0], 
          provinces: provincesResult[1],
          provinceIndex: 0,
        })
        // 初始化城市信息
        requestUtil.getCityByProvince(parseInt(that.data.provinceIndex) + 1, function (citiesResult) {
          that.setData({
            cityIndices: citiesResult[0],
            cities: citiesResult[1]
          })
        })
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

  /**
   * 确认创建按钮
   */
  confirm: function (){
    var errorMsg = "";
    var popError = false;
    if(!this.data.university){
      popError = true;
      if (errorMsg){
        errorMsg += ",学校名称";
      }else{
        errorMsg += "学校名称";
      }
    }
    if (!this.data.homePage) {
      popError = true;
      if (errorMsg) {
        errorMsg += ",学校首页";
      } else {
        errorMsg += "学校首页";
      }
    }

    if (popError){
      /* 填写检查不通过，要求用户重新填写 */
      errorMsg = "您有以下部分没有填写：\n" + errorMsg;
      this.setData({
        is_modal_Hidden: false,
        is_modal_Msg: errorMsg
      })
    }else{
      // console.log(this.data.provinces[this.data.provinceIndices[this.data.provinceIndex]])
      // console.log(this.data.cityIndices[this.data.cityIndex])
      var tmpUniversityInfo = {
        Name : this.data.university,
        abbr : this.data.abbrUniversity,
        country : this.data.country,
        province: this.data.provinces[this.data.provinceIndex],
        city: this.data.cities[this.data.cityIndex],
        homePage : this.data.homePage,
        country_id: parseInt(this.data.countryIndex) + 1,
        province_id: this.data.provinceIndices[this.data.provinceIndex],
        city_id: this.data.cityIndices[this.data.cityIndex]
      }

      // console.log("填写检查通过: tmpUniversityInfo = ")
      // console.log(tmpUniversityInfo)
      wx.setStorage({
        key: 'tmpUniv',
        data: tmpUniversityInfo,
      })
      wx.navigateTo({
        url: 'confirmAdd',
      })
    }
    
  },

  /**
   * 以下六个方法为绑定文本框和变量
   */
  universityInput: function (e){
    this.setData({
      university: e.detail.value
    })
  },

  abbrUniversityInput: function (e){
    this.setData({
      abbrUniversity: e.detail.value
    })
  },

  bindCountryChange: function (e) {
    var that = this;
    // console.log('picker country 发生选择改变，携带值为', this.data.countries[e.detail.value]);
    this.setData({
      country: that.data.countries[e.detail.value],
      countryIndex: parseInt(e.detail.value)
    })
    // console.log(e.detail.value)
    // 更改国家后需要重新初始化省份信息
    requestUtil.getProvinceByCountry(parseInt(that.data.countryIndex) + 1, function (provincesResult) {
      console.log(provincesResult)
      that.setData({
        provinceIndices: provincesResult[0],
        provinces: provincesResult[1],
        provinceIndex: 0
      })
      // 初始化城市信息
      requestUtil.getCityByProvince(parseInt(that.data.provinceIndices[that.data.provinceIndex]) , function (citiesResult) {
        console.log(citiesResult)
        that.setData({
          cityIndices: citiesResult[0],
          cities: citiesResult[1],
          cityIndex: 0
        })
      })
    })
  },

  bindProvinceChange: function (e) {
    var that = this;
    // console.log('picker country 发生选择改变，携带值为', this.data.countries[e.detail.value]);
    this.setData({
      province: that.data.provinces[e.detail.value],
      provinceIndex: parseInt(e.detail.value)
    })
    // 更改省份后需要重新初始化城市信息

    requestUtil.getCityByProvince(parseInt(that.data.provinceIndices[that.data.provinceIndex]), function (citiesResult) {
      // console.log(citiesResult)
      that.setData({
        cityIndices: citiesResult[0],
        cities: citiesResult[1],
      })
    })
  },

  bindCityChange: function (e) {
    var that = this;
    // console.log('picker country 发生选择改变，携带值为', this.data.countries[e.detail.value]);
    this.setData({
      city: that.data.cities[e.detail.value],
      cityIndex: e.detail.value
    })
  },

  homePageInput: function (e) {
    this.setData({
      homePage: e.detail.value
    })
  }

})