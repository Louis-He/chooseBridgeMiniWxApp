// pages/user/user.js
const app = getApp()
var utilMd5 = require('../../utils/util.js'); 
var requestUtil = require('../../utils/requestUtil.js'); 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isUsernameStorage: true,
    firstViewFlag: true,
    isadmin: false,
    debug: true,
    isAgree: false ,
    firstViewmsg: "",
    firstView: true,
    bothTrue: false,
    username: "拼命获取中...",
    rp: 0,
    university: "获取中...",
    discipline: "获取中...",
    highSchoolAddress: "获取中...",
    graduateYear: "获取中...",
    emailFlag: false,
    expireDay: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    wx.showShareMenu({
      withShareTicket: true,
      success: function(res){
        console.log(res)
      }
    })
    
    var that = this;
    that.setData({
      isUsernameStorage: false,
      isAdmin: false
    })
    wx.setStorage({
      key: 'isAdmin',
      data: false,
    })

    wx.removeStorage({
      key: 'professorID',
      success: function (res) {

      },
    })
    wx.removeStorage({
      key: 'professor_name_cmt',
      success: function (res) {

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
          // 已经进入过小程序，仍需要判断授权问题
          console.log('已进入过小程序')
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
                that.userPageOnLoad();
              } else {
                console.log('用户未授权，未进入过小程序')
                // 否则视作新用户，请求授权
                wx.setStorage({
                  key: "firstView",
                  data: true
                })
                that.setData({
                  "firstView": true,
                  "firstViewmsg": "请重新给予权限"
                })
              }
            }
          })
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
              that.userPageOnLoad();
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
    return {
      title: '邀请您加入桥选学生社群！',
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
          that.getUserUnionID()
        } else {
          console.log("WTF不应该出现的 tm哪里出问题了？！")
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

  getUserUnionID: function(){
    var that = this
    wx.login({
      success: res => {
        var inputCode = res.code
        var explicitData = {code: inputCode}
        var getSign = requestUtil.getSign(explicitData)

        var firstRequestedData = {
          code: inputCode,
          sign: getSign
        }

        // 补充用户名
        if(!that.data.isUsernameStorage){
          wx.getUserInfo({
            success: function (res) {
              // console.log(res.userInfo)
              wx.setStorage({
                key: 'username',
                data: res.userInfo.nickName,
              })
              that.setData({
                username: res.userInfo.nickName
              })
              if (res.userInfo.nickName == '叮咚的雨' || res.userInfo.nickName == 'Waldosia' || res.userInfo.nickName == '何炳昌') {
                console.log('欢迎管理员')
                that.setData({
                  isadmin: true
                })
                wx.setStorage({
                  key: 'isAdmin',
                  data: true,
                })
              }
            }
          })
        }

        // 前往请求unionId
        wx.getUserInfo({
          withCredentials: true,
          success: function (res) {
            // 获取用户unionID数据
            requestUtil.getUserUnionID(firstRequestedData, res, function (result) {
              //console.log(res);
              console.log(result);
              that.setData({
                username: res.userInfo.nickName
              })
              wx.setStorage({
                key: 'username',
                data: res.userInfo.nickName,
                success: function (res){
                  that.onLoad();
                }
              })
              app.globalData.userInfo = res
              //console.log(app.globalData)
              wx.setStorage({
                key: 'unionId',
                data: result.data.data.unionId,
              })

              // 获取用户unionId后得到用户choosebridge个人信息
              requestUtil.getChooseBridgeUserInfo(result.data.data.unionId, function (res) {
                
                var academicInfo = res.data.entities[0].academic;
                // 设置大学、专业、毕业年份、高中地区和邮箱状态
                //console.log(res)
                if (academicInfo.school_name) {
                  that.setData({
                    university: academicInfo.school_name
                  })
                } else {
                  that.setData({
                    university: '未登记'
                  })
                }

                if (academicInfo.major) {
                  that.setData({
                    discipline: academicInfo.major
                  })
                } else {
                  that.setData({
                    discipline: '未登记'
                  })
                }

                if (academicInfo.graduate_year) {
                  that.setData({
                    graduateYear: academicInfo.graduate_year
                  })
                } else {
                  that.setData({
                    graduateYear: '未登记'
                  })
                }

                if (academicInfo.exam_province) {
                  that.setData({
                    highSchoolAddress: academicInfo.exam_province
                  })
                } else {
                  that.setData({
                    highSchoolAddress: '未登记'
                  })
                }

                if (res.data.entities[0].profile.email_verified) {
                  that.setData({
                    emailFlag: true
                  })
                } else {
                  that.setData({
                    emailFlag: false
                  })
                }

                if (res.data.entities[0].points) {
                  that.setData({
                    rp: res.data.entities[0].points
                  })
                } else {
                  that.setData({
                    rp: "0"
                  })
                }

                if (res.data.entities[0].is_vip) {
                  that.setData({
                    expireDay: res.data.entities[0].vip_expire_day
                  })
                } else {
                  that.setData({
                    expireDay: false
                  })
                }

                // console.log(res.data)

                // 存储user唯一id
                wx.setStorage({
                  key: 'user_id',
                  data: res.data.entities[0].id,
                })

                //存储user邮箱
                wx.setStorage({
                  key: 'email',
                  data: res.data.entities[0].email,
                })

                
                requestUtil.getViewmycoursesUserInfo(res.data.entities[0].id, function(result){
                  wx.setStorage({
                    key: 'isEmailEdu',
                    data: res.data.entities[0].profile.is_email_edu,
                  })
                 
                })
                
              })
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