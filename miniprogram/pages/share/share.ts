import { joinAlbum } from "../../api/album";
import { BaseResponse } from "../../types/types";
import { Toast } from "../../utils/util";

// pages/share/share.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    joinSuccess: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { albumId } = options;
    if (!albumId) {
      Toast('分享相册不存在');
    } else {
      joinAlbum(albumId).then((res: BaseResponse) => {
        if (res.code === 404) {
          
        }
      });
    }
  }
})