import { BaseResponse, LikeOrFavoritesReq } from '../types/types';
import request from '../utils/request';

/**
 * 
 */
export async function tap(data: LikeOrFavoritesReq) {  
  return request<BaseResponse>({  
    url: 'tap',  
    method: 'POST',
    data
  });
}