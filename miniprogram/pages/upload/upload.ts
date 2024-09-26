import { addAlbum } from "../../api/album";
import { sensitiveWord } from "../../api/checkContent";
import { addStory } from "../../api/storys";
import { UploadStatus, UploadActionType, E, AppType } from "../../types/types";
import { Toast } from "../../utils/util";

const app: AppType = getApp();
// pages/upload/upload.ts
Page({
  /**
   * 页面的初始数据
   */
  data: {
    toolTop: app.globalData.toolTop,
    albumId: "",
    uploadStatus: UploadStatus.waited,
    uploadType: "",
    action: '',
    title: '',
    gridConfig: {
      column: 4,
      width: 160,
      height: 160,
    },
    uploadTitle: {
      createAlbum: '创建相册',
      uploadImage: '上传照片',
      createStory: '创建动态'
    },
    maxUpload: {
      createAlbum: 1,
      uploadImage: 20,
      createStory: 9
    },
    inputStyle: "border-radius: 12rpx;",
    formData: {
      albumName: '',
      content: ''
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { action, albumId } = options;
    this.setData({
      action,
      albumId
    })
  },
  changeInput(e: E) {
    const { field } = e.currentTarget.dataset;
    const { value } = e.detail;
    this.setData({  
      ["formData." + field]: value
    });
  },
  async onSubmit() {
    const { action } = this.data;
    let isillegal = false;
    switch(action)  {
      case UploadActionType.createAlbum:
        const { albumName } = this.data.formData;
        if (!albumName) {
          Toast("请填写相册名称后提交")
          return;
        }
        isillegal = await sensitiveWord(albumName);
        if (isillegal) {
          Toast("相册名称包含敏感内容,请修改后提交")
          return
        }
        break;
      case UploadActionType.createStory:
        const { content } = this.data.formData;
        if (!content) {
          Toast("请完善动态后提交")
          return;
        }
        isillegal = await sensitiveWord(content);
        if (isillegal) {
          Toast("动态内容包含敏感内容,请修改后提交")
          return
        }
        break;
      default:
        break;
    }
    this.setData({
      uploadStatus: UploadStatus.uploading
    })
  },
  changeUploading(e: E) {
    this.setData({
      uploadStatus: e.detail ? UploadStatus.uploading : UploadStatus.waited
    });
  },
  uploadSuccess(e: E) {
    const { action } = this.data;
    const uploadResult = e.detail;
    const eventChannel = this.getOpenerEventChannel();
    switch(action)  {
      case UploadActionType.createAlbum:
        const { albumName } = this.data.formData;
        addAlbum({ albumName, fileId: uploadResult[0].fileId }).then(() => {
          Toast("创建成功", 300).then(() => {
            // 向父组件发送刷新页面事件
            eventChannel.emit("refresh");
            wx.navigateBack();
          })
        });
        break;
      case UploadActionType.createStory:
        const { content } = this.data.formData;
        addStory({ albumId: this.data.albumId, content, fileIds: uploadResult.map((item: { fileId: string; }) => item.fileId) })
        .then(() => {
          Toast("创建成功", 300).then(() => {
            // 向父组件发送刷新页面事件
            eventChannel.emit("refresh");
            wx.navigateBack();
          })
        });
        break;
      case UploadActionType.uploadImage:
        // 上传成功之后动作
        eventChannel.emit("refresh");
        break;
    }
    this.setData({
      uploadStatus: UploadStatus.finshed
    });
  }
})