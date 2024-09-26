import { editAlbumSetting, getAlbumSetting, leaveAlbum } from "../../api/album";
import { AlbumSetting, AlbumSettingReq, AppType, FormBase, SwitchBase } from "../../types/types";
import { AlbumUserType } from "../../types/enums";
import { buildInputParams, buildQrcodeParams, getRole, isAdminOrhelper, Toast } from "../../utils/util";
import { getUrlByFileId } from "../../api/file";

const app:AppType = getApp();
Page({
  data: {
    toolTop: app.globalData.toolTop,
    toolHeight: app.globalData.toolHeight,
    albumSetting: {} as unknown as AlbumSetting,
    AlbumUserType,
    albumId: "",
    form: [] as FormBase[],
    formData: {
      albumId: "",
      albumName: "",
      albumCover: ""
    },
    showLeaveDialog: false,
    role: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { albumId } = options;
    if (albumId) {
      getAlbumSetting(albumId).then((albumSetting: AlbumSetting) => {
        this.setData({
          albumId,
          albumSetting,
          role: getRole(albumSetting.albumUserType)
        });
        this.initForm();
      });
    } else {
      Toast("相册id为空");
    }
  },

  buildForm(albumId: string, albumSetting: AlbumSetting): FormBase[] {
    const that = this;
    const { albumCover, albumName, notice, isPublic, isUpload, isComment, albumUserType } = albumSetting;
    const eventChannel = this.getOpenerEventChannel();
    return [
      {
        type: "route",
        title: "相册封面",
        arrow: true,
        hide: false,
        hasAuth: isAdminOrhelper(albumUserType),
        authTip: '相册成员无权操作，请联系创建者和管理员操作',
        url: "/pages/image-form/image-form?title=相册封面",
        submit: function(fileId: number) {
            editAlbumSetting({ albumId, fileId }).then(async() => {
              const { url } = await getUrlByFileId(fileId);
              that.setData({
                [`albumSetting.albumCover`]: url
              })
              eventChannel.emit("albumCover", url);
            }
          );
        }
      },
      {
        type: "route",
        title: "相册名称",
        note: albumName,
        arrow: true,
        hide: false,
        hasAuth: isAdminOrhelper(albumUserType),
        authTip: '相册成员无权操作，请联系创建者和管理员操作',
        url: `/pages/input-page/input-page?` + buildInputParams({
          type: 'input',
          cover: albumCover,
          value: albumName,
          title: '修改相册名称',
          desc: "修改相册名称后，将在消息内通知其他成员",
          placeholder: "请输入相册名称"
        }),
        submit: function(albumName: string) {
          editAlbumSetting({ albumId, albumName }).then(async() => {
            that.setData({
              [`albumSetting.albumName`]: albumName
            });
            eventChannel.emit("albumName", albumName);
            that.initForm();
            wx.navigateBack();
          })
        }
      },
      {
        type: "route",
        title: "相册二维码",
        arrow: false,
        hide: false,
        url: "/pages/qrcode-page/qrcode-page?" + buildQrcodeParams({
          type: "albumQrcode",
          cover: albumCover,
          title: '相册二维码',
          desc: "该二维码7天内(7月1日前)有效，重新进入将更新",
          url: "/static/join.jpg"
        }),
        icons: [
          {
            prefix: 'icon',
            name: 'qrcode',
            size: '48rpx',
            color: 'rgba(0, 0, 0, 0.6)'
          },
          {
            name: 'chevron-right',
            size: '48rpx',
            color: 'rgba(0, 0, 0, 0.4)'
          }
        ]
      },
      {
        type: "route",
        title: "相册公告",
        arrow: true,
        hide: false,
        hasAuth: isAdminOrhelper(albumUserType),
        authTip: '相册成员无权操作，请联系创建者和管理员操作',
        url: `/pages/input-page/input-page?` + buildInputParams({
          type: 'textarea',
          value: notice,
          title: '修改相册公告',
          desc: "修改相册公告后，将在动态内通知其他成员",
          placeholder: "请输入相册公告"
        }),
        note: notice ? "" : "未设置",
        description: notice,
        submit: function(notice: string) {
          editAlbumSetting({ albumId, notice }).then(async() => {
            that.setData({
              [`albumSetting.notice`]: notice
            });
            that.initForm();
            wx.navigateBack();
          })
        }
      },
      {
        type: "route",
        title: "相册管理",
        arrow: true,
        hide: false,
        hasAuth: isAdminOrhelper(albumUserType),
        authTip: '相册成员无权操作，请联系创建者和管理员操作',
        url: `/pages/admin-form/admin-form?isPublic=${isPublic}&isUpload=${isUpload}&isComment=${isComment}&albumId=${albumId}&albumUserType=${albumUserType}`,
        submit: function(switchBase: SwitchBase) {
          editAlbumSetting({ albumId, [switchBase.field]: switchBase.value }).then(async() => {
            that.setData({
              [`albumSetting.${switchBase.field}`]: switchBase.value
            });
            eventChannel.emit("switch", switchBase);
            that.initForm();
          })
        }
      },
      // {
      //   type: "route",
      //   title: "备注",
      //   hide: false,
      //   arrow: true,
      //   url: "",
      //   note: ""
      // },
      // {
      //   type: "route",
      //   title: "查找动态内容",
      //   arrow: true,
      //   hide: false,
      //   url: ""
      // },
      // {
      //   type: "switch",
      //   title: "消息免打扰",
      //   arrow: false,
      //   hide: false,
      //   url: "",
      //   switch: {
      //     field: 'isIgnoreMessage',
      //     value: 'Y'
      //   }
      // },
      // {
      //   type: "switch",
      //   title: "置顶相册",
      //   arrow: false,
      //   hide: false,
      //   url: "",
      //   switch: {
      //     field: 'isTop',
      //     value: 'Y'
      //   }
      // },
      // {
      //   type: "route",
      //   title: "我在本相册的昵称",
      //   arrow: true,
      //   hide: false,
      //   url: "",
      //   note: ""
      // },
      // {
      //   type: "switch",
      //   title: "显示成员昵称",
      //   arrow: false,
      //   hide: false,
      //   url: "",
      //   switch: {
      //     field: 'isShowNickname',
      //     value: 'Y'
      //   }
      // },
      // {
      //   type: "route",
      //   hide: false,
      //   title: "设置动态背景",
      //   arrow: true,
      //   url: ""
      // },
      // {
      //   type: "route",
      //   hide: false,
      //   title: "投诉",
      //   arrow: true,
      //   url: ""
      // }
    ];
  },

  initForm() {
    const { albumId, albumSetting } = this.data;
    this.setData({
      form: this.buildForm(albumId, albumSetting)
    })
  },

  // 下划线表示ts内部使用的方法
  _isAlbumModified(formData: AlbumSettingReq, album: AlbumSetting) {  
    return formData.albumCover !== album.albumCover || 
           formData.albumName !== album.albumName;
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
    leaveAlbum(this.data.albumId).then(() => {
      this.setData({
        showLeaveDialog: false
      });
      wx.reLaunch({
        url: "/pages/album/album"
      })
    })
  }
})