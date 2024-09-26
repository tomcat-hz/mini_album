import { E } from "../../types/types";
import { Toast } from "../../utils/util";

export interface FormBase {
  type: 'input' | 'textarea' | 'qrcode',
  value: string,
  cover: string,
  qrcode: string,
  title: string;
  desc: string;
  placeholder: string;
}

// components/common-form/common-form.ts
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    type: {
      type: String,
      value: 'input',
    },
    title: {
      type: String,
      value: ""
    },
    desc: {
      type: String,
      value: ""
    },
    placeholder: {
      type: String,
      value: ""
    },
    inputValue: {
      type: String,
      value: ""
    },
    url: {
      type: String,
      value: "",
      observer(newVal, _oldVal) {
        this.setData({
          cover: decodeURIComponent(newVal)
        })
      }
    },
    qrcode: {
      type: String,
      value: "",
      observer(newVal, _oldVal) {
        this.setData({
          innerQrcode: decodeURIComponent(newVal)
        })
      }
    },
    isPublic: {
      type: String,
      value: "N"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    innerInputValue: "",
    innerQrcode: "",
    innerIsPublic: 'N'
  },

  lifetimes: {
    ready() {
      this.setData({
        innerInputValue: this.properties.inputValue,
        innerIsPublic: this.properties.isPublic
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    clearTitle() {
      this.setData({
        innerInputValue: ""
      })
    },
    changeInput(e: E) {
      const { value } = e.detail;
      this.setData({  
        innerInputValue: value
      });
    },
    confirmInput() {
      this.triggerEvent("confirm", this.data.innerInputValue);
    },
    changeImage(e: E) {
      const { action } = e.currentTarget.dataset;
      switch(action) {
        case 'bg':
          Toast("背景中选择");
          break;
        case 'phone': 
          Toast("手机相册中选择");
          break;
        case 'qiji':
          Toast("奇迹相册中选择");
          break;
        case 'photo':
          Toast("拍一张中选择");
          break;
      }
      console.log("修改图片", e);
    },
    changeMember(e: E) {
      const { action } = e.currentTarget.dataset;
      switch(action) {
        case 'admin':
          Toast("转让管理员");
          break;
        case 'helper': 
          Toast("群管理员");
          break;
      }
    },
    clickSwitch() {
      this.setData({
        innerIsPublic: this.data.innerIsPublic === 'Y' ? 'N' : 'Y'
      });
      this.triggerEvent("confirm", this.data.innerIsPublic);
    }
  }
})