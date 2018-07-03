// pages/user/user.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAgree: false,
    firstViewmsg: "",
    firstView: true,
    username: "叮咚的雨",
    rp: 20,
    university: "University of Toronto",
    discipline: "Computer Engineering",
    highSchoolAddress: "上海",
    graduateYear: "在读",
    emailFlag: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this
    wx.getStorage({
      key: 'firstView',
      success: function (res) {
        console.log("onLoad: ", res.data)
        if (res.data){
          // 首次未进入小程序
          that.setData({
            firstViewmsg: "决定加入桥选学生社群"
          })
        }else{
          // 已经进入过小程序，直接进入用户页
          that.setData({
            'firstView': false
          })
          that.userPageOnLoad();
        }
      } ,
      fail: function (res){
        console.log('fail get storage status')
        wx.getUserInfo({
          /* 之前授权过，直接进入*/
          success: function (res){
            wx.setStorage({
              key: "firstView",
              data: false
            })
            that.setData({
              "firstView": false,
            })
          },
          /* 否则视作新用户，请求授权 */
          fail: function (res){
            wx.setStorage({
              key: "firstView",
              data: true
            })
            that.setData({
              "firstView": true,
              "firstViewmsg": "欢迎加入桥选学生社群"
            })
          }
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
   * 用户开始使用巧选校园
   */
  firstUse: function() {
    var that = this;
    wx.getUserInfo({
      success: function (res){
        console.log("SUCCESS")
        wx.setStorage({
          key: "firstView",
          data: false
        })
        that.setData({
          "firstView": false
        })
        that.userPageOnLoad();
      },
      fail: function (res){
        if(!that.isAgree){
          wx.showModal({
            content: '请阅读并同意相关条款以继续',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          });
        }else{
          wx.showModal({
            content: '请同意巧选校园使用您的基本信息以继续',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          });
        }
      }
    })
  },

  bindAgreeChange: function (e) {
    this.setData({
      isAgree: !!e.detail.value.length
    });
  },

  userPageOnLoad: function(){
    var that = this;
    wx.getUserInfo({
      success: function (res){
        console.log(res.rawData)
      },
      fail: function (res){
        console.log("fail")
        wx.showModal({
          content: '授权状态发生改版，请重新确认给予获取您基本信息的权限',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        });
        that.setData({
          "firstView": true,
          "isAgree": true,
          "firstViewmsg": "继续使用巧选校园"
        })
      }
    })
  },

  /**
   * 用户更改学术信息
   */
  updateAcemedicPage: function (){
    wx.navigateTo({
      url: 'acedemicForm/acedemicForm',
    })
  },


})