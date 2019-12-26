/*
 * @Date: 2019-12-23 10:28:01
 * @LastEditors  : 廖晨希
 * @Author: 廖晨希
 * @LastEditTime : 2019-12-26 11:03:28
 */
class Keyboard {
  constructor() {
    this.is_click = false;
    this.timer = null;
  }
  // 检测按键键位
  checkCode(config) {
    window.addEventListener("touchstart", e => {
      this.is_click = true;
      config.birdTime=0;
    });
    window.addEventListener("touchend", e => {
      this.is_click = false;
    });
  }
}
