import { BaseResponse, FilePageReq, FilePageResp, PageResp, ResourceResp } from '../types/types';
import request from '../utils/request';

/**  
 * 列出文件  
 * @param pageNum 页码  
 * @param pageSize 每页大小  
 * @param fileType 文件类型（"1" 为图片，"2" 为视频，"3" 为文档，空字符串为查询所有）  
 * @returns 请求响应  
 */  
export async function listFile(data: FilePageReq) {
  return request<PageResp<FilePageResp[]>>({  
    url: 'file/list',  
    method: 'GET',  
    data
  });
}

export async function batchDeleteFile(fileIds: string[]) {
  return request<BaseResponse>({  
    url: `file/${fileIds}`,  
    method: 'DELETE',  
  });
}

export function getUsedResource() {
  return request<ResourceResp>({  
    url: 'file/getUsedResource',
    method: 'GET',  
  });
}

export function getUrlByFileId(fileId: number) {
  return request<BaseResponse<{ url: number}>>({  
    url: `file/getUrlByFileId/${fileId}`,
    method: 'GET',  
  });
}