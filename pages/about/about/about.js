import * as Net from "../../../utils/net";
import * as API from "../../../utils/api";

const app = getApp();
Component({
    options: {
        addGlobalClass: true,
    },
    data: {
        StatusBar: app.globalData.StatusBar,
        CustomBar: app.globalData.CustomBar,
        ColorList: app.globalData.ColorList,
        dataDetail: ''
    },
    methods: {
        onLoad: function () {
            this.getDetail()
        },
        pageBack() {
            wx.navigateBack({
                delta: 1
            });
        },
        getDetail() {
            const that = this
            Net.request({
                url: API.GetAboutCid(),
                success: function (res) {
                    let data = res.data.data
                    if (API.IsNull(data)) {
                        that.getdetails(data)
                    }
                }
            })
        },

        getdetails(cid) {
            var that = this;
            Net.request({
                url: API.GetPostsbyCID(cid),
                success: function (res) {
                    var datas = res.data.data;
                  let result = app.towxml(datas[0].text, 'markdown', {
                    // base: parsed_item.text,				// 相对资源的base路径
                    // theme: 'dark',					// 主题，默认`light`
                    events: {					// 为元素绑定的事件方法
                      tap: (e) => {
                        console.log('tap', e);
                      }
                    }
                  });
                    that.setData({
                        dataDetail: result,
                    })
                }
            })
        },
    }

});
