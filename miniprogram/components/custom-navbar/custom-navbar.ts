// components/custom-navbar/custom-navbar.ts
import { getUrlByFileId } from "../../api/file";
import { editUserInfo } from "../../api/login";
import { AppType, CustomUserInfo, E, EditUserInfo, UploadResult } from "../../types/types";
import eventCenter from "../../utils/eventCenter";
import { IS_EDIT_FILE_CHANGE, IS_LOGIN_CHANGE, IS_USER_CHANGE } from "../../utils/eventName";
import globalDataManager from "../../utils/globalDataManager";
import { Toast } from "../../utils/util";
import { uploader } from "../../utils/upload";

const app: AppType = getApp();
Component({
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: ""
    },
    showEdit: {
      type: Boolean,
      value: false
    },
    showBg: {
      type: Boolean,
      value: false
    },
    bg: {
      type: String,
      value: ""
    },
    showBack: {
      type: Boolean,
      value: false
    },
    showSetting: {
      type: Boolean,
      value: false
    },
    showUserInfo: {
      type: Boolean,
      value: false
    },
    searchTxt: {
      type: String,
      value: '搜索动态、相册、用户'
    },
    showSearch: {
      type: Boolean,
      value: false
    },
    sticky: {
      type: Boolean,
      value: false
    },
    disableSticky: {
      type: Boolean,
      value: true
    },
    autofocus: {
      type: Boolean,
      value: false
    },
    blur: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showUserDialog: false,
    isPc: app.globalData.isPc,
    toolTop: app.globalData.toolTop,
    toolRight: app.globalData.toolRight,
    toolWidth: app.globalData.toolWidth,
    toolHeight: app.globalData.toolHeight,
    isLogin: false,
    userInfo: {} as CustomUserInfo,
    formData: {
      avatar: "",
      nickName: "",
      signature: ""
    },
    fileAction: 'edit',
    headerWidth: "",
    searchContent: ""
  },

  lifetimes: {
    attached() {
      // 绑定登录状态改变事件  
      eventCenter.$on(IS_LOGIN_CHANGE, this.handleLoginChange.bind(this));  
      // 绑定用户信息改变事件  
      eventCenter.$on(IS_USER_CHANGE, this.handleUserInfoChange.bind(this));
      // 监听编辑状态改变
      eventCenter.$on(IS_EDIT_FILE_CHANGE, this.handleEditFileChange.bind(this));
      const { isPc, toolRight, toolWidth } = this.data;
      this.setData({
        "headerWidth": isPc ? `calc(100vw - 64rpx)` : `calc(100vw - 64rpx - ${toolRight}rpx - ${toolWidth}rpx)` 
      })  
    },
    detached() {  
      // 解绑登录状态改变事件  
      eventCenter.$off(IS_LOGIN_CHANGE, this.handleLoginChange.bind(this));  
      // 解绑用户信息改变事件  
      eventCenter.$off(IS_USER_CHANGE, this.handleUserInfoChange.bind(this));
    },
  },
  pageLifetimes: {
    show() {
      this.updateLoginAndUserInfo();
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    back() {
      wx.navigateBack({  
        delta: 1, // 返回的页面数，如果 delta 大于现有页面数，则返回到首页
        fail() {
          wx.switchTab({
            url: "/pages/album/album"
          })
        } 
      });
    },
    setting() {
      this.triggerEvent('setting');
    },
    onSearchChange(e: E) {
      this.setData({
        searchContent: e.detail.value
      })
    },
    onClickSearch() {
      this.triggerEvent('tapSearch');
    },
    search() {
      this.triggerEvent('search', this.data.searchContent);
    },
    handleLoginChange(isLogin: boolean) {  
      // 更新登录状态  
      this.setData({  
        isLogin  
      });  
    },
    handleUserInfoChange(userInfo: CustomUserInfo) {  
      // 更新用户信息  
      this.setData({  
        userInfo
      });
    },
    handleEditFileChange(isEdit: boolean) {
      if (isEdit) {
        Toast("已进入编辑模式")
        this.setData({
          fileAction: "cancle"
        })
      } else {
        this.setData({
          fileAction: "edit"
        })
      }
    },
    updateLoginAndUserInfo() {
      // 更新登录状态和用户信息到页面数据  
      this.setData({  
        isLogin: globalDataManager.getIsLogin(),  
        userInfo: globalDataManager.getUserInfo()
      });  
    },
    handleAvatarDialog() {
      const { avatar, nickName, signature } = globalDataManager.getUserInfo();
      const { showUserDialog } = this.data;
      // 展示用户信息框
      if (!showUserDialog) {
        this.setData({
          formData: {
            avatar,
            nickName,
            signature
          },
          showUserDialog: !showUserDialog
        })
      } else {
        this.setData({
          showUserDialog: !showUserDialog,
        })
      }
    },
    confirmDialog() {
      const that = this;
      const { formData, userInfo } = this.data;
      const { avatar, nickName, signature } = formData;
      if (!avatar || !nickName || !signature) {
        console.log("formData", formData);
        Toast("请完善个人信息");
        return;
      } else {
        if (!this._isUserInfoModified(formData, userInfo)) {
          Toast("没有修改个人信息，无需提交");
          return;
        } else {
          if (formData.avatar === userInfo.avatar) {
            editUserInfo({ nickName, signature }).then(() => {
              userInfo.signature = signature;
              userInfo.nickName = nickName;
              globalDataManager.setUserInfo(userInfo);
              this.setData({
                showUserDialog: false 
              });
            });
          } else {
            const fs = wx.getFileSystemManager();
            // 部分图片宽高无法获取，使用wx.getImageInfo获取
            wx.getImageInfo({
              src: formData.avatar,
              success: async(res) => {
                const { type, width, height } = res;
                // 标记文件has值、为以后秒传做准备
                fs.getFileInfo({
                  filePath: formData.avatar,
                  digestAlgorithm: "sha1",
                  success(fileInfo) {
                    const { size, digest } = fileInfo;
                    uploader.postFile({ width, height, ext: type, url: formData.avatar, size, sha: digest }).then((uploadRes: { uploadResult?: UploadResult, code: number, msg?: string }) => {
                      if (uploadRes.code === 200) {
                        const fileId = uploadRes.uploadResult?.fileId || "";
                        if (!fileId) {
                          Toast("图片上传失败");
                          return;
                        }
                        // 后端约定的值为文件id
                        formData.avatar = fileId + "";
                        editUserInfo({ ...formData  }).then(async() => {
                            console.log("头像", uploadRes);
                            const { url } = await getUrlByFileId(fileId);
                            userInfo.signature = signature;
                            userInfo.nickName = nickName;
                            userInfo.avatar = url || "";
                            globalDataManager.setUserInfo(userInfo);
                            that.setData({
                              showUserDialog: false 
                            });
                          }
                        );
                      } else {
                        Toast('头像上传失败');
                      }
                    });
                  }
                });
              }
            })
            // 服务器上传
            // simpleUpload(formData.avatar).then((res: UploadResult) => {
            //   formData.avatar = res.cosKey;
            //   editUserInfo({ ...formData }).then(() => {
            //       Toast("修改成功");
            //       userInfo.signature = signature;
            //       userInfo.nickName = nickName;
            //       userInfo.avatar = res.url;
            //       globalDataManager.setUserInfo(userInfo);
            //       this.setData({
            //         showUserDialog: false 
            //       });
            //     }
            //   );
            // });
          }
        }
      }
    },
    // 下划线表示ts内部使用的方法
    _isUserInfoModified(formData: EditUserInfo, userInfo: CustomUserInfo) {  
      return formData.avatar !== userInfo.avatar || 
             formData.nickName !== userInfo.nickName ||  
             formData.signature !== userInfo.signature;  
    },
    nicknamereview(e: E) {
      console.log("昵称校验", e);
      // if (e.detail.pass) {
      // } else {
      // }
    },
    changeInput(e: E) {
      console.log(e);
      const { field } = e.currentTarget.dataset;
      const { value } = e.detail;
      this.setData({  
        ["formData." + field]: value
      });
    },
    chooseAvatar(e: E) {
      console.log(e);
      const { avatarUrl } = e.detail;
      this.setData({
        ["formData.avatar"]: avatarUrl
      });
    },
    onFileAction() {
      globalDataManager.setIsEditFile(this.data.fileAction === 'edit');
    },
    userCenter() {
      wx.navigateTo({
        url: "/pages/user-center/user-center"
      })
    }
  }
})
