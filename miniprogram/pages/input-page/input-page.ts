import { E, InputBase } from "../../types/types";

// pages/input-page/input-page.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    input: {} as InputBase
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { type = "", value = "", placeholder = "", title = "", desc = "", cover = "",  } = options;
    if (['input', 'textarea'].includes(type)) {
      this.setData({
        input: { type: type === 'input' ? 'input' : 'textarea', value, placeholder, title, desc, cover }
      })
    } else {
      console.log("type 类型有问题");
    }
  },
  submit(e: E) {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.emit("submit", e.detail)
  }
})