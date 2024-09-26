import { AppType, E } from "../../types/types";
import { Toast } from "../../utils/util";

const app:AppType = getApp();
// pages/tool/tool.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbarHeight: app.globalData.tabbarHeight,
    toolTop: app.globalData.toolTop,
    toolHeight: app.globalData.toolHeight,
    tools: [
      {
        title: "消息中心",
        items: [
          {
            name: '系统消息',
            badge: { count: '99+' },
            icon: 'https://tdesign.gtimg.com/mobile/demos/example1.png'
          },
          {
            name: '回复我的',
            badge: { count: '99' },
            icon: 'https://tdesign.gtimg.com/mobile/demos/example1.png'
          },
          {
            name: '@我的',
            badge: { count: '99' },
            icon: 'https://tdesign.gtimg.com/mobile/demos/example1.png'
          },
          {
            name: '收到的赞',
            badge: { count: '99' },
            icon: 'https://tdesign.gtimg.com/mobile/demos/example1.png'
          }
        ]
      },
      {
        title: "相册工具",
        items: [
          {
            name: '奇迹排名',
            badge: { count: 'hot' },
            icon: 'https://tdesign.gtimg.com/mobile/demos/example1.png'
          },
          {
            name: '时刻记录',
            badge: { count: 'hot' },
            icon: 'https://tdesign.gtimg.com/mobile/demos/example1.png'
          },
          {
            name: '文生图',
            icon: 'https://tdesign.gtimg.com/mobile/demos/example1.png'
          },
          {
            name: '图生图',
            icon: 'https://tdesign.gtimg.com/mobile/demos/example1.png'
          },
          {
            name: '证件照',
            icon: 'https://tdesign.gtimg.com/mobile/demos/example1.png'
          },
          {
            name: '照片修复',
            icon: 'https://tdesign.gtimg.com/mobile/demos/example1.png'
          },
          {
            name: '海报传单',
            icon: 'https://tdesign.gtimg.com/mobile/demos/example1.png'
          },
          {
            name: '简历生成',
            icon: 'https://tdesign.gtimg.com/mobile/demos/example1.png'
          },
        ]
      },
      {
        title: "红包活动",
        items: [
          {
            name: '饿了么优惠',
            badge: { count: '红包' },
            icon: 'https://tdesign.gtimg.com/mobile/demos/example1.png'
          },
          {
            name: '美团优惠',
            badge: { count: '红包' },
            icon: '../../../pages/tool/images/meituan.png'
          },
        ]
      }
    ]
  },

  onShow() {
    this.getTabBar().init();
  },

  clickTool(e: E) {
    console.log(e);
    Toast(`点击了${e.currentTarget.dataset.tool.name}`)
  }
})