import { editAlbumSetting } from "../../api/album";
import { getUrlByFileId } from "../../api/file";
import { AlbumItem, AlbumSettingReq, E, UploadResult } from "../../types/types";
import { uploader } from "../../utils/upload";
import { Toast } from "../../utils/util";

/**
 * tab页相册个体
 */
Component({
  options: {
    addGlobalClass: true
  },

  /**
   * 组件的属性列表
   */
  properties: {
    album: {
      type: Object,
      value: () => {} 
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  lifetimes: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickAlbum(e: E) {
      const that = this;
      const { id, name, albumType, albumUserType } = e.currentTarget.dataset;  
      if (!id) {  
        Toast('相册不存在');  
        return; 
      }
      wx.navigateTo({  
        url: `/pages/storys/storys?albumId=${id}&albumType=${albumType}&albumName=${name}&albumUserType=${albumUserType || ''}`,
        events: {
          albumCover(albumCover: string) {
            that.setData({
              [`innerAlbum.albumCover`]: albumCover
            })
          },
          albumName(albumName: string) {
            that.setData({
              [`innerAlbum.albumName`]: albumName
            })
          }
        }
      });  
    }
  }
})