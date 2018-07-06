// pages/university/newUniversity/newUniversity.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
    if (!this.data.country) {
      popError = true;
      if (errorMsg) {
        errorMsg += ",国家";
      } else {
        errorMsg += "国家";
      }
    }
    if (!this.data.country) {
      popError = true;
      if (errorMsg) {
        errorMsg += ",国家";
      } else {
        errorMsg += "国家";
      }
    }
    if (!this.data.province) {
      popError = true;
      if (errorMsg) {
        errorMsg += ",省市/联邦州";
      } else {
        errorMsg += "省市/联邦州";
      }
    }
    if (!this.data.city) {
      popError = true;
      if (errorMsg) {
        errorMsg += ",城市";
      } else {
        errorMsg += "城市";
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
      wx.showModal({
        title: '您有部分内容没有填写',
        content: '您有以下部分没有填写：' + errorMsg,
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户已经确认')
          }
        }
      });
    }else{
      var tmpUniversityInfo = {
        Name : this.data.university,
        abbr : this.data.abbrUniversity,
        country : this.data.country,
        province : this.data.province,
        city : this.data.city,
        homePage : this.data.homePage
      }


      console.log("填写检查通过: tmpUniversityInfo = ")
      console.log(tmpUniversityInfo)
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

  countryInput: function (e) {
    this.setData({
      country: e.detail.value
    })
  },

  provinceInput: function (e) {
    this.setData({
      province: e.detail.value
    })
  },

  cityInput: function (e) {
    this.setData({
      city: e.detail.value
    })
  },

  homePageInput: function (e) {
    this.setData({
      homePage: e.detail.value
    })
  }

})