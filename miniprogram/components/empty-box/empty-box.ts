/**
 * 空状态组件
 */
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    url: {
      type: String,
      value: "photos.png"
    },
    top: {
      type: String,
      value: "0rpx"
    },
    showAdd: {
      type: Boolean,
      value: true,
    },
    message: {
      type: String,
      value: "需要修改提示",
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