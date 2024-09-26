import { CustomUserInfo } from "../types/types";  
import eventCenter from "./eventCenter";  
import { IS_LOGIN_CHANGE, IS_LOGINING_CHANGE, IS_USER_CHANGE, IS_EDIT_FILE_CHANGE, IS_EDIT_FILE_NUM_CHANGE } from "./eventName";

// 补充状态共享功能
class GlobalDataManager {
  private isLogin: boolean = false;  
  private userInfo: CustomUserInfo = {
    avatar: '',
    city: '', 
    country: '中国', 
    gender: 0, 
    language: 'zh_CN', 
    province: '',
    nickName: '',
    signature: '',
    token: '',
    usedSpace: 0,
    usedFileNum: 0,
    userLevel: {
      levelName: '普通用户',
      spaceSize: 1,
      fileNum: 10000,
      perSize: 30,
    }
  };
  private isEditFile: boolean = false;
  private choosedFileNum: number = 0;
  private isLogining: boolean = false;

  setIsLogin(isLogin: boolean) {  
    this.isLogin = isLogin;  
    eventCenter.$emit(IS_LOGIN_CHANGE, isLogin);
  }
  setIsLogining(isLogining: boolean) {  
    this.isLogining = isLogining;  
    eventCenter.$emit(IS_LOGINING_CHANGE, isLogining);
  }
  setUserInfo(userInfo: CustomUserInfo) {
    this.userInfo = userInfo;
    eventCenter.$emit(IS_USER_CHANGE, userInfo);
  }
  setIsEditFile(isEditFile: boolean) {  
    this.isEditFile = isEditFile;
    eventCenter.$emit(IS_EDIT_FILE_CHANGE, isEditFile);
  }
  setIsChoosedFileNumChange(choosedFileNum: number) {
    this.choosedFileNum = choosedFileNum;
    eventCenter.$emit(IS_EDIT_FILE_NUM_CHANGE, choosedFileNum);
  }
  getIsLogin(): boolean {  
    return this.isLogin;  
  }
  getIsLogining(): boolean {  
    return this.isLogining;
  }
  getUserInfo(): CustomUserInfo {  
    return this.userInfo;  
  }
  getIsEditFile(): boolean {  
    return this.isEditFile;  
  }
  getChoosedFileNum(): number {
    return this.choosedFileNum;
  }
}  

// 单例模式，确保全局只有一个实例  
const globalDataManager = new GlobalDataManager();  
export default globalDataManager;