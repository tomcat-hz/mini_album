import { addComment } from "../../api/comment";
import { AppType, CommentItem, E } from "../../types/types";
import { Toast } from "../../utils/util";
import { ratio } from "../../utils/constants";

const app: AppType = getApp();
/**
 * 评论组件
 */
Component({
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
    },
    albumId: {
      type: String,
      value: ""
    },
    storyId: {
      type: String,
      value: ""
    },
    commentParentId: {
      type: String,
      value: ""
    },
    replyUserId: {
      type: String,
      value: ""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    safeAreaBottom: app.globalData.safeAreaBottom,
    content: "",
    bottom: 0,
    focusComment: true,
    keyBoardHeight: 0,
    duration: 0.25
  },

  lifetimes: {
    ready() {
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    keyboardheightchange(e: E) {
      this.setData({
        keyBoardHeight: e.detail.height * ratio,
        duration: e.detail.duration
      })
    },
    addComment() {
      const { albumId, storyId, commentParentId, replyUserId } = this.properties;
      const { content } = this.data;
      if (!content) {
        Toast('请输入评论内容');
        return;
      }

      // this.hideComment();
      addComment({ content, albumId, storyId, commentParentId, replyUserId }).then((comment: CommentItem) => {
        Toast('评论成功');
        this.setData({
          content: ""
        })
        this.triggerEvent("commentSuccess", comment);
      })
    },
    onVisibleChange(e: E) {
      if (!e.detail.visible) {
        this.hideComment();
      }
    },
    hideComment() {
      this.triggerEvent("closeComment");
    },
    addContent(e: E) {
      const { value } = e.detail;
      this.setData({
        content: value
      })
    },
    clickKeyBoard() {
      const that = this;
      if (this.data.focusComment) {
        wx.hideKeyboard({
          success() {
            that.setData({
              focusComment: false
            })
          }
        })
      } else {
        this.setData({
          focusComment: true
        })
      }
    }
  }
})