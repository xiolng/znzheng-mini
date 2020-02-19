import * as API from "../../utils/api";
import Net from '../../utils/net'

Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  created () {
    this.fetchposts();
    this.fetchallcats();
  },

  data: {
    postslist: [],
    swipelist: [],
    topswiper: 'none',
    midposts: 'none',
    allcatslist: [],
    allcatpostlist: [],
    current_cat: 0,
    current_position: 'mid_99999999',
    postheight: '0',
    iconList: ['btn', 'evaluate_fill', 'group_fill', 'global', 'github', 'usefullfill']
  },
  methods: {
    fetchposts () {
      var that = this;
      Net.request({
        url: API.GetSwiperPost(),
        success: function (res) {
          var datas = res.data.data;
          if (API.IsNull(datas)) {
            that.setData({
              topswiper: 'block',
              swipelist: datas.map(function (ori_item) {
                var item = API.ParseItem(ori_item);
                return item;
              })
            })
          }
        }
      })
    },
    touchmove (e) {
    },
    fetchallcats () {
      var that = this;
      Net.request({
        url: API.GetCat(),
        success: function (res) {
          var datas = res.data.data;
          that.data.allcatslist = datas.map(function (item) {
            item.id_tag = "mid_" + item.mid;
            return item;
          });
          that.data.allcatpostlist = datas.map(function (item) {
            return null;
          });
          if (that.data.allcatslist.length > 0) {
            that.changeCatex(that.data.allcatslist[ 0 ].mid);
          }
          that.setData({
            allcatslist: that.data.allcatslist
          })
        }
      })
    },
    fetchpostbymid (mid) {
      var that = this;
      var idx = this.getmidindex(mid);
      Net.request({
        url: API.GetPostsbyMID(mid),
        success: function (res) {
          var datas = res.data.data;
          if (datas != null && datas != undefined) {
            that.data.allcatpostlist[ idx ] = datas.map(function (item) {
              item.posttime = API.getcreatedtime(item.created);
              return item;
            });
            console.log(that.data.allcatpostlist);
            that.setData({
              allcatpostlist: that.data.allcatpostlist,
              postheight: that.data.allcatpostlist[ idx ].length * 512 + 'rpx'
            })
          } else {
            wx.showToast({
              title: '该分类没有文章',
              image: '../../resources/error1.png',
              duration: 2000
            })
          }
        }
      })
    },
    getmidindex (mid) {
      for (var i = 0; i < this.data.allcatslist.length; i++)
        if (mid == this.data.allcatslist[ i ].mid) {
          return i;
        }
    },
    change_finish (e) {
      var that = this;
      if (e.detail.current != this.data.current_cat) {
        this.changeCatex(this.data.allcatslist[ e.detail.current ].mid);
        this.setData({
          current_cat: e.detail.current,
          current_position: that.data.allcatslist[ e.detail.current ].id_tag
        })

      }
    },
    changeCat (e) {
      this.data.current_cat_mid = e.target.dataset.mid;
      var idx = this.getmidindex(this.data.current_cat_mid);
      if (idx != this.data.current_cat) {
        this.setData({
          current_cat: idx
        })
        this.changeCatex(this.data.current_cat_mid);
      }
    },
    changeCatex (mid) {
      this.setData({
        catpostlist: []
      })
      this.data.allcatslist = this.data.allcatslist.map(function (item) {
        if (item.mid == mid)
          item.active = true;
        else
          item.active = false;
        return item;
      })
      this.setData({
        allcatslist: this.data.allcatslist
      })
      this.fetchpostbymid(mid);
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh () {
      wx.stopPullDownRefresh();
      this.setData({
        swipelist: [],
        postslist: [],
        midposts: 'none',
        topswiper: 'none',
        current_cat: 0,
        current_position: 'mid_99999999'
      })
      this.fetchposts();
      this.fetchallcats();
    },
  }
})
