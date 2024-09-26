import baseUrl from "../env";
import { UploadResult } from "../types/types";
import { Toast } from "../utils/util";

/**
 * @description 简单上传：服务器上传
 * @param filePath 文件路径
 */
export async function simpleUpload(filePath: string) {
  const token = wx.getStorageSync("token");
  return new Promise<UploadResult>((resolve, reject) => {
    wx.uploadFile({
      url: `${baseUrl}/mini/file`,
      filePath,
      header: {
        Authorization: token,
      },
      name: 'file',
      success(res: { statusCode: number, data: string }) {
        if (res.statusCode === 200) {
          const data: { code: number, msg: string, data: any } = JSON.parse(res.data);
          const { code, msg } = data;
          if (code === 200) {
            resolve(data.data);
          } else if (code === 400){
            Toast(msg);
            // 大小，类型，sha，其他错误
          } else if ([416, 417, 418, 500].includes(code)) {
            const failTextMap: { [key: string]: string} = {
              416: '大小超过限制',
              417: '不支持上传此类型',
              418: '已有相同文件',
              500: '服务异常'
            }
            Toast(failTextMap[code]);
          }
        }
      },
      fail() {
        reject();
      }
    });
  });
}

