import { tap } from "../../api/tap";
import { CommentItem, E, FileItem, LikeOrFavoritesReq, StoryItem } from "../../types/types";
import { Toast } from "../../utils/util";

/**
 * 动态组件
 */
Component({
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    story: {
      type: Object,
      value: null as unknown as StoryItem
    },
    showCommentList: {
      type: Boolean,
      value: true
    },
    isDetail: {
      type: Boolean,
      value: false
    },
    isComment: {
      type: Boolean,
      value: true
    },
    tips: {
      type: String,
      value: '评论功能暂未开启'
    },
    fullText: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showNoticeDialog: false,
    iconSelect: [false, false],
    showComment: false,
    photoStyle: ""
  },

  lifetimes: {
    attached() {
      this.initImageView();
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initImageView() {
      const { story } = this.properties;
      // 图片宽高样式
      if ([2, 3, 5, 6, 7, 8, 9].includes(story.files.length)) {
        this.setData({
          photoStyle: "width: 220rpx; height: 220rpx;"
        })
      } else if ([1].includes(story.files.length)) {
        let { width, height } = story.files[0];
        const maxHeight = 750;
        height = height * 400 / width;
        width = 400;
        if (height > maxHeight) {
          story.files[0].mode = 1;
        }
        this.setData({
          photoStyle: `width: ${width}rpx;height: ${height}rpx;max-height: ${maxHeight}rpx`
        });
      } else if ([4].includes(story.files.length)){
        this.setData({
          photoStyle: "width: 250rpx; height: 250rpx;"
        })
      } else {
        this.setData({
          photoStyle: "width: 222rpx; height: 222rpx;"
        })
      }
    },
    previewImage(e: E) {
      const { url } = e.currentTarget.dataset;
      const urls = this.data.story.files.map((file: FileItem) => file.url);
      wx.previewImage({
        current: url,
        urls
      })
    },
    clickIcon(e: E) {
      const { type } = e.currentTarget.dataset;
      const { story } = this.properties;
      const params: LikeOrFavoritesReq = {  
        relationId: story.storyId,  
        relationType: 2,
        operType: 1
      };

      if (type === 'share') {
        Toast('分享');
        return;
      }else if (type === 'favorites') {
        params.operType = 2;
        tap(params).then(() => {
          this.changeIconStatus(type);
          this.triggerEvent("tapIcon", type);
        });
      } else if (type === 'like') {
        params.operType = 1;
        tap(params).then(() => {
          this.changeIconStatus(type);
          this.triggerEvent("tapIcon", type);
        })
      }
    },
    changeIconStatus(type: 'favorites' | 'like') {
      const { story } = this.properties;
      let { isStar, isLike, likeCount } = story;
      if (type === 'favorites') {
        this.setData({  
          [`story.isStar`]: isStar === 'Y' ? 'N' : 'Y',
        });
        Toast(isStar === 'N' ? "已收藏" : "已取消收藏");
      } else if (type === 'like') {
        likeCount = isLike === 'Y' ? likeCount - 1 : likeCount + 1;
        this.setData({  
          [`story.isLike`]: isLike === 'Y' ? 'N' : 'Y',
          [`story.likeCount`]: likeCount,
        });
        Toast(isLike === 'N' ? "已点赞" : "已取消点赞");
      }
    },
    changeShowComment() {
      if (this.properties.isComment) {
        this.setData({
          showComment: !this.data.showComment
        })
      } else {
        Toast(this.properties.tips);
      }
    },
    storyDetail() {
      const that = this;
      if (this.properties.isDetail) return;
      const { storyId, albumId } = this.data.story;
      wx.navigateTo({
        url: `/pages/story-detail/story-detail?albumId=${albumId}&storyId=${storyId}`,
        events: {
          tap(type: 'favorites' | 'like') {
            that.changeIconStatus(type);
          },
        }
      })
    },
    commentSuccess(e: E) {
      const comment = e.detail as CommentItem;
      if (!this.properties.showCommentList) {
        this.setData({
          showComment: false
        })
        this.triggerEvent("commentSuccess", comment);
      } else {
        const { story } = this.properties;
        const { commentList } = story;
        commentList.rows.unshift(comment);
        commentList.total += 1;
        this.setData({
          showComment: false,
          [`story.commentList`]: commentList
        })
      }
    }
  }
})