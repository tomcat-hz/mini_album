// components/common-dialog/common-dialog.ts
Component({
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    visible: {
      type: Boolean,
      value: false
    },
    title: {
      type: String,
      value: ""
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
    confirm() {
      this.triggerEvent("confirm");
    },
    cancel() {
      this.triggerEvent("cancel");
    }
  }
})