import { E, FormBase } from "../../types/types"

// pages/choose-image-page/choose-image-page.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: [] as FormBase[],
    title: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      form: this.buildForm(),
      title: options.title
    })
  },

  buildForm(): FormBase[] {
    return [
      // {
      //   title: '选择背景图片',
      //   arrow: true,
      //   hide: false,
      //   type: 'defaultPhoto',
      //   url: ''
      // },
      {
        title: '从手机相册选择',
        arrow: true,
        hide: false,
        type: 'localAlbum',
        url: ''
      },
      // {
      //   title: '从奇迹相册选择',
      //   arrow: true,
      //   type: 'route',
      //   url: ''
      // },
      // {
      //   title: '拍一张',
      //   arrow: true,
      //   type: 'takePhoto',
      //   url: ''
      // }
    ];
  },

  submit(e: E) {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.emit("submit", e.detail)
  }
})