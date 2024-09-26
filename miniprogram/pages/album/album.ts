import { listAlbum } from "../../api/album";
import { UploadActionType, AlbumListItem, AppType } from "../../types/types";

const app: AppType = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageLoading: true,
    tabbarHeight: app.globalData.tabbarHeight,
    toolTop: app.globalData.toolTop,
    albums: [] as AlbumListItem[],
  },
  onLoad() {
    this.initData();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getTabBar().init();
  },
  async initData() {
    this.setData({
      pageLoading: true,
      albums: []
    })
    await this.loadData();
    this.setData({
      pageLoading: false
    })
  },
  async loadData() {
    try {
      const albums = await listAlbum(); 
      this.setData({  
        albums,
      });
    } catch (error) {  
      console.error("Error loading data:", error);  
    }  
  },

  createAlbum() {
    const that = this;
    wx.navigateTo({
      url: `/pages/upload/upload?action=${UploadActionType.createAlbum}`,
      events: {
        refresh() {
          that.initData();
        }
      }
    })
  },

  clickSearch() {
    wx.navigateTo({
      url: "/pages/search/search"
    })
  },

  allAlbum() {
    wx.navigateTo({
      url: "/pages/album-list/album-list"
    })
  },

  onShareAppMessage() {
    wx.getGroupEnterInfo({
      success(res: any) {
        // // res
        // {
        //   errMsg: 'getGroupEnterInfo:ok',
        //   encryptedData: '',
        //   iv: ''
        // }
      },
      fail() {
    
      }
    })
  }
})