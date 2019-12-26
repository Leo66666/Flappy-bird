/*
 * @Date: 2019-12-23 10:28:01
 * @LastEditors  : 廖晨希
 * @Author: 廖晨希
 * @LastEditTime : 2019-12-26 11:53:49
 */
class Bird {
  constructor({ x, y, ctx }) {
    this.x = x;
    this.y = y;
    this.ctx = ctx;
  }
  // 绘制小鸟
  draw(birdFrame) {
    let img;
    if(birdFrame>=0 && birdFrame<=20){
      img = config.imgList["bird1"];
    }else if(birdFrame>20 && birdFrame<=40){
      img = config.imgList["bird2"];
    }else if(birdFrame>40 && birdFrame<=60){
      img = config.imgList["bird3"];
    }
    this.ctx.drawImage(img, this.x, this.y);
  }
  //垂直移动
  move(direction='down',time) {
    //计算下落速度 v=gt 下落速度=重力加速度*时间
    if(direction == "down"){
      this.y +=time/70*9.8
    }else{
      this.y>=0 ? this.y -= 1.6*6 : 0;
    }
  }
  crash(y){
    if(this.y+27>=y){
      return true;
    }
    return false;
  }
}
