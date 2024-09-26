import { E } from "../types/types"
import eventCenter from "../utils/eventCenter"
import { IS_EDIT_FILE_CHANGE, IS_EDIT_FILE_NUM_CHANGE, IS_FILE_ACTION_CHANGE } from "../utils/eventName"

Component({
  data: {
    selected: 0,
    color: "#515151",
    selectedColor: "#1296db",
    list: [{
      pagePath: "/pages/index/index",
      iconPath: "zhaoxiangji",
      selectedIconPath: "zhaoxiangji-copy",
      text: "照片"
    },
    {
      pagePath: "/pages/album/album",
      iconPath: "zhaopian",
      selectedIconPath: "zhaopian-copy",
      text: "相册"
    },
    // {
    //   pagePath: "/pages/tool/tool",
    //   iconPath: "gongjuxiang",
    //   selectedIconPath: "gongjuxiang-copy",
    //   text: "工具"
    // },
    // {
    //   pagePath: "/pages/message/message",
    //   iconPath: "xiaoxi",
    //   selectedIconPath: "xiaoxi-copy",
    //   text: "消息"
    // },
    {
     pagePath: "/pages/my/my",
     iconPath: "customer-fill",
     selectedIconPath: "customer-fill-copy",
     text: "我的"
   }],
   showEdit: false,
   choosedFileNum: 0
  },
  lifetimes: {
    attached() {
      eventCenter.$on(IS_EDIT_FILE_CHANGE, this.handleEditFile.bind(this));
      eventCenter.$on(IS_EDIT_FILE_NUM_CHANGE, this.handleChoosedFileNum.bind(this));
    },
    detached() {
      eventCenter.$off(IS_EDIT_FILE_CHANGE, this.handleEditFile.bind(this));
      eventCenter.$off(IS_EDIT_FILE_NUM_CHANGE, this.handleChoosedFileNum.bind(this));
    }
  },
  methods: {
    switchTab(e: E) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    },
    handleEditFile(isEditFile: boolean) {
      this.setData({
        showEdit: isEditFile
      })
    },
    handleChoosedFileNum(choosedFileNum: number) {
      this.setData({
        choosedFileNum
      })
    },
    deleteChoosedFile() {
      // content: `即将删除${this.data.choosedFileNum}个文件，回收站可找回`,
      wx.showModal({
        title: "温馨提示",
        content: `即将删除${this.data.choosedFileNum}个文件`,
        success(res) {
          if (res.confirm) {
            eventCenter.$emit(IS_FILE_ACTION_CHANGE, 'delete');
          }
        },
      });
    },
    shareChoosedFile() {
      wx.showModal({
        title: "分享文件提示",
        content: `分享${this.data.choosedFileNum}个文件`,
        success(res) {
          if (res.confirm) {
            eventCenter.$emit(IS_FILE_ACTION_CHANGE, 'share');
          }
        },
      });
    },
    init() {
      const page = getCurrentPages().pop();
      const route = page ? page.route.split('?')[0] : '';
      const selected = this.data.list.findIndex(
        (item) =>
          (item.pagePath.startsWith('/') ? item.pagePath.substr(1) : item.pagePath) ===
          `${route}`,
      );
      this.setData({ selected });
    },
  }
})