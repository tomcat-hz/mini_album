// pages/search/search.ts

import { listStory } from "../../api/storys";
import { E, PageData, StoryItem } from "../../types/types";
import { Toast } from "../../utils/util";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showHotWordDialog: false,
    historyWord: [
      "hello world",
      "java",
      "html",
      "css",
      "vue",
      "小程序",
      "阿里云服务器",
      "腾讯云服务器"
    ],
    total: 0,
    queryParams: {
      pageNum: 1,
      pageSize: 10
    }
  },

  clearHistory() {
    this.setData({
      showHotWordDialog: true
    })
    // this.setData({
    //   historyWord: []
    // })
  },

  closeDialog() {
    this.setData({
      showHotWordDialog: false,
      historyWord: []
    })
  },

  async search(e: E) {
    if (e.detail) {
      const res: PageData<StoryItem> = await listStory({ content: e.detail, ...this.data.queryParams });
    } else {
      Toast("请输入查找内容");
    }
  },

  back() {
    wx.switchTab({
      url: "/pages/album/album"
    })
  }
})