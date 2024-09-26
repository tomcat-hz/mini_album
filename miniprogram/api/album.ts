import request from '../utils/request'
import { AlbumSetting, AlbumListItem, BaseResponse, CreateAlbumReq, AlbumSettingReq } from '../types/types'

// 创建相册
export function addAlbum(data: CreateAlbumReq){
  return request<void>({
      url: 'album',
      method: "POST",
      data
  })
};

// 获取相册列表
export function listAlbum(){
  return request<BaseResponse<AlbumListItem[]>>({
        url: 'album/list',
        method: "GET",
    });
};

// 获取相册详情
export function getAlbumInfo(albumId: string) {
  return request<BaseResponse<AlbumSetting>>({
    url: `album/${albumId}`,
    method: "GET",
  });
}

// 获取相册设置
export function getAlbumSetting(albumId: string) {
  return request<BaseResponse<AlbumSetting>>({
    url: `album/setting/${albumId}`,
    method: "GET",
  });
}

// 改变相册配置
export function editAlbumSetting(albumSettingReq: AlbumSettingReq) {
  return request<BaseResponse<AlbumSetting>>({
    url: `album/config`,
    method: "POST",
    data: {
      ...albumSettingReq
    }
  });
}

/**
 * @description 加入相册
 * @param albumId 相册id
 */
export function joinAlbum(albumId: string) {
  return request<BaseResponse<null>>({
    url: `album/join`,
    method: "POST",
    data: {
      albumId
    }
  });
}

/**
 * @description 退出相册
 * @param albumId 相册id
 */
export function leaveAlbum(albumId: string) {
  return request<BaseResponse<null>>({
    url: `album/leave`,
    method: "POST",
    data: {
      albumId
    }
  });
}

/**
 * @description 解散相册
 * @param albumId 相册id
 */
export function closeAlbum(albumId: string) {
  return request<BaseResponse<null>>({
    url: `album/close`,
    method: "POST",
    data: {
      albumId
    }
  });
}