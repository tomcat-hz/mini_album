import { AppType } from "../../types/types";

const app: AppType = getApp();
const totalLine = 4;
const coefficient = 2.5; // 字符系数,英文、汉字、表情包所占宽度不一样,显示的字数也可能不一样;
const contentHeight = 48 * totalLine / app.globalData.ratio;
const chinesePerLine = 22; // 汉字占一行显示字数
const maxLength = chinesePerLine * totalLine * coefficient;

/**
 * 动态内容展示组件
 */
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    content: {
      type: String,
      value: 'hello world'
    },
    tips: {
      type: Array,
      value: ['阅读全文', '收起']
    },
    fullText: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showPreview: true,
    hasFullText: false,
    selectorId: "",
  },

  lifetimes: {
    ready() {
      // 通过文本数量判断是否超过4行显示区域
      if (this.properties.content.length > maxLength) {
        this.setData({
          showPreview: true,
          hasFullText: true,
        })
      } else {
        // 无法通过字数判断是否显示全部,通过dom高度计算是否超出4行(需要展示全文才能通过dom计算);
        this.setData({
          showPreview: false
        })
        wx.createSelectorQuery().in(this).selectAll(".full-text").boundingClientRect((res: any) => {
          if (res[0] && res[0].height > Math.ceil(contentHeight)) {
            this.setData({
              showPreview: true,
              hasFullText: true,
              fullHeight: res[0].height
            })
          } else {
            this.setData({
              showPreview: false,
              hasFullText: false,
            })
          }
        }).exec();
      }
    }
  },

  pageLifetimes: {
    show() {
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changePreview() {
      const showPreview = !this.data.showPreview;
      this.setData({
        showPreview
      });
    }
  }
})