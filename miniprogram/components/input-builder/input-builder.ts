import { E, InputBase } from "../../types/types";

// components/input-builder/input-builder.ts
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    input: {
      type: Object,
      value: {} as InputBase,
      observer(newVal, _oldVal) {
        console.log("input值", newVal);
        if (newVal.cover) {
          this.setData({
            cover: decodeURIComponent(newVal.cover),
            innerValue: newVal.value
          })
        } else {
          this.setData({
            innerValue: newVal.value
          })
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    cover: "",
    innerValue: "",
    disabled: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    confirm() {
      this.triggerEvent("submit", this.data.innerValue);
    },
    change(e: E) {
      const { value } = e.detail;
      this.setData({  
        innerValue: value,
        disabled: !this._isChange(value) || this._isEmpty(value)
      });
    },
    clear() {
      this.setData({
        innerValue: ""
      })
    },
    _isChange(value: string) {
      return value !== this.data.innerValue;
    },
    _isEmpty(value: string) {
      return !value;
    }
  }
})