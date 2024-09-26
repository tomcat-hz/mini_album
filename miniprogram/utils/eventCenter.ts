// eventCenter.ts  
class EventCenter {  
  private eventCallbacks: { [eventName: string]: Function[] } = {};  
  
  $on(eventName: string, callback: Function) {  
    if (!this.eventCallbacks[eventName]) {  
      this.eventCallbacks[eventName] = [];  
    }  
    this.eventCallbacks[eventName].push(callback);  
  }  
  
  $emit(eventName: string, data: any) {  
    if (this.eventCallbacks[eventName]) {  
      this.eventCallbacks[eventName].forEach(callback => {  
        callback(data);  
      });  
    }  
  }  
  
  $off(eventName: string, callback: Function) {  
    if (this.eventCallbacks[eventName]) {  
      const index = this.eventCallbacks[eventName].indexOf(callback);  
      if (index > -1) {  
        this.eventCallbacks[eventName].splice(index, 1);  
      }  
    }  
  }  
}  
  
// 创建一个全局的事件中心实例  
const eventCenter = new EventCenter();  
export default eventCenter;