import { OptionBase } from "../../types/types"

// components/option-builder/option-builder.ts
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    input: {
      type: Object,
      value: {} as OptionBase[],
      observer(newVal, _oldVal) {
        if (newVal) {
          for(let i = 0; i < newVal.length; i++) {
            // todo解码url
          }
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})