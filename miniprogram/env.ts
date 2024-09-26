// @ts-ignore
const envVersion = __wxConfig.envVersion;

export const cosUrl = "https://cos.tomcat.website";
export const cdnUrl = "https://cdn.tomcat.website";

let baseUrl = 'http://127.0.0.1:8081';      // 开发环境
// let baseUrl = 'https://api.we-hub.cn'; // 正式环境
// let baseUrl = 'http://192.168.50.150:8081';    // 测试环境

// let baseUrl = 'https://api.tomcat.website';    // 测试环境
if (envVersion === 'trial') {
  baseUrl = 'https://api.we-hub.cn';
} else if (envVersion === 'production') {
  baseUrl = 'https://api.we-hub.cn';
}

export default baseUrl;