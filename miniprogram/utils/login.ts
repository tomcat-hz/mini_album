import { login } from '../api/login';
import globalDataManager from './globalDataManager';
import { CustomUserInfo } from '../types/types';
import eventCenter from './eventCenter';
import { IS_LOGINING_CHANGE } from './eventName';

// 登录请求
export async function wxLogin() {
  return new Promise<number>((resolve, reject) => {
    if (globalDataManager.getIsLogining()) {
      eventCenter.$on(IS_LOGINING_CHANGE, () => {
        resolve(200);
      })
    } else {
      globalDataManager.setIsLogining(true);
      wx.login({
        success: (res) => {
          const {code} = res;
          if (!code)  console.log('获取jscode失败' + res.errMsg);
          login(code).then((res: CustomUserInfo)=> {
            wx.setStorageSync("token", res.token);
            globalDataManager.setIsLogin(true);
            globalDataManager.setUserInfo(res);
            globalDataManager.setIsLogining(false);
            resolve(200);
          })
        },
        fail: (error) => {
          console.log('登录失败', error);
          globalDataManager.setIsLogining(false);
          reject(500)
        }
      })
    }
  })
}