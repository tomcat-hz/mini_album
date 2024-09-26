import { tap } from "../../api/tap";
import { CommentItem, CommentList, E, LikeOrFavoritesReq } from "../../types/types";
import { Toast } from "../../utils/util";

type CommentType = "son" | "parent";

/**
 * 评论列表
 */
Component({
  options: {
    addGlobalClass: true
  },

  /**
   * 组件的属性列表
   */
  properties: {
    parentComment: {
      type: Object,
      value: null as unknown as CommentList
    },
    commentList: {
      type: Object,
      value: null as unknown as CommentList
    },
    albumId: {
      type: String,
      value: ""
    },
    storyId: {
      type: String,
      value: ""
    },
    // 强制父级id为评论动态的，保持层级只有两层（评论动态，评论”评论动态“）
    commentParentId: {
      type: Number,
      value: 0
    },
    isLandlord: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showComment: false,
    commentIndex: -1, // 当前评论的下标记
    isLoading: false,
    commentType: "parent" as CommentType
  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickComment(e: E) {
      const { albumId } = this.properties;
      const { commentId, storyId } = e.currentTarget.dataset;
      wx.navigateTo({
        url: `/pages/comment-detail/comment-detail?albumId=${albumId}&storyId=${storyId}&commentId=${commentId}`
      })
    },

    clickIcon(e: E) {
      console.log('点赞', e);
      const { comment, index } = e.currentTarget.dataset;
      let { likeCount, isLike } = comment;
      const params: LikeOrFavoritesReq = {  
        relationId: comment.commentId,  
        relationType: 1,
        operType: 1
      };
      tap(params).then(() => {
        likeCount = isLike === 'Y' ? likeCount - 1 : likeCount + 1;
        this.setData({  
          [`commentList.rows[${index}].isLike`]: isLike === 'Y' ? 'N' : 'Y',
          [`commentList.rows[${index}].likeCount`]: likeCount,
        });
        Toast(isLike === 'Y' ? '已取消点赞' : '已点赞');
      }); 
    },
    
    clickParentIcon() {
      const { parentComment } = this.properties;
      let { likeCount, isLike } = parentComment;
      const params: LikeOrFavoritesReq = {  
        relationId: parentComment.commentId,  
        relationType: 1,
        operType: 1
      };
      tap(params).then(() => {
        likeCount = isLike === 'Y' ? likeCount - 1 : likeCount + 1;
        this.setData({  
          [`parentComment.isLike`]: isLike === 'Y' ? 'N' : 'Y',
          [`parentComment.likeCount`]: likeCount,
        });
        Toast(isLike === 'Y' ? '已取消点赞' : '已点赞');
      }); 
    },
  
    changeShowComment(e: E) {
      const { index,  commentType } = e.currentTarget.dataset;
      console.log("commentType", commentType);
      // 评论子级  
      this.setData({
        showComment: !this.data.showComment,
        commentIndex: index,
        commentType
      })
    },

    commentSuccess(e: E) {
      const comment = e.detail as CommentItem;
      if (this.properties.commentParentId) {
        const commentParent = this.data.commentList.rows;
        commentParent.unshift(comment);
        const totalComment = this.data.commentList.total + 1;
        this.setData({
          showComment: false,
          [`commentList`]: {
            rows: commentParent,
            total: totalComment
          },
        })
      } else {
        const commentIndex = this.data.commentIndex;
        const commentSon = this.data.commentList.rows[commentIndex].commentList.rows;
        const totalComment = this.data.commentList.rows[commentIndex].commentList.total + 1;
        commentSon.unshift(comment);
        this.setData({
          showComment: false,
          [`commentList.rows[${commentIndex}].commentList`]: {
            rows: commentSon,
            total: totalComment
          },
        })
      }
    },
  }
})