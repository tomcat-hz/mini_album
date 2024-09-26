import { screenHeight, ratio, tabbarHeight, toolHeight, toolTop } from "../../utils/constants";

// components/virtual-scroll/virtual-scroll.ts
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    position: {
      type: Number,
      value: 0,
      observer(newVal, _) {
        console.log("当前位置", newVal);
        this.setIndex(newVal * ratio)
      }
    },
    items: {
      type: Array,
      value: Array.from({ length: 100 }, (_, i) => i + 1)
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    innerItems: [] as any[],
    showItems: [] as any[],
    startIndex: 0,  // 页面显示元素开始下标
    endIndex: 0,    // 页面显示元素结束下标
    preIndex: 0,    // 缓冲区域开始显示个数
    nextIndex: 0,    // 缓冲区域结束显示个数
    totalHeight: 0,
    innerPosition: 0
  },

  lifetimes: {
    attached() {
      this.init();
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    init() {
      // 内容总计高度
      const totalHeight = this.properties.items.length * 120;
      this.setData({
        totalHeight,
        innerItems: this.properties.items
      });
      this.setIndex(0);
    },
    setIndex(position: number) {
      const height = screenHeight * ratio - tabbarHeight * ratio  - toolHeight  - toolTop;
      let startIndex = Math.floor(position / 120);
      let preIndex = Math.max(startIndex - 3, 0);
      let endIndex = startIndex + Math.ceil(height / 120);
      let nextIndex = Math.min(endIndex + 3, this.properties.items.length - 1);
      console.log('startIndex', startIndex);
      console.log('preIndex', preIndex);
      console.log('endIndex', endIndex);
      console.log('nextIndex', nextIndex);
      if (endIndex === nextIndex) return;
      if (Math.abs(nextIndex - this.data.nextIndex) <= 3 && Math.abs(nextIndex - this.properties.items.length + 1) >= 3) return
      this.setData({
        preIndex,
        startIndex,
        endIndex,
        nextIndex,
        innerPosition: position,
        showItems: this.data.innerItems.slice(preIndex, nextIndex)
      });
    }
  }
})