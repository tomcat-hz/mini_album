import { QrcodeBase } from "../../types/types";

// components/qrcode-builder/qrcode-builder.ts
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    qrcode: {
      type: Object,
      value: {} as QrcodeBase,
      observer(newVal, _oldVal) {
        this.setData({
          cover: decodeURIComponent(newVal.cover),
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    cover: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})