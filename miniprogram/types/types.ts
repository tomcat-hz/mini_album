// type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
import { AlbumType, AlbumUserType } from "./enums";

// app类型
interface AppType {
  [x: string]: any; 
  globalData: {
    [x: string]: any; 
    tabbarHeight: number; // 底部tabbar高度  
    toolTop: number; // 胶囊距离顶部高度  
    toolHeight: number; // 胶囊高度 
    safeAreaBottom: number; // 底部安全距离高度
    toolRight: number;  // 胶囊右边距离
    toolWidth: number; // 胶囊宽度
    tabIndex: number; //
    ratio: number;
    isPc: boolean; // 是否pc
  }
}

/**
 * 1.currentTarget.dataset wxml上传递的参数
 */
interface E {
  [x: string]: any;  
  currentTarget: {  
    dataset: {
      [key: string]: any;
    };  
  };  
  detail: any;  
}

// 分页数据
type PageData<T> = { total: number;rows: T[]; }

// 分页数据
type PageResp<T> = BaseResponse<PageData<T>>;

// 基础响应信息
type BaseResponse<T = undefined> = {  
  code: number;
  msg: string;
  data?: T;
}

// 基础分页请求
interface PageBaseReq {
  pageNum: number;
  pageSize: number;
}

/**
 * @description：小程序表单
 * type: route路由、switch开关、takePhoto拍一张、qjAlbum奇迹相册、localAlbum本地相册、defaultPhoto默认图片
 * title: 表单标题
 * arrow: 显示箭头
 * icons: 右侧图标列表
 * imageUrl: 右侧图片链接
 * note: 右侧文字
 * description: 描述内容
 * url: 跳转路径
 */
interface FormBase {
  type: 'route' | 'switch' | 'takePhoto' | 'localAlbum' | 'defaultPhoto' | 'wechatAvatar';
  title: string;
  hasAuth?: boolean;
  authTip?: string;
  hide: boolean;
  arrow: boolean;
  url?: string;
  icons?: IconBase[];
  imageUrl?: string;
  note?: string;
  description?: string;
  switch?: SwitchBase;
  submit?: Function;
}

interface InputBase {
  type: 'input' | 'textarea';
  value: string;
  placeholder: string;
  title?: string;
  desc?: string;
  cover?: string;
}

interface OptionBase {
  title?: string;
  desc: [];
  options: {
    cover: string;
    value: string;
  }[]
}

interface QrcodeBase {
  type: 'albumQrcode' | 'userQrcode';
  title: string;
  desc: string;
  cover: string;
  url: string;
}


/**
 * prefix：tdesign图标不需要、iconfont前缀为固定的icon
 */
interface IconBase {
  prefix?: 'icon';
  name: string;
  size: string;
  color: string;
}

/**
 * 
 */
interface SwitchBase {
  field: string;
  value: 'Y' | 'N'
}

// 用户等级信息（vip，普通用户）
interface UserLevel {
  levelName: string;
  spaceSize: number;
  fileNum: number;
  perSize: number;
}

// 上传类型（文件上传、创建相册、创建故事）
enum UploadActionType {
  uploadImage='uploadImage',
  createAlbum='createAlbum',
  createStory='createStory'
}

// 小程序用户
interface CustomUserInfo extends WechatMiniprogram.UserInfo {
  nickName: string;
  avatar: string;
  signature: string;
  token: string;
  usedSpace: number;
  usedFileNum: number;
  userLevel: UserLevel;
}

// 上传文件状态
enum UploadStatus {
  loading = "loading",
  waited = "waited",
  uploading = "uploading",
  finshed = "finshed"
}

// 上传返回结果，文件的coskey
interface UploadResult {
  isSecondUpload: boolean;
  userFileId: string;
  fileId: number;
  width: number;
  height: number;
}

// 创建相册
type CreateAlbumReq = {
  albumName: string; // 相册名称
  fileId: string;    // 相册封面关联fileId
}

// 创建动态
interface CreateStory {
  albumId: string;
  content: string;
  fileIds: string[];
}

// 相册基础信息
interface AlbumItem {
  albumId: string;  // 相册id
  albumType: AlbumType; // 1：普通相册，2：推荐相册
  albumName: string;  // 相册名称
  albumCover: string;
  notice: string;
}

// 相册配置信息
interface AlbumSetting extends AlbumItem {
  albumUserType: AlbumUserType; // 是否为管理员
  storyBg: string;
  mark: string; // 相册备注
  nickname: string; // 相册昵称
  isShowNickname: "Y" | "N"; // 是否显示昵称
  isTop: "Y" | "N"; // 是否置顶
  isIgnoreMessage: "Y" | "N"; // 是否免打扰
  isComment: "Y" | "N"; // 是否允许评论
  isDownload: "Y" | "N";  // 是否允许下载
  isPublic: "Y" | "N";  // 是否允许分享
  isUpload: "Y" | "N";  // 是否允许上传
  isWatermark: "Y" | "N";  // 是否有水印
  memberCount: number;
  storyCount: number;
}

