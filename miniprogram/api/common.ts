import { BaseResponse } from '../types/types';
import request from '../utils/request';

// 校验文本
export async function checkWord(content: string) {  
  return request<BaseResponse<string>>({  
    url: 'common/checkWord',  
    method: 'POST',
    data: {
      content
    }
  });
}

// 校验图片
export async function checkMedia(url: string) {  
  return request<BaseResponse<string>>({  
    url: 'common/checkMedia',  
    method: 'POST',
    data: {
      url
    }
  });
}