import { AuthorizationForPost, AuthorizationResult, BaseResponse, CustomUserInfo, EditUserInfo, UploadFile } from '../types/types';  
import request from '../utils/request';  
  
// 获取token  
export async function login(code: string) {
  if (wx.getStorageSync("token")) Promise.resolve();
  return await request<BaseResponse<CustomUserInfo>>({  
    url: 'login',  
    data: {  
      code  
    }  
  }); 
}  

// 获取用户信息
export async function getWxUserInfo() {
  return request<BaseResponse<CustomUserInfo>>({  
    url: 'getInfo',
    method: 'GET'  
  });
}

// 修改用户信息
export async function editUserInfo(data: EditUserInfo) {  
  return request<BaseResponse<CustomUserInfo>>({  
    url: 'editInfo',  
    method: 'POST',
    data
  });
}

/**
 * @description 获取Authorization put上传 已废弃
 * @param file 文件
 */
export async function getAuthorizationPut(file: UploadFile) {
  const { ext, width, height, size } = file;
  const params = { ext, width, height, size };
  const queryString = Object.entries(params)
    .filter(([_key, value]) => value !== undefined && value !== null) // 过滤掉未定义的参数  
    .map(([key, value]) => `${key}=${value && encodeURIComponent(value.toString())}`) // 编码参数值并构建查询字符串片段  
    .join('&'); // 使用&连接查询字符串片段
  return request<BaseResponse<AuthorizationResult>>({  
    url: `getAuthorizationPut?${queryString}`, 
    method: 'GET',
  });
}

// 获取Authorization
export async function getAuthorizationPost(file: UploadFile) {
  const { ext, size, width, height, sha } = file;
  const params = { ext, contentLength: size, width, height, sha };
  return request<BaseResponse<AuthorizationForPost>>({  
    url: `getAuthorizationPost`, 
    method: 'GET',
    query: params
  });
}