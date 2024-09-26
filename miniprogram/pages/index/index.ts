// index.ts
import { listFile } from "../../api/file";
import { UploadActionType, AppType, FileType, FileItem, E } from "../../types/types";

const app: AppType = getApp();
Page({
  data: {
    pageLoading: true,
    toolTop: app.globalData.toolTop,
    tabbarHeight: app.globalData.tabbarHeight,
    selectList: ['全部', '图片', '视频'],
    selectIndex: 0,
    images: [] as FileItem[],
    showIndex: false,
    visable: false,
    pageNum: 1,
    pageSize: 15,
    fileType: "1" as FileType,
    total: 0,
    imageNum: 0,
    isLoading: false,
    hideUploadBtn: false,
    lastScrollTop: 0,
    position: 0,
  },
  onLoad() {
    this.initData();
  },
  onShow() {
    this.getTabBar().init();
  },
  async initData() {
    this.setData({
      pageLoading: true,
      images: [],
      pageHash: "",
      pageNum: 1,
      pageSize: 15,
      total: 0,
      imageNum: 0
    });
    await this.loadData();
    this.setData({
      pageLoading: false
    });
  },
  loadMore() {
    if (this.data.imageNum < this.data.total && !this.data.isLoading) {
      this.setData({
        pageNum: this.data.pageNum + 1
      });
      this.loadData()
    }
  },
  changeType(e: any) {  
    const currentIndex = e.currentTarget.dataset.index;  
    const previousIndex = this.data.selectIndex;  
    if (previousIndex !== currentIndex) {  
      const typeMap = ['', '1', '2', '3'];
      const type = typeMap[currentIndex] || '';
      this.setData({  
        selectIndex: currentIndex,  
        pageNum: 1,  
        fileType: type as FileType,  
        columns: [[], []], 
        images: []  
      });  
      this.loadData();  
    }  
  },
  onReachBottom() {
    this.loadMore();
  },
  //加载数据
  async loadData() {
    var that = this;
    if (!that.data.isLoading) {
      that.setData({ isLoading: true });
      const { pageNum, pageSize, fileType } = that.data;
      const { rows, total } = await listFile({ pageNum, pageSize, fileType });
      const newImages: FileItem = rows.map((image: FileItem) => {
        image.status = "view";
        return image;
      });
      let imageNum = this.data.imageNum;
      imageNum += rows.length;
      that.setData({
        total,
        imageNum,
        images: this.data.images.concat(newImages),
        isLoading: false
      });
    }
  },
  uploadImage() {
    const that = this;
    this.setData({
      hideUploadBtn: false
    });
    wx.navigateTo({
      url: `/pages/upload/upload?action=${UploadActionType.uploadImage}`,
      events: {
        refresh() {
          that.initData();
        }
      }
    })
  },
  // 绑定到scroll-view的bindscroll事件  
  handleScroll(e: E) {
    this.setData({
      position: e.detail.detail.scrollTop
    })
  }
})
