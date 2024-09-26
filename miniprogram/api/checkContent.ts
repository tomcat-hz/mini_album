import { BaseResponse } from '../types/types';
import request from '../utils/request';


/**
 * 是否包含敏感内容
 * @param content 校验文本
 */
export function sensitiveWord(content: string){
  return request<BaseResponse<boolean>>({
      url: 'common/sensitiveWord',
      method: "POST",
      data: {
        content
      }
  })
};