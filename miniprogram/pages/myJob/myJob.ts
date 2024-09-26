import { E } from "../../types/types"

// pages/myJob/myJob.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  removeJob(e: E) {
    wx.removeStorage(e.currentTarget.dataset.key);
  }
})