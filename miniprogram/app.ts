import { getWxUserInfo } from './api/login';
import { AppType, CustomUserInfo } from './types/types';
import { tabbarHeight, toolHeight, toolTop, safeAreaBottom, toolRight, toolWidth, ratio, isPc } from "./utils/constants";
import globalDataManager from './utils/globalDataManager';

// app.ts
App<AppType>({
  globalData: {
    tabbarHeight,  // 底部tabbar高度
    toolTop, // 胶囊距离顶部高度
    toolHeight, // 胶囊高度
    safeAreaBottom, // 底部安全距离高度
    toolRight, // 胶囊距离右边距离
    toolWidth,  // 胶囊宽度
    isPc,
    ratio,
    tabIndex: 0
  },
  onLaunch() {
    if (wx.getStorageSync("token")) {
      getWxUserInfo().then((userInfo: CustomUserInfo) => {
        globalDataManager.setIsLogin(true);
        globalDataManager.setUserInfo(userInfo);
      })
    }
  }
})