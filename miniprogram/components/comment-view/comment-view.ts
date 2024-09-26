import { CommentList } from "../../types/types";

/**
 * 带背景色以及评论条数的评论
 */
Component({
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    commentList: {
      type: Object,
      value: null as unknown as CommentList
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showComment: false
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})