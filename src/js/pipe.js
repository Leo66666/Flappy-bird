/*
 * @Date: 2019-12-23 10:28:01
 * @LastEditors  : 廖晨希
 * @Author: 廖晨希
 * @LastEditTime : 2019-12-26 11:13:48
 */
class Pipe {
  constructor({ x, y, ctx ,img,direction}) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.ctx = ctx;
    this.direction=direction
  }
  // 绘制管道
  draw() {
    //管道分为上下之分
    this.ctx.drawImage(this.img, this.x, this.y);
  }
  //水平移动
  move() {
   this.x-=1;
  }
  // 碰撞检测
  crash(bird){
    if(bird.x+40>=this.x && bird.x<=this.x+40){
      //上位碰撞
      if(this.direction=='top'){
        if(bird.y<=this.y+512-10){
          console.log(this.x,bird.x,this.y,bird.y)
          return true;
        }
      }   
      //上位碰撞
      if(this.direction=='bottom'){
        if(bird.y>=this.y-20){
          console.log(this.x,bird.x,this.y,bird.y)
          return true;
        }
      }
    }
    return false;
  }
}
