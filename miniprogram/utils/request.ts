import baseUrl from '../env';
import { BaseResponse } from '../types/types';
import { wxLogin } from './login';
import { isEmptyObjectString, Toast } from './util';

/**
 * 封装request请求
 * @param params url: 接口地址、method: 请求方式、data: post请求数据、query: get拼接参数
 */
const request = <T>(params: { url?: string, method?: 'POST' | 'GET' | 'DELETE' | 'PUT', data?: any, contentType?: string, query?: {[key:string]: any}}):any => {
  const {
    url,
    method = "POST",
    data = {},
    query = {},
    contentType = "application/json",
  } = params;
  const token = wx.getStorageSync("token") || "";
  let queryString = "";
  if (!isEmptyObjectString(query)) {
    queryString = Object.entries(query)
    .filter(([_key, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${key}=${value && encodeURIComponent(value.toString())}`)  
    .join('&');
    queryString = "?" + queryString;
  }
  return new Promise(function (resolve, reject) {
    wx.request({
      url: `${baseUrl}/mini/${url}${queryString}`,
      data,
      method,
      header: {
        "Content-Type": contentType,
        Authorization: token,
      },
      success: function (res: { data: BaseResponse<T> }) {
        switch (res.data.code) {
          case 200:
            resolve(res.data.data);  
            break;
          case 400:
            Toast(res.data.msg);
            break;
          case 401:
            wx.removeStorageSync("token");
            wxLogin().then(() => {
              resolve(request(params));
            });
            break;
          case 402:
            Toast("该用户账号被冻结");
            break;
          case 403:
            wx.showModal({
              title: "温馨提示",
              content: "权限不足",
              success() {},
            });
            break;
          case 500:
            Toast(res.data.msg || '服务异常，请稍后再试');
            break;
          default:
            Toast(res.data.msg);
            resolve(res.data);
            break;
        }
      },
      fail: function (err: any) {
        Toast("网络错误");
        reject(err);
      },
    });
  });
};

export default request;