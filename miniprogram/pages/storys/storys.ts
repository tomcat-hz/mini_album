import { getAlbumSetting, joinAlbum } from "../../api/album";
import { listStory } from "../../api/storys";
import { AlbumType, AlbumUserType } from "../../types/enums";
import { UploadActionType, AlbumSetting, AppType, E, PageData, StoryItem, SwitchBase } from "../../types/types";
import { throttle, Toast } from "../../utils/util";

const app: AppType = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    AlbumType: AlbumType,
    AlbumUserType: AlbumUserType,
    pageLoading: true,
    toolTop: app.globalData.toolTop,
    toolHeight: app.globalData.toolHeight,
    safeAreaBottom: app.globalData.safeAreaBottom,
    albumId: "",
    albumType: "",
    albumName: "",
    albumSetting: {} as AlbumSetting,
    storyList: [] as StoryItem[],
    first: 1,
    showComment: false,
    showNotice: true,
    isLoading: false,
    total: 0,
    queryParams: {
      pageNum: 1,
      pageSize: 10,
    },
    marquee1: {
      speed: 40,
      loop: -1,
      delay: 0,
    },
    showNoticeDialog: false,
    iconSelect: [false, false],
    storyId: "",
    commentId: "",
    content: "",
    hideUploadBtn: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { albumId, albumName, albumType, albumUserType } = options;
    this.setData({
      albumId,
      albumType,
      albumName: albumName && decodeURIComponent(albumName)
    })
    if (albumId && albumName) {
      if (albumType !== "0" && albumUserType === '') {
        joinAlbum(this.data.albumId).then(() => {
          this.initData();
        })
      } else {
        this.initData();
      }
    } else {
      Toast("参数错误");
    }
  },
  async initData() {
    this.setData({
      pageLoading: true,
      storyList: [],
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      }
    });

    // 获取相册信息
    getAlbumSetting(this.data.albumId).then((res: AlbumSetting) => {
      this.setData({
        albumSetting: res
      })
    });
    
    // 获取动态列表
    await this.loadData();
    this.setData({
      pageLoading: false
    })
  },
  async loadData() {
    if (this.data.isLoading) return;
    this.setData({
      isLoading: true
    })
    const { albumId } = this.data;
    const res: PageData<StoryItem> = await listStory({ albumId, ...this.data.queryParams });
    const { total, rows } = res;
    const storyList = rows.map((story: StoryItem)=> {
      return story;
    })
    this.setData({
      isLoading: false,
      total,
      storyList: [...this.data.storyList, ...storyList]
    });
  },

  loadMore() {
    if (this.data.storyList.length === this.data.total) return;
    this.setData({
      [`queryParams.pageNum`]: this.data.queryParams.pageNum + 1
    })
    this.loadData();
  },
  
  setting() {
    const that = this;
    const { albumId } = this.data;
    const eventChannel = this.getOpenerEventChannel();
    wx.navigateTo({
      url: `/pages/settings/settings?albumId=${albumId}`,
      events: {
        albumCover(albumCover: string) {
          eventChannel.emit('albumCover', albumCover);
        },
        albumName(albumName: string) {
          eventChannel.emit('albumName', albumName);
        },
        switch(switchBase: SwitchBase) {
          that.setData({
            [`albumSetting.${switchBase.field}`]: switchBase.value
          });
        }
      }
    })
  },
  goSettings() {
    wx.navigateTo({
      url: `/pages/settings/settings?albumId=${this.data.albumId}`
    })
  },
  createStory() {
    const that = this;
    this.setData({
      hideUploadBtn: false
    });
    wx.navigateTo({
      url: `/pages/upload/upload?action=${UploadActionType.createStory}&albumId=${this.data.albumId}`,
      events: {
        refresh() {
          that.initData();
        }
      }
    })
  },
  // 绑定到scroll-view的bindscroll事件  
  handleScroll: throttle(function(e: E) {
    const scrollTop = e.detail.scrollTop;
    if (this.data.hideUploadBtn) return;
    this.setData({
      hideUploadBtn: true,
      lastScrollTop: scrollTop
    })
  }, 300),
  showNoticeDialog() {
    this.setData({
      showNoticeDialog: !this.data.showNoticeDialog
    })
  }
})