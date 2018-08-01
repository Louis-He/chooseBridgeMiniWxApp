// pages/courses/newPro/newPro.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_modal_Hidden: true,
    is_modal_Msg: '我是一个自定义组件',
    is_modal_Title: '提示'
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
    if (!this.data.lastName){
      popError = true;
      if (errorMsg){
        errorMsg += ",教授姓";
      }else{
        errorMsg += "教授姓";
      }
    }
    if (!this.data.firstName) {
      popError = true;
      if (errorMsg) {
        errorMsg += ",教授名";
      } else {
        errorMsg += "教授名";
      }
    }
    if (!this.data.university) {
      popError = true;
      if (errorMsg) {
        errorMsg += ",学校";
      } else {
        errorMsg += "学校";
      }
    }
    if (!this.data.department) {
      popError = true;
      if (errorMsg) {
        errorMsg += ",学院";
      } else {
        errorMsg += "学院";
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
      var tmpProInfo = {
        lastName : this.data.lastName,
        firstName : this.data.firstName,
        university : this.data.university,
        department : this.data.department,
        homePage : this.data.homePage
      }

      console.log("填写检查通过: tmpProInfo = ")
      // console.log(tmpProInfo)
      wx.setStorage({
        key: 'tmpProInfo',
        data: tmpProInfo,
      })


      wx.redirectTo({
        url: 'confirmAdd',
      })
    }
    
  },

  /**
   * 以下六个方法为绑定文本框和变量
   */
  lastNameInput: function (e){
    this.setData({
      lastName: e.detail.value
    })
  },

  firstNameInput: function (e){
    this.setData({
      firstName: e.detail.value
    })
  },

  universityInput: function (e) {
    this.setData({
      university: e.detail.value
    })
  },

  departmentInput: function (e) {
    this.setData({
      department: e.detail.value
    })
  },

  homePageInput: function (e) {
    this.setData({
      homePage: e.detail.value
    })
  }

})