// 修改相册配置请求
interface AlbumSettingReq {
  albumId: string;
  fileId?: number;
  albumName?: string;
  notice?: string;
  albumCover?: string;
  isComment?: "Y" | "N"; // 是否允许评论
  isUpload?: "Y" | "N";  // 是否允许上传
  isPublic?: "Y" | "N";  // 是否允许分享
  wxUserAlbum?: {
    storyBg?: string; // 动态背景
    mark?: string; // 相册备注
    nickname?: string; // 昵称
    isTop?: "Y" | "N";   // 是否允许分享
    isShowNickname?: "Y" | "N";   // 是否显示昵称
    isIgnoreMessage?: "Y" | "N";   // 是否免打扰
  }
}

// 相册列表
interface AlbumListItem {
  title: string;  // 板块名称
  albumList: AlbumItem[]  // 相册列表
}

// 文件（宽高是通过小程序的load方法获取的）
interface FileItem {
  index?: number;
  position?: "left" | "right";
  status?: 'view' | 'editing' | 'deleted';
  sha?: string;
  fileId: string;
  url: string,
  width: number;
  height: number;
  mode: 0 | 1 | 2;  // 普通图片、长图、动图
}

/**
 * 文件上传对象
 * fileFrom: 1.图片上传 2.相册上传 3.动态上传 4.头像
 */
interface UploadFile {
  url: string;
  name?: string;
  size?: number;
  type?: 'image' | 'video';
  percent?: number;
  status?: 'loading' | 'reload' | 'failed' | 'done';
  failText?: string;
  thumb?: string;
  width: number;
  height: number;
  sha?: string;
  ext?: string;
}

// 文件类型（"1" 为图片，"2" 为视频，"3" 为文档，空字符串为查询所有） 
type FileType = "1" | "2" | "3" | "";

// 文件列表请求
interface FilePageReq extends PageBaseReq {
  fileType?: string;
}

// 文件列表响应
interface FilePageResp {
  fileId: string;
  url: string;
  width: number;
  height: number;
}

// 评论对象
interface CommentList {
  rows: CommentItem[];
  total: number;
}

interface CommentItem {
  commentId?: string;
  albumId: string;
  storyId: string;
  content: string;
  replyUserId: string;
  commentParentId?: string;
  replyNickName?: string;
  isLandlord?: "Y" | "N";
  nickName?: string;
  avatar?: string;
  commentList?: CommentList
  totalComment?: number;
}

// 动态对象
interface StoryItem {
  userId: string;
  storyId: string;
  content: string;
  createTime: string;
  timeAgo: string;
  likeCount: number;
  commentList: CommentList;
  files: FileItem[];
  isLike: "Y" | "N";
  isStar: "Y" | "N";
  nickName: string;
  avatar: string;
  totalComment: number;
}

// 点赞或收藏
interface LikeOrFavoritesReq {
  relationId: string;  // 动态id或者评论id，要和relationType保持一致
  relationType: 1 | 2; // 1：评论，2：动态
  operType: 1 | 2;     // 1: 点赞，2：收藏
}

// 评论分页
interface CommentPageReq extends PageBaseReq {
  albumId: string;
  storyId: string;
  commentParentId?: string;
}

// 动态分页
interface StoryPageReq extends PageBaseReq {
  albumId?: string;
  content?: string;
}

// 已使用资源
interface ResourceResp {
  usedSpace: number;  // 使用空间，单位M
  usedFileNum: number;  // 上传文件数量，单位个
}

// 分页类型
enum PageType {
  STORY = "story",  // 动态
  FILE = "file",    // 文件（照片，视频）
  ALBUM = "album"   // 相册
}

// 修改用户信息
interface EditUserInfo {
  avatar?: string;
  signature?: string;
  nickName?: string;
}

// cos直传post
interface AuthorizationForPost {
  key: string;
  contentType: string;
  contentLength: number;
  successActionRedirect: string;
  qSignAlgorithm: string;
  qAk: string;
  qKeyTime: string;
  qSignature: string;
  trafficLimit: number;
  policy: string;
  cosSecurityToken: string;
  uploadResult: UploadResult;
}

// cos直传结果
interface AuthorizationResult {
  key: string;
  authorization: string;
  contentType: string;
}

export  {
  AppType,
  E,
  PageData,
  PageResp,
  BaseResponse,
  PageBaseReq,
  FormBase,
  SwitchBase,
  InputBase,
  OptionBase,
  QrcodeBase,
  UserLevel,
  UploadActionType,
  CustomUserInfo,
  UploadStatus,
  UploadResult,
  CreateAlbumReq,
  CreateStory,
  AlbumItem,
  AlbumSettingReq,
  AlbumSetting,
  AlbumListItem,
  FileItem,
  UploadFile,
  FileType,
  FilePageReq,
  FilePageResp,
  CommentList,
  CommentItem,
  StoryItem,
  LikeOrFavoritesReq,
  CommentPageReq,
  StoryPageReq,
  ResourceResp,
  PageType,
  EditUserInfo,
  AuthorizationForPost,
  AuthorizationResult
}

// 反向约束
export function m<T>(x: T extends number ? never : T) {
  console.log(x);
}