import { getUrlByFileId } from "../../api/file";
import { editUserInfo } from "../../api/login";
import { E, FormBase } from "../../types/types";
import globalDataManager from "../../utils/globalDataManager";
import { buildInputParams, Toast } from "../../utils/util";

// pages/user-center/user-center.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.initForm();
  },

  initForm() {
    this.setData({
      form: this.buildForm()
    })
  },

  buildForm(): FormBase[] {
    const that = this;
    const userInfo = globalDataManager.getUserInfo();
    return [
      {
        title: '头像',
        arrow: false,
        hide: false,
        type: 'route',
        url: "/pages/image-form/image-form?title=个人头像",
        submit: function(fileId: number) {
          editUserInfo({ avatar: fileId + ""  }).then(async() => {
              const { url } = await getUrlByFileId(fileId);
              userInfo.avatar = url || "";
              globalDataManager.setUserInfo(userInfo);
              that.initForm();
              Toast("修改成功");
            }
          );
        },
        imageUrl: userInfo.avatar
      },
      {
        title: '名字',
        note: userInfo.nickName,
        arrow: true,
        type: 'route',
        hide: false,
        url: `/pages/input-page/input-page?` + buildInputParams({
          type: 'input',
          cover: userInfo.avatar,
          value: userInfo.nickName,
          title: '修改名字',
          desc: "",
          placeholder: "请输入名字"
        }),
        submit: function(nickName: string) {
          editUserInfo({ nickName }).then(async() => {
            userInfo.nickName = nickName;
            globalDataManager.setUserInfo(userInfo);
            that.initForm();
            wx.navigateBack();
          })
        }
      },
      {
        title: '签名',
        arrow: true,
        type: 'route',
        hide: false,
        note: userInfo.signature,
        url: `/pages/input-page/input-page?` + buildInputParams({
          type: 'input',
          cover: userInfo.avatar,
          value: userInfo.signature,
          title: '修改签名',
          desc: "",
          placeholder: "请输入签名"
        }),
        submit: function(signature: string) {
          editUserInfo({ signature }).then(async() => {
            userInfo.signature = signature;
            globalDataManager.setUserInfo(userInfo);
            that.initForm();
            wx.navigateBack();
          })
        }
      },
      // {
      //   title: '我的二维码',
      //   arrow: false,
      //   type: 'route',
      //   url: '',
      //   icons: [
      //     {
      //       prefix: 'icon',
      //       name: 'qrcode',
      //       size: '48rpx',
      //       color: 'rgba(0, 0, 0, 0.6)'
      //     },
      //     {
      //       name: 'chevron-right',
      //       size: '48rpx',
      //       color: 'rgba(0, 0, 0, 0.4)'
      //     }
      //   ]
      // },
      // {
      //   title: '奇迹号',
      //   arrow: true,
      //   type: 'route',
      //   url: ''
      // },
      // {
      //   title: '更多',
      //   arrow: true,
      //   type: 'route',
      //   url: ''
      // },
    ];
  },

  submit(e: E) {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.emit("submit", e.detail)
  }
})