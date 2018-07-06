// pages/user/user.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    debug: true,
    isAgree: false,
    firstViewmsg: "",
    firstView: true,
    bothTrue: false,
    username: "",
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
    var that = this
    wx.getStorage({
      key: 'firstView',
      success: function (res) {
        console.log("onLoad: ", res.data)
        if (res.data) {
          // 首次未进入小程序
          console.log('非首次进入小程序首页')
          that.setData({
            firstViewmsg: "决定加入桥选学生社群"
          })
        } else {
          // 已经进入过小程序，直接进入用户页
          console.log('已进入过小程序')
          that.setData({
            'firstView': false
          })
          that.userPageOnLoad();
        }
      },
      fail: function (res) {
        console.log('小程序无storage')
        // 鉴定用户是否给予权限
        wx.getSetting({
          success: function (res) {
            if (res.authSetting['scope.userInfo']) {
              console.log('用户已授权，直接进入')
              // 已经授权，直接进入小程序
              wx.setStorage({
                key: "firstView",
                data: false
              })
              that.setData({
                "firstView": false,
              })
            } else {
              console.log('用户未授权，未进入过小程序')
              // 否则视作新用户，请求授权
              wx.setStorage({
                key: "firstView",
                data: true
              })
              that.setData({
                "firstView": true,
                "firstViewmsg": "欢迎加入桥选学生社群"
              })
            }
          },
          fail: function (res) {
            /* 网络环境不佳 */
            console.log("lowQuality Feedback Test: ", that.data.debug)
            if (!that.data.debug) {
              that.lowQualityNetwork();
            } else {
              that.setData({
                username: "Debug Mode"
              })
            }
          },
          complete: function () {

          }
        })
      }
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

  /**
   * 用户开始使用巧选校园
   */
  firstUse: function() {
    var that = this;
    
    wx.setStorage({
      key: "firstView",
      data: false
    })
    that.setData({
      "firstView": false
    })
    that.userPageOnLoad();  
  },

  // 同意条款单选框
  bindAgreeChange: function (e) {
    var that = this;
    this.setData({
      isAgree: !!e.detail.value.length
    });

    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          that.setData({
            'bothTrue': true
          })
        }else{
          wx.showModal({
            content: '请先点击蓝色按钮先给予我们获取您基本信息的权限以保证正常使用',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log('用户确认去授权')
              }
            }
          });
          that.setData({
            isAgree: false
          });
        }
      },
      fail: function(res){

      }
    })
  },

  userPageOnLoad: function(){
    var that = this;
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，直接获取用户信息
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo.nickName)
              that.setData({
                'username': res.userInfo.nickName
              })
            },
            fail: function (res) {
              console.log("fail")
              wx.showModal({
                content: '授权状态发生更改，请重新给予我们获取基本信息的权限以保证正常使用',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户确认返回首页重新确认权限')
                  }
                }
              });
              that.setData({
                "firstView": true,
                "isAgree": false,
                "firstViewmsg": "继续使用巧选校园"
              })
            }
          })
        } else {
          console.log("WTF不应该出现的console log？！")
        }
      },
      fail: function (res){
        console.log("lowQuality Feedback Test: ", that.data.debug)
        if (!that.data.debug) {
          that.lowQualityNetwork();
        } else {
          that.setData({
            username: "Debug Mode"
          })
        }
      }
    })
  },

  // 警告用户网络环境差
  lowQualityNetwork: function(){
    if (!this.debug) {
      this.setData({
        "firstView": true,
        "isAgree": false,
        "firstViewmsg": "使用巧选校园"
      })
      wx.navigateTo({
        url: 'lowQualityNetwork',
      })
    }
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