import { getUsedResource } from "../../api/file";
import { AppType, E, ResourceResp } from "../../types/types";
import { CONTENT_LEHGTH_1M } from "../../utils/constants";
import globalDataManager from "../../utils/globalDataManager";
import { formatUnit } from "../../utils/util";

const app: AppType = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: app.globalData.userInfo,
    tabbarHeight: app.globalData.tabbarHeight,
    cardList: [
      {
        title: '空间',
        used: 0,
        usedUnit: 'M',
        total: 1,
        unit: 'G',
        color: '#FFA200',
        percentage: 0
      },
      {
        title: '数量',
        used: 0,
        usedUnit: '个',
        total: 8,
        unit: '万',
        color: '#471DE0',
        percentage: 0
      }
    ],
    setList: [
      // {
      //   iconPath: 'daVrenzheng',
      //   title: '我的证件',
      //   pagePath: `/pages/myCard/myCard`
      // },
      // {
      //   iconPath: 'jianliku',
      //   title: '我的简历',
      //   pagePath: `/pages/myJob/myJob`
      // },
      // {
      //   iconPath: 'shoucang',
      //   title: '我的收藏',
      //   pagePath: `/pages/like/like`
      // },
      // {
      //   iconPath: 'huishou',
      //   title: '回收站',
      //   pagePath: `/pages/reback/reback`
      // },
      // {
      //   iconPath: 'tubiao-zhexiantu',
      //   title: '历史数据',
      //   pagePath: `/pages/history/history`
      // }
    ],
    showVipDialog: false
  },

  onLoad() {
  },

  onShow() {
    this.getTabBar().init();
    const { spaceSize, fileNum } = globalDataManager.getUserInfo().userLevel;
    let { usedFileNum, usedSpace } = globalDataManager.getUserInfo();
    getUsedResource().then((res: ResourceResp) => {
      usedFileNum = res.usedFileNum;
      // contentLength转化为m
      usedSpace = Number((res.usedSpace / CONTENT_LEHGTH_1M).toFixed(1));
      this.setData({
        cardList: [
          {
            title: '空间',
            used: usedSpace,
            usedUnit: 'M',
            total: spaceSize,
            unit: 'G',
            color: '#FFA200',
            percentage: usedSpace /  (spaceSize * 1024) * 100
          },
          {
            title: '数量',
            used: usedFileNum,
            usedUnit: '个',
            total: formatUnit(fileNum).total,
            unit: formatUnit(fileNum).unit,
            percentage: usedFileNum / fileNum * 100,
            color: '#471DE0'
          }]
      });
    })
  },

  clickSetList(e: E) {
    const {page} = e.currentTarget.dataset;
    wx.navigateTo({
      url: page
    })
  },
  clickVip() {
    // wx.navigateTo({
    //   url: "/pages/vip/vip"
    // })
    this.setData({
      showVipDialog: true
    })
  },
  closeDialog() {
    this.setData({
      showVipDialog: false
    })
  }
})