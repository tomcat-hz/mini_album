import { batchDeleteFile } from "../../api/file";
import { E, FileItem } from "../../types/types";
import eventCenter from "../../utils/eventCenter";
import { IS_EDIT_FILE_CHANGE, IS_FILE_ACTION_CHANGE } from "../../utils/eventName";
import globalDataManager from "../../utils/globalDataManager";
import { Toast } from "../../utils/util";

/**
 * 瀑布流组件
 */
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    top: {
      type: Number,
      value: 80
    },
    images: {
      type: Array,
      value: [] as FileItem[],
      observer: function(newVal: FileItem[], oldVal) {
        if (oldVal && oldVal.length) {
          const fileIds: string[] = oldVal.map((file: FileItem) => file.fileId);
          const diffFiles = newVal.filter(file => !fileIds.includes(file.fileId));
          this.renderImage(diffFiles);
        } else {
          this.renderImage(newVal);
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    previewImages: [] as FileItem[],
    isEditFile: false,
    leftHeight: 0,
    rightHeight: 0,
    choosedFileNum: 0
  },

  lifetimes: {
    attached() {
      eventCenter.$on(IS_EDIT_FILE_CHANGE, this.handleEditFile.bind(this));
      eventCenter.$on(IS_FILE_ACTION_CHANGE, this.handleFileAction.bind(this));
    },
    detached() {
      eventCenter.$off(IS_EDIT_FILE_CHANGE, this.handleEditFile.bind(this));
      eventCenter.$off(IS_FILE_ACTION_CHANGE, this.handleFileAction.bind(this));
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击文件
    handleTapFile(e: E) {
      const { fileIndex } = e.currentTarget.dataset;
      const file = this.data.previewImages[fileIndex];
      const { choosedFileNum } = this.data;
      // 是否编辑模式
      if (this.data.isEditFile) {
        if (file.status === 'view') {
          this.data.choosedFileNum += 1;
          file.status = 'editing';
        } else {
          this.setData({
            choosedFileNum: choosedFileNum - 1
          })
          file.status = 'view';
        }
        this.setData({
          [`previewImages[${fileIndex}].status`]: file.status
        })
        globalDataManager.setIsChoosedFileNumChange(choosedFileNum);
      } else {
        wx.previewImage({
          current: file.url,
          urls: this.data.previewImages.filter((image: FileItem) => image.status !== 'deleted').map((image: FileItem) => image.url),
          fail(error) {
            Toast('预览图片出错');
            console.log('预览图片出错:', error);
          }
        })
      }
    },
    // 长按文件
    handleLongTapFile(e: E) {
      if (!globalDataManager.getIsEditFile()) globalDataManager.setIsEditFile(true);
      wx.vibrateShort({
        type: "medium"
      })
      this.handleTapFile(e);
    },
    // 进入编辑模式
    handleEditFile(isEditFile: boolean) {
      this.data.previewImages.map((file: FileItem) => {
        if (file.status === 'editing') {
          this.setData({
            [`previewImages[${file.index}].status`]: 'view'
          })
        }
      })
      globalDataManager.setIsChoosedFileNumChange(0);
      this.setData({
        isEditFile,
        choosedFileNum: 0
      });
    },
    // 编辑动作
    handleFileAction(action: 'share' | 'delete') {
      if (action === 'share') {
        Toast('分享成功');
      } else if (action === 'delete'){
        // 删除的文件
        const editingFiles = this.data.previewImages.filter((file: FileItem) => file.status === 'editing');
        const fileIds = editingFiles.map((file: FileItem) => file.fileId);
        const fileIndexs = editingFiles.map((file: FileItem) => file.index || -1);
        batchDeleteFile(fileIds).then(() => {
          Toast('删除成功');
          this.setData({
            choosedFileNum: 0
          })
          globalDataManager.setIsChoosedFileNumChange(0);
          fileIndexs && fileIndexs.map((index: number) => {
            this.setData({
              [`previewImages[${index}].status`]: "deleted"
            })
          })
        });
      } else {
        Toast('操作类型未定义');
      }
    },
    /**
     * @param images 需要渲染的图片
     */
    renderImage(images: FileItem[], reload = false) {
      let leftHeight = 0, rightHeight = 0;
      const previewImages = reload ? [] as FileItem[] : this.data.previewImages;
      images.map((image: FileItem) => {
        const { width, height } = image;
        // todo 如果宽高显示有问题可以使用 wx.getImageInfo();
        image.width = 360;
        image.height = height * 360 / width;
        // 左右图片高度
        const position = leftHeight <= rightHeight ? "left" : "right";
        image.index = previewImages.length;
        image.position = position;
        previewImages.push(image);
        if (leftHeight <= rightHeight) {
          leftHeight += image.height + 40
        } else {
          rightHeight += image.height + 40
        }
      });
      this.setData({
        previewImages,
        leftHeight,
        rightHeight
      });
    },
  }
})