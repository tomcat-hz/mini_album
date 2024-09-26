import { AppType } from "../../types/types"
import { Toast } from "../../utils/util";

const app: AppType = getApp();
/**
 * 本地上传组件
 */
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    mode: {
      type: String,
      value: "card"
    },
    key: {
      type: String,
      value: "",
      observer(newVal: string, _oldVal) {
        if (newVal) {
          const base64 = wx.getStorageSync(newVal);
          this.setData({
            url: base64
          })
        }
      }
    },
    title: {
      type: String,
      value: ""
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    url: "",
    toolTop: app.globalData.toolTop,
    toolHeight: app.globalData.toolHeight,
    cardHeight: "400rpx"
  },

  /**
   * 组件的方法列表
   */
  methods: {
    localUpload() {
      const { key } = this.properties;
      const that = this;
      wx.chooseMedia({
        count: 1,
        mediaType: ['image'],
        sourceType: ['album'],
        maxDuration: 30,
        success(res) {
          const tempFilePath = res.tempFiles[0].tempFilePath;
          wx.setStorageSync(key, tempFilePath);
          that.setData({
            url: tempFilePath
          })
        },  
        fail(err) {  
          console.error('选择图片失败', err);  
        }  
      })
    },
    preview() {
      const { url } = this.data;
      wx.previewImage({
        current: url,
        urls: [url]
      })
    },
    removeKey() {
      if (!this.data.url) return;
      const that = this;
      wx.showModal({
        title: "温馨提示",
        content: `是否删除${this.properties.title}？`,
        success(res) {
          if (res.confirm) {
            wx.removeStorageSync(that.data.key);
            that.setData({url: ""});
            Toast('删除成功');
          }
        },
      });
    }
  }
})