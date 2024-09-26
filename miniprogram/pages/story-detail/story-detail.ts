import { getAlbumSetting } from "../../api/album";
import { listComment } from "../../api/comment";
import { getStoryInfo } from "../../api/storys";
import { AlbumUserType } from "../../types/enums";
import { AppType, CommentItem, CommentList, E, StoryItem } from "../../types/types";

const app: AppType = getApp();
// pages/story-detail/story-detail.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    AlbumUserType: AlbumUserType,
    toolTop: app.globalData.toolTop,
    toolHeight: app.globalData.toolHeight,
    safeAreaBottom: app.globalData.safeAreaBottom,
    isLoading: false,
    pageLoading: true,
    enable: false,
    story: null as unknown as StoryItem,
    commentIndex: -1,
    commentList: {
      rows: [] as CommentItem[],
      total: 0,
    },
    queryParams: {
      albumId: "",
      storyId: "",
      commentParentId: "0",
      pageNum: 1,
      pageSize: 10
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { storyId, albumId } = options;
    this.setData({
      [`queryParams.albumId`]: albumId,
      [`queryParams.storyId`]: storyId
    });
    if (storyId && albumId) {
      this.initData();
    } else {
      console.log('storyId为空')
    }
  },

  commentStorySuccess(e: E) {
    const comment = e.detail as CommentItem;
    console.log("评论成功", comment)
    const { commentList } = this.data;
    const parentComment = commentList.rows;
    parentComment.unshift(comment);
    const totalComment = commentList.total + 1;
    this.setData({
      commentList: {
        rows: parentComment,
        total: totalComment
      }
    })
  },

  tapIcon(e: E) {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.emit("tap", e.detail)
  },

  async initData() {
    this.setData({
      pageLoading: true,
      commentList: {
        rows: [],
        total: 0
      }
    });
    const [albumSetting, story, comments] = await Promise.all([getAlbumSetting(this.data.queryParams.albumId), getStoryInfo(this.data.queryParams.storyId), listComment(this.data.queryParams)]);
    const { rows, total } = comments;
    this.setData({
      pageLoading: false,
      story,
      albumSetting,
      commentList: {
        rows,
        total
      }
    })
  },

  loadMore() {
    if (this.data.isLoading) return;
    const { commentList, queryParams } = this.data;
    if (commentList.rows.length === commentList.total) return;
    else {
      const { pageNum } = queryParams;
      this.setData({
        isLoading: true,
        [`queryParams.pageNum`]: pageNum + 1
      });
    }
    listComment(queryParams).then((comments: CommentList) => {
      const { rows, total } = comments;
      this.setData({
        commentList: {
          rows: [...commentList.rows, ...rows],
          total
        },
        isLoading: false,
        enable: false,
      })
    })
  }
})