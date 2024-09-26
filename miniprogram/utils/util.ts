import { cdnUrl } from "../env"
import { AlbumUserType } from "../types/enums"
import { InputBase, QrcodeBase } from "../types/types"

// 时间格式化
export const formatTime = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return (
    [year, month, day].map(formatNumber).join('/') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  )
}

// 数字格式化
const formatNumber = (n: number) => {
  const s = n.toString()
  return s[1] ? s : '0' + s
}

// 单位格式化
export const formatUnit = (n: number) => {
  const result = { total: n, unit: '个' };
  if (n > 1000 && n < 10000) {
    return { total: n / 1000, unit: '千'};
  }
  if (n >= 10000) {
    return { total: n / 10000, unit: '万'};
  }
  return result;
}

// 生成唯一id
export function generateUniqueId() {  
  let date = new Date().getTime();  
  let random = Math.random().toString(36).substring(7);  
  return date + '_' + random;  
}

// 多久以前
export function timeAgo(date: string | Date) {
  if(typeof date === "string") date = new Date(date);  
  const now = new Date().getTime(); 
  const secondsAgo = Math.floor((now - date.getTime()) / 1000);
  const minutesAgo = Math.floor(secondsAgo / 60);  
  const hoursAgo = Math.floor(minutesAgo / 60);  
  const daysAgo = Math.floor(hoursAgo / 24);  

  if (daysAgo > 0) {  
      return `${daysAgo}天前`;  
  } else if (hoursAgo > 0) {  
      return `${hoursAgo}小时前`;  
  } else if (minutesAgo > 0) {  
      return `${minutesAgo}分钟前`;  
  } else {  
      // return `${secondsAgo}秒前`;  
      return "刚刚"
  }  
}

// 防抖函数
export function debounce(func: Function, timeout = 300){
  let timer: number | null = null;
  return () => {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      //@ts-ignore
      func.apply(this);
    }, timeout);
  }
}

// 节流函数
export function throttle(func: Function, delay = 300) {  
  let lastCall = 0;  
  return function(...args: any[]) {  
    const now = new Date().getTime();  
    if (now - lastCall < delay) {  
      return;  
    }  
    lastCall = now;
    //@ts-ignore
    return func.apply(this, args);
  };  
}


// 获取cosKey
export function getCosKey(url: string) {
  return url.replace(cdnUrl, "").split("?")[0];
}

// 是否为空
export function isEmptyObject(obj: any) {  
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object;  
} 

// 解析腾讯云cos上传之后的xml结果
export function parseXMLError(xmlStr: string) {  
  const errorCodeMatch = xmlStr.match(/<Code>([^<]+)<\/Code>/);  
  const errorMessageMatch = xmlStr.match(/<Message>([^<]+)<\/Message>/);  
    
  if (errorCodeMatch && errorMessageMatch) {  
    return {  
      code: errorCodeMatch[1],  
      message: errorMessageMatch[1]  
    };  
  }  
  return {
    code: "",
    message: ""
  };  
}

// 空值判断
export function isEmptyObjectString(obj: {}) {  
  try {  
      return obj && Object.keys(obj).length === 0 && obj.constructor === Object;  
  } catch (e) {  
      // 如果解析失败，说明不是有效的JSON  
      return false;  
  }  
}

/**
 * 通用消息提示
 * @param title 消息提示
 * @param duration 过渡时间
 * @param icon 图标
 */
export function Toast(
  title: string,
  duration = 3000,
  icon: "none" | "success" | "error" | "loading" | undefined = "none"
) {
  return new Promise((reslove)=> {
    wx.showToast({
      title,
      icon,
      duration
    });
    setTimeout(reslove, duration);
  });
}

/**
 * 构建input
 */
export function buildInputParams(inputBase: InputBase) {
  const { type, title, desc, placeholder, value, cover = '' } = inputBase;
  let url = "";
  if (type === 'input') {
    url = `type=${type}&title=${title}&desc=${desc}&placeholder=${placeholder}&value=${value}&cover=${encodeURIComponent(cover)}`;
  } else if(type === 'textarea') { 
    url = `type=${type}&title=${title}&desc=${desc}&placeholder=${placeholder}&value=${value}`;
  }
  return url;
}

/**
 * 构建二维码
 */
export function buildQrcodeParams(qrcodeBase: QrcodeBase) {
  const { type, title, cover, desc, url } = qrcodeBase;
  return `type=${type}&title=${title}&desc=${desc}&cover=${encodeURIComponent(cover)}&url=${url}`
}

/**
 * 获取用户角色字符串
 */
export function getRole(albumUserType: AlbumUserType) {
  if (albumUserType === AlbumUserType.ADMIN) return '创建者'
  else if (albumUserType === AlbumUserType.HELPER) return '相册管理员'
  else if (albumUserType === AlbumUserType.MEMBER) return '普通成员'
  else return '其它'
}

/**
 * 是否管理员或者创建者
 */
export function isAdminOrhelper(albumUserType: AlbumUserType) {
  return [AlbumUserType.ADMIN, AlbumUserType.HELPER].includes(albumUserType);
}

/**
 * 是否管理员
 */
export function isAdmin(albumUserType: AlbumUserType) {
  return albumUserType === AlbumUserType.ADMIN;
}