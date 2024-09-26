import { MessageType } from "../../types/enums";
import { AppType, E } from "../../types/types";
import { Toast } from "../../utils/util";

// pages/message/message.ts
const app: AppType = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbarHeight: app.globalData.tabbarHeight,
    messageList: [
      {
        iconPath: "xitongtongzhi",
        title: "系统通知",
        type: MessageType.SYS_MESSAGE,
        count: 10
      },
      {
        iconPath: "xiaoxi1",
        title: "回复我的",
        type: MessageType.REPLY_MESSAGE,
        count: 10
      },
      {
        iconStyle: "width: 64rpx;height: 64rpx;font-size: 32rpx;line-height: 64rpx;background-color: #00adff;border-radius: 50%;color: #FFF;text-align: center;",
        iconName: "@",
        title: "@我的",
        type: MessageType.MESSAGE,
        count: 100
      },
      {
        iconPath: "dianzan",
        title: "关注我的",
        type: MessageType.FLLOW_MESSAGE,
        count: 10
      },
      {
        iconPath: "dianzan1",
        title: "收到的赞",
        type: MessageType.STAR_MESSAGE,
        count: 10
      }
    ],
    showReadAllDialog: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow() {
    this.getTabBar().init();
  },

  changeShowReadAllDialog() {
    this.setData({
      showReadAllDialog: !this.data.showReadAllDialog
    })
  },
  closeDialog() {
    this.setData({
      showReadAllDialog: false
    })
  },

  tapMessage(e: E) {
    switch(e.currentTarget.dataset.messageType) {
      case MessageType.SYS_MESSAGE:
        Toast("系统消息");
        break;
      case MessageType.FLLOW_MESSAGE:
        Toast("关注我");
        break;
      case MessageType.MESSAGE:
        Toast("@我");
        break;
      case MessageType.STAR_MESSAGE:
        Toast("点赞我");
        break;
      case MessageType.REPLY_MESSAGE:
        Toast("回复我的");
        break;
      default:
        Toast("不存在");
        break;
    }
  }
})