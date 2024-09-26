import { getAuthorizationPost, getAuthorizationPut } from "../api/login";
import { cosUrl } from "../env";
import { AuthorizationForPost, UploadFile, UploadResult } from "../types/types";
import { CONTENT_TYPE_MAP } from "./constants";
import { parseXMLError, Toast} from "./util";

// 创建一个Uploader类  
class Uploader { 

  // 对更多字符编码的 url encode 格式  
  _camSafeUrlEncode(str: string) {  
    return encodeURIComponent(str)  
      .replace(/!/g, '%21')  
      .replace(/'/g, '%27')  
      .replace(/\(/g, '%28')  
      .replace(/\)/g, '%29')  
      .replace(/\*/g, '%2A')  
      .replace(/%2F/g, '/'); // 提前替换斜杠，避免后续混淆  
  }  
  
  /**
   * @description putFile方法用于上传文件(使用wx.request无法监控进度) 416：大小超过限制, 417：类型不支持, 418：相同文件, 419：文件为空, 200：成功, 500：报错
   * @param file 文件
   */
  async putFile(file: UploadFile) {
    return new Promise(async (reslove) => {
      if (!this._checkFileProperties(file)) return;
      const fs = wx.getFileSystemManager();
      // 成功则直接使用数据，否则会返回code
      const { key, authorization, cosSecurityToken, contentType, code } = await getAuthorizationPut(file);
      if (code && code !== 200) {
        // 416：大小超过限制, 417：类型不支持, 418：相同文件, 419：文件为空, 500: 服务异常
        reslove(code);
      } else {
        try {  
          // 读取文件内容
          const buffer = fs.readFileSync(file.url);
          // 发起PUT请求上传文件  
          wx.request({  
            url: `${cosUrl}${key}`,
            method: 'PUT',  
            header: {  
              Authorization: authorization,  
              'x-cos-security-token': cosSecurityToken,
              "Content-Type": contentType
            },  
            data: buffer,
            success: res => {  
              const { statusCode } = res;
              if(statusCode === 200) {
                reslove(statusCode);
              } else {
                reslove(statusCode);
              }
            },  
            fail: res => {
              console.log("上传失败", res);
              reslove(500);
            }  
          });  
        } catch (error) {  
          // 捕获并处理错误  
          console.error('上传过程中发生错误', error);  
          wx.showModal({  
            title: '上传失败',  
            content: error.toString(),  
            showCancel: false  
          });  
        }  
      }
    })
  }

  // postFile方法用于上传文件(使用wx.upload可以监控进度)
  async postFile(file: UploadFile, callback?: Function) {
    return new Promise<{uploadResult?: UploadResult, code: number, msg?: string}>(async (reslove) => {
      if (!this._checkFileProperties(file)) reslove({ code: 500 });
      if (!file.ext) return;
      // 可信任的数据
      const { ext, width, height, sha, size } = file;
      // 模拟篡改文件大小或者类型
      // 大小需要headObject检测
      // file.size = 10;
      // 类型可以检测到
      // file.ext = "gif";
      // 经过请求的数据是可能被篡改的
      const { authorization, uploadResult, code } = await getAuthorizationPost(file);
      if (code && code !== 200) {
        // 422: 校验失败，无权限上传, 416：大小超过限制, 417：类型不支持, 418：相同文件, 419：文件为空, 420: 篡改文件大小, 421: 篡改文件类型, 500: 服务异常
        reslove(code);
      } else {
        // 秒传逻辑
        if (uploadResult.isSecondUpload) return reslove({ uploadResult, code: 200 });
        const { key, qSignAlgorithm, qAk, qKeyTime, qSignature, policy, trafficLimit, successActionRedirect, cosSecurityToken } = authorization as AuthorizationForPost;
        const formData = {
          key,
          success_action_redirect: successActionRedirect,
          callback: successActionRedirect,
          'x-cos-traffic-limit': trafficLimit, 
          'Content-Type': CONTENT_TYPE_MAP.get(ext),
          'Content-Length': size,
          'q-sign-algorithm': qSignAlgorithm,
          'q-ak': qAk,
          'q-key-time': qKeyTime,
          'q-signature': qSignature,
          'x-cos-security-token': cosSecurityToken,
          'x-cos-meta-width': width,
          'x-cos-meta-height': height,
          'x-cos-meta-sha': sha,
          'x-cos-meta-file-id': uploadResult.fileId,
          'x-cos-meta-id': uploadResult.userFileId,
          policy,
        };
        const requestTask = wx.uploadFile({
          url: `${cosUrl}`,
          formData: formData,
          name: 'file',
          filePath: file.url,
          success: function (res: any) {
            // 真机,太奇葩了。。。
           if(res.statusCode === 303) {
            wx.request({
              url: res.header.Location[0],
              success() {
                reslove({ uploadResult, code: 200 });
              },
              fail() {
                reslove({ code: 500 });
              }
            })
            // 开发工具上
           } else if (res.statusCode === 200) {
              const callback = JSON.parse(res.data);
              const { code, msg } = callback;
              if (code === 200) {
                reslove({ uploadResult, code: 200 });
              } else {
                reslove({ code, msg });
              }
            } else {
              const { code } = parseXMLError(JSON.stringify(res));
              console.log('上传失败，状态码：', code);
              switch(code) {
                case "EntityTooLarge":
                  reslove({ code: 416 });
                  break;
                case "AccessDenied":
                  reslove({ code: 422 });
                  break;
                default:
                  reslove({ code: 500 });
                  break; 
              }
            }
          },
          fail: function (res) {
            reslove({ code: 500});
            console.log(res);
            Toast('上传失败，请稍后再试');
          },
        });
        requestTask.onProgressUpdate(function (res) {
          callback && callback(res);
        });
      }
    })
  }

  _checkFileProperties(file: UploadFile) {
    const { url: filePath, ext, size } = file;
    if (!filePath) {
      Toast('文件不存在');
      return false;
    }
    if (!size) {
      Toast('文件大小不能为空');
      return false;
    }
    if (!ext) {
      Toast('文件类型不支持');
      return false;
    }
    return true;
  }
}  
  
// 使用Uploader类  
export const uploader = new Uploader();