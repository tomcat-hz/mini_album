/**
 * 相册角色
 * admin：群主
 * helper：管理员
 * member：普通成员
 * visitor：参观者
 */
export enum AlbumUserType {
  ADMIN = "1",
  HELPER = "2",
  MEMBER = "3"
}

/**
 * 消息类型
 */
export enum MessageType {
  SYS_MESSAGE = "0",
  REPLY_MESSAGE = "1",
  MESSAGE = "2",
  FLLOW_MESSAGE = "3",
  STAR_MESSAGE = "4"
}

/**
 * 文件上传方式
 */
export enum UploadType {
    PHOTO_UPLOAD = "1",
    ALBUM_UPLOAD = "2",
    STORY_UPLOAD = "3",
    AVATAR_UPLOAD = "4"
}

/**
 * 相册类型
 */
export enum AlbumType {
  NORMAL = "0", // 普通相册
  PET = "1",    // 普通相册
  TRAVEL = "2",
  AIGC = "3",
  FESTIVAL = "4",
  ACTIVE = "5",
  SHOP = "6",
  BLIND = "7",
  RETIREMENT = "8",
  QIJI = "9"
}