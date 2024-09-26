import { AppType } from "../../types/types"

/**
 * 上传按钮
 */
const app: AppType = getApp();
const animation = wx.createAnimation({  
  duration: 300,  
  timingFunction: 'ease',
});
const step = 80 / app.globalData.ratio;
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    hideUploadBtn: {
      type: Boolean,
      value: false,
      observer: function(newVal, _oldVal) {
        if (newVal) {
          animation.translateX(step).step(); // 假设动画是向上移动100px  
        } else {
          animation.translateX(0).step(); // 假设动画是回到原位  
        }
        this.setData({  
          animationData: animation.export(), // 更新动画数据  
        });
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    tabbarHeight: app.globalData.tabbarHeight,
    animationData: {}, // 用于存储动画数据的对象
  },

  lifetimes: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tapUpload() {
      this.triggerEvent("tapUpload");
    },
  }
})