import { throttle } from "../../utils/util";

let _observer: WechatMiniprogram.IntersectionObserver;
/**
 * 底部loading
 */
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    isLoading: {
      type: Boolean,
      value: true
    },
    hasMore: {
      type: Boolean,
      value: true
    },
    safeAreaBottom: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  lifetimes: {
    ready() {
      _observer = wx.createIntersectionObserver(this)
      _observer.relativeToViewport({ top: 100 })
        .observe('.load-box', throttle((res: { intersectionRatio: number }) => {
          if (res.intersectionRatio && this.data.hasMore) {
            this.triggerEvent("loadMore");
          }
        }))
    },
    detached() {
      if (_observer) _observer.disconnect()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
  }
})