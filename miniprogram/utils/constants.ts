const sysInfo = wx.getSystemInfoSync();

// 屏幕宽度
export const screenWidth = sysInfo.screenWidth;

// 屏幕高度
export const screenHeight = sysInfo.screenHeight;

// 界面自适应换算
export const ratio = 750 / screenWidth;

// 状态栏高度
export const statusBarHeight =  sysInfo.statusBarHeight * ratio;

// 胶囊距顶部高度
export const toolTop = wx.getMenuButtonBoundingClientRect().top * ratio;

// 胶囊距右边距离
export const toolRight = (screenWidth - wx.getMenuButtonBoundingClientRect().right) * ratio;

// 胶囊高度
export const toolHeight = wx.getMenuButtonBoundingClientRect().height * ratio;

// 胶囊宽度
export const toolWidth = wx.getMenuButtonBoundingClientRect().width * ratio;

// 底部安全区域高度
export const safeAreaBottom = sysInfo.safeArea ? (screenHeight - sysInfo.safeArea.bottom) * ratio : 0;

// 底部导航加安全区域高度
export const tabbarHeight = 112 + safeAreaBottom;

// 是否pc
export const isPc = ['mac', 'windows'].includes(sysInfo.platform);

// 上传结果
export enum FILE_UPLOAD_STATUS {
  FAILED = "failed",
  DONE = "done",
  LOADING = "loading",
  RELOAD = "reload",
}

// 方法值
export enum METHODS {
  POST = 'post',
  PUT = 'put',
  GET = 'get',
  DELETE = 'delete'
}

// 创建一个包含常见 COS 错误码和自定义错误信息的 Map  
export const cosErrorMap = new Map([  
  ['EntityTooLarge', '文件大小超过限制'],  
  ['NoSuchKey', '对象在存储桶中不存在'],  
  ['NoSuchBucket', '存储桶不存在'],  
  ['InvalidAccessKeyId', '无效的 AccessKeyId'],  
  ['SignatureDoesNotMatch', '签名不匹配'],  
  // 添加其他常见的 COS 错误码和对应的错误信息  
]);
  
export const CONTENT_TYPE_MAP = new Map([   
  ['jpg', "image/jpeg"], 
  ['jpeg', "image/jpeg"], 
  ['png', "image/png"],  
  ['gif', "image/gif"], 
  ['heif', "image/heif"],  
  ['heic', "image/heic"], 
  ['mp4', "video/mp4"],
  ['mov', "video/quicktime"]
]); 

// content-length和m换算
export const CONTENT_LEHGTH_1M = 1048576;