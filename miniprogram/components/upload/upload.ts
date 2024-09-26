import { E, UploadFile, UploadResult, UploadStatus } from "../../types/types";
import { FILE_UPLOAD_STATUS } from "../../utils/constants";
import { Toast } from "../../utils/util";
import { uploader } from "../../utils/upload";

/**
 * 上传组件
 */
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    max: {
      type: Number,
      value: 1
    },
    uploadStatus: {
      type: String,
      value: "",
      observer(newVal, _oldVal) {
        if (newVal === UploadStatus.uploading) {
          this.upload();
        }
      }
    },
    sizeLimit: {
      type: Object,
      value: {
        size: 30, unit: 'MB', message: '图片大小不超过 30 MB'
      }
    },
    mediaType: {
      type: Array,
      value: ['image']
    },
    gridConfig: {
      type: Object,
      value: {
        column: 4,
        width: 160,
        height: 160,
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    originFiles: [] as UploadFile[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleSuccess(e: E) {
      const { files } = e.detail;
      this.setData({
        originFiles: files,
      });
    },
    handleRemove(e: E) {
      const { index } = e.detail;
      const { originFiles } = this.data;
      originFiles.splice(index, 1);
      this.setData({
        originFiles,
      });
    },
    handleClick(e: E) {
      console.log(e.detail.file);
    },
    handleDrop(e: E) {
      const { files } = e.detail;
      this.setData({
        originFiles: files,
      });
    },
    async upload() {
      const files = this.data.originFiles;
      if (!files.length) {
        Toast('请选择图片后提交');
        this.triggerEvent("changeUploading", false);
        return;
      }
      const uploadResult = await this.directUpload(files);
      this.triggerEvent("uploadSuccess", uploadResult);
    },
    // 前端直传
    async directUpload(files: UploadFile[]) {
      return new Promise<UploadResult[]>((reslove) => {
        const that = this;
        let finshedNum = 0;
        const uploadResults: UploadResult[] = [];
        for(let i = 0; i < files.length; i++) {
          const file = files[i];
          files[i].status = UploadStatus.loading;
          this.setData({
            originFiles: files,
            uploadStatus: UploadStatus.uploading
          })
          const fs = wx.getFileSystemManager();
          // 部分图片宽高无法获取，使用wx.getImageInfo获取
          wx.getImageInfo({
            src: file.url,
            success: async(res) => {
              if (['up', 'up-mirrored', 'down', 'down-mirrored'].includes(res.orientation)) {
                file.width = res.width;
                file.height = res.height;
              } else if (["left-mirrored", "right", "right-mirrored", "left"].includes(res.orientation)) {
                file.width = res.height;
                file.height = res.width;
              }
              file.ext = res.type;
              // 416：大小超过限制, 417：类型不支持, 418：相同文件, 419：文件为空, 500: 服务异常
              // const code = await uploader.putFile(file);
              fs.getFileInfo({
                filePath: file.url,
                digestAlgorithm: "sha1",
                success: async(fileInfo) => {
                  const { digest } = fileInfo;
                  file.sha = digest;
                  const { code, msg, uploadResult } = await uploader.postFile(file, (res: any) => {
                    const { progress } = res;
                    that.setData({
                      [`originFiles[${i}].percent`]: progress
                    })
                  });
                  finshedNum++;
                  if (code !== 200) {
                    that.setData({
                      [`originFiles[${i}].status`]: FILE_UPLOAD_STATUS.FAILED,
                      [`originFiles[${i}].failText`]: msg
                    })
                  } else {
                    uploadResults.push(uploadResult as UploadResult);
                    that.setData({
                      [`originFiles[${i}].status`]: FILE_UPLOAD_STATUS.DONE
                    })
                  }
                  if (finshedNum === files.length) {
                    reslove(uploadResults);
                    this.setData({
                      originFiles: files.filter((file) => file.status === FILE_UPLOAD_STATUS.FAILED),
                      uploadStatus: UploadStatus.finshed
                    })
                  }
                }
              });
            }
          })
        }
      })
    },
  }
})