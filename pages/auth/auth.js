import * as Net from "../../utils/net";
import * as API from "../../utils/api";

const app = getApp();
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    ColorList: app.globalData.ColorList,
  },
  onGetUserInfo: function (e) {
    if (!this.logged && e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo;
      wx.login({
        success: function (res) {
          if (res.code) {
            app.globalData.userInfo.code = res.code;
            Net.request({
              url: API.Login(app.globalData.userInfo),
              success: function (res) {
                var datas = res.data.data;
                app.globalData.userInfo.openid = datas;
                wx.setStorageSync('userInfo', app.globalData)
                //返回上一页
                wx.navigateBack();
              }
            })
          } else {
            wx.showToast({
              title: `授权失败,${res.errMsg}`
            })
          }
        }
      })
    }
  }
});
