import { closeAlbum } from "../../api/album";
import { AlbumUserType } from "../../types/enums";
import { E, FormBase } from "../../types/types";
import { Toast } from "../../utils/util";

// pages/admin-form/admin-form.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    albumId: "",
    isPublic: "", 
    isUpload: "", 
    isComment: "",
    form: {} as FormBase[],
    showLeaveDialog: false,
    isAdmin: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { isPublic = '', isUpload = '', isComment = '', albumId, albumUserType } = options;
    console.log("admin-form", options);
    this.setData({
      albumId,
      isPublic, 
      isUpload, 
      isComment,
      isAdmin: albumUserType === AlbumUserType.ADMIN
    });
    this.initForm();
  },

  initForm() {
    this.setData({
      form: this.buildForm()
    })
  },

  buildForm(): FormBase[] {
    const { isPublic, isComment, isUpload } = this.data;
    return [
      {
        arrow: false,
        type: 'switch',
        title: "公开相册",
        hide: false,
        description: "启用后，任何人都可以通过扫描二维码加入相册。关闭时，扫描二维码将同时停用。",
        switch: {
          field: "isPublic",
          value: isPublic === 'Y' ? 'Y' : 'N'
        },
      },
      {
        arrow: false,
        type: 'switch',
        hide: false,
        title: "普通成员发表动态",
        description: "启用后，普通成员可以发表动态。",
        switch: {
          field: "isUpload",
          value: isUpload === 'Y' ? 'Y' : 'N'
        },
      },
      {
        arrow: false,
        type: 'switch',
        hide: false,
        title: "普通成员发表评论",
        description: "启用后，普通成员可以发表动态。",
        switch: {
          field: "isComment",
          value: isComment === 'Y' ? 'Y' : 'N'
        },
      },
      // {
      //   arrow: true,
      //   type: 'route',
      //   title: "相册管理权转让",
      //   url: "/pages/user-select/user-select",
      // },
      // {
      //   arrow: true,
      //   type: 'route',
      //   title: "相册管理员",
      //   url: "/pages/option-page/option-page",
      // }
    ]
  },

  closeAlbum() {
    Toast("解散相册");
  },

  switch(e: E) {
    const eventChannel = this.getOpenerEventChannel();
    const res = e.detail;
    console.log('res', res);
    this.setData({
      [res.field]: res.value,
    });
    this.initForm();
    eventChannel.emit("submit", e.detail)
  },
  
  exitAlbum() {
    this.setData({
      showLeaveDialog: true
    })
  },

  closeDialog() {
    this.setData({
      showLeaveDialog: false
    })
  },

  confirmLeave() {
    closeAlbum(this.data.albumId).then(() => {
      this.setData({
        showLeaveDialog: false
      });
      wx.reLaunch({
        url: "/pages/album/album"
      })
    })
  }
})