import { BaseResponse, CommentItem, CommentList, CommentPageReq, PageResp } from '../types/types';
import request from '../utils/request';

// 获取评论列表
export async function listComment(data: CommentPageReq) {  
  return request<PageResp<CommentList>>({  
    url: 'comment/list',  
    method: 'GET',
    data
  });
}

// 查询评论详情
export async function getComment(commentId: string) {  
  return request<BaseResponse<CommentItem>>({  
    url: `comment/${commentId}`,  
    method: 'GET',
  });
}

// 添加评论
export async function addComment(data: CommentItem) {  
  return request<BaseResponse<CommentItem>>({  
    url: 'comment',  
    method: 'POST',
    data
  });
}