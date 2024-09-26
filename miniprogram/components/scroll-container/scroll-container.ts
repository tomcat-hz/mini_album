import { AppType, E } from "../../types/types"

const app: AppType = getApp();
/**
 * 滚动container封装
 */
Component({
  options: {
    multipleSlots: true,
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    // 如果有tabbar的话需要减去tabbar高度
    hasTabbar: {
      type: Boolean,
      value: false
    },
    // 头部高度
    headerHeight: {
      type: Number,
      value: 0
    },
    loading: {
      type: Boolean,
      value: false
    },
    isEmpty: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    tabbarHeight: app.globalData.tabbarHeight,
    enable: false,
    loadingProps: {
      size: '50rpx',
    },
    refreshing: false,
  },

  lifetimes: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleScroll(e: E) {
      this.triggerEvent("scroll", e);
    },
    loadMore() {
      this.triggerEvent("loadMore");
    },
    onRefresh() {
      this.setData({
        refreshing: true
      })
      this.triggerEvent("refresh");
    },
  }
})