import request from '../utils/request';
import { BaseResponse, CreateStory, PageResp, StoryItem, StoryPageReq } from '../types/types';

// 创建相册
export function addStory(params: CreateStory){
  const { albumId, content, fileIds } = params;
  const data = {  
    albumId,  
    content,  
    fileIds
  };
  return request<BaseResponse<null>>({
      url: 'story',
      method: "POST",
      data
  })
};

// 获取动态列表
export function listStory(data: StoryPageReq){
  return request<PageResp<StoryItem>>({
      url: 'story/list',
      method: "GET",
      data
  })
};

// 获取动态详情
export function getStoryInfo(storyId: string) {
  return request<BaseResponse<StoryItem>>({
      url: `story/${storyId}`,
      method: "GET",
  })
}