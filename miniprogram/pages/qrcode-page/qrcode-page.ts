import { QrcodeBase } from "../../types/types";

// pages/qrcode-page/qrcode-page.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrcode: {} as QrcodeBase
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { type, title, desc, url, cover } = options;
    if (type && title && desc && url && cover) {
      this.setData({
        qrcode: { type: type === 'albumQrcode' ? 'albumQrcode' : 'userQrcode', title, desc, url, cover }
      });
    }
  },
})