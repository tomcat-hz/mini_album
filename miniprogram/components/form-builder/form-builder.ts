import { E, FormBase, UploadResult } from "../../types/types";
import { uploader } from "../../utils/upload";
import { Toast } from "../../utils/util";

// components/form-builder/form-builder.ts
Component({
  options: {
    addGlobalClass: true
  },

  /**
   * 组件的属性列表
   */
  properties: {
    form: {
      type: Array,
      value: [] as FormBase[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    tapFormItem(e: E) {
      const { index } = e.currentTarget.dataset;
      const { type, url, submit, hasAuth, authTip } = this.properties.form[index];
      if (hasAuth != undefined && !hasAuth) {
        Toast(authTip || '无操作权限');
        return;
      }
      switch (type) {
        case 'route':
          wx.navigateTo({
            url: url,
            events: {
              submit(e: E) {
                submit(e);
              }
            }
          })
          break;
        case 'localAlbum':
          this.chooseMedia();
          break;  
        default:
          console.log("操作类型", type);
          break;
      }
    },
    tapSwitch(e: E) {
      const { item } = e.currentTarget.dataset;
      item.value = item.value === 'Y' ? 'N' : 'Y';
      this.triggerEvent('switch', item);
    },
    chooseMedia() {
      const that = this;
      wx.chooseMedia({
        count: 1,
        mediaType: ['image'],
        sourceType: ['album'],
        maxDuration: 30,
        success(res) {
          const tempFilePath = res.tempFiles[0].tempFilePath;
          that.uploadImage(tempFilePath);
        },  
        fail(err) {  
          console.error('选择图片失败', err);
        }  
      });
    },
    uploadImage(filePath: string) {
      const that = this;
      const fs = wx.getFileSystemManager();
      // 部分图片宽高无法获取，使用wx.getImageInfo获取
      wx.getImageInfo({
        src: filePath,
        success: async(res) => {
          const { type, width, height } = res;
          fs.getFileInfo({
            filePath: filePath,
            digestAlgorithm: "sha1",
            success(fileInfo) {
              const { size, digest } = fileInfo;
              uploader.postFile({ width, height, ext: type, url: filePath
                , size, sha: digest }).then((uploadRes: { uploadResult?: UploadResult, code: number, msg?: string }) => {
                const fileId = uploadRes.uploadResult?.fileId;
                if (!fileId) {
                  Toast("图片上传失败");
                  return;
                }
                that.triggerEvent('submit', fileId);
              });
            }
          });
        }
      })
    }
  },
})