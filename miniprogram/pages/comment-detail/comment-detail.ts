import { getComment, listComment } from "../../api/comment";
import { AppType, CommentItem, CommentList } from "../../types/types";

const app: AppType = getApp();
// pages/comment-detail/comment-detail.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toolTop: app.globalData.toolTop,
    toolHeight: app.globalData.toolHeight,
    safeAreaBottom: app.globalData.safeAreaBottom,
    isLoading: false,
    pageLoading: true,
    parentComment: null as unknown as CommentItem,
    commentList: {
      rows: [] as CommentItem[],
      total: 0,
    },
    queryParams: {
      albumId: "",
      storyId: "",
      commentParentId: "0",
      replyUserId: "",
      pageNum: 1,
      pageSize: 10
    },
  },

  onLoad(options) {
    const { commentId, storyId, albumId } = options;
    if (commentId && storyId && albumId) {
      this.setData({
        [`queryParams.albumId`]: albumId,
        [`queryParams.storyId`]: storyId,
        [`queryParams.commentParentId`]: commentId,
      });
      // 获取父级评论
      getComment(commentId).then((comment: CommentItem) => {
        this.setData({
          parentComment: comment
        })
      })
      // 获取子集评论
      this.loadData();
    } else {
      console.log('commentId为空');
    }
  },


  loadData() {
    const { commentList, queryParams } = this.data;
    this.setData({
      isLoading: true
    });
    listComment(queryParams).then((comments: CommentList) => {
      const { rows, total } = comments;
      this.setData({
        commentList: {
          rows: [...commentList.rows, ...rows],
          total
        },
        isLoading: false,
        pageLoading: false
      })
    })
  },

  loadMore() {
    if (this.data.isLoading) return;
    const { commentList, queryParams } = this.data;
    if (commentList.rows.length === commentList.total) return;
    else {
      const { pageNum } = queryParams;
      this.setData({
        [`queryParams.pageNum`]: pageNum + 1
      });
    }
    this.loadData();
  }
})