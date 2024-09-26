import { timeAgo } from "../../utils/util";

interface Item {
  avatar: string;
  nickName: string;
  createTime: string,
  timeAgo: string;
}
/**
 * 评论或动态头像
 */
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {  
      type: Object,  
      value: {  
        avatar: "",
        nickName: "",
        createTime: ""
      }, 
      validator: function(value: Item) {  
        return typeof value === 'object' 
        && value.hasOwnProperty('avatar') && typeof value.avatar === 'string'
        && value.hasOwnProperty('nickName') && typeof value.avatar === 'string'
        && value.hasOwnProperty('createTime') && typeof value.avatar === 'string';  
      },
      observer(newVal: Item, _oldVal) {
        const headItem = newVal;
        headItem.timeAgo =  timeAgo(newVal.createTime);
        this.setData({
          headItem
        })
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    headItem: {  
      avatar: "",
      nickName: "",
      createTime: "",
      timeAgo: ""
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
  }
})