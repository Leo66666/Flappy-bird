/*
 * @Date: 2019-12-23 10:28:01
 * @LastEditors  : 廖晨希
 * @Author: 廖晨希
 * @LastEditTime : 2019-12-26 11:51:14
 */
class Game {
  // 游戏初始化
  init() {
    this.util = new Util();
    this.keyBoard = new Keyboard();

    this.util.preloadSource(config.imgList, () => {
      this.config = Object.assign({}, config);
      this.creatCanvas();
      this.setStatus("preStart");
      this.creatBackground();
      this.createGround();
      this.preStart();
      this.bindEvent();
      this.keyBoard.checkCode(this.config);
      this.bird = new Bird({
        x: 50,
        y: (this.config.canvasHeight - 32) / 2,
        ctx: this.ctx
      });
    });
  }
  //游戏准备阶段
  preStart() {
    //小鸟不停切换三张图 然后下落抖动

    //绘制准备图片
    this.updateBg();

    //更新地板
    this.updateGround();

    this.createImg("getReady", "center", 100, 489, 143);
    // this.createImg('gameOver','center',100,497,145)
    this.createImg("bird0", "center", 240, 135, 91);
    this.createImg("click", "center", 330, 290, 172);

    this.preStartTimer = setTimeout(() => {
      this.preStart();
    }, 1000 / 60);
  }
  //游戏开始阶段
  play() {
    //要实现无线管道 先绘制几个试试
    this.createPipe();
    this.update();
    window.removeEventListener("click", this.fn, false);
  }
  //创建管道
  createPipe() {
    let width = this.config.canvasWidth;
    let pipeY = Math.floor(Math.random() * (550 - 200 + 1) + 200);
    let pipeY2 =
      512 - pipeY + Math.floor(Math.random() * (300 - 100 + 1) + 100);
    let tim = (Math.abs(270 - pipeY) / 320 + 1) * 2.7;

    if (
      this.config.pipeY &&
      Math.abs(this.config.pipeY - pipeY) > 200 &&
      Math.abs(this.config.pipeY2 - pipeY2) > 200
    ) {
      setTimeout(() => {
        //创建管道上
        this.config.pipes.push(
          new Pipe({
            img: config.imgList["pipetop"],
            x: width,
            y: -pipeY,
            ctx: this.ctx,
            direction: "top"
          })
        );

        //创建管道下
        this.config.pipes.push(
          new Pipe({
            img: config.imgList["pipebottom"],
            x: width,
            y: pipeY2,
            ctx: this.ctx,
            direction: "bottom"
          })
        );
      }, 500);
    } else {
      //创建管道上
      this.config.pipes.push(
        new Pipe({
          img: config.imgList["pipetop"],
          x: width,
          y: -pipeY,
          ctx: this.ctx,
          direction: "top"
        })
      );

      //创建管道下
      this.config.pipes.push(
        new Pipe({
          img: config.imgList["pipebottom"],
          x: width,
          y: pipeY2,
          ctx: this.ctx,
          direction: "bottom"
        })
      );
    }

    this.config.pipeY = pipeY;
    this.config.pipeY2 = pipeY2;

    this.pipeTimer = setTimeout(() => {
      this.createPipe();
    }, (1000 * tim) / 1.3);
  }
  //canvas初始化
  creatCanvas() {
    let canvas = document.querySelector("#game");
    let ctx = canvas.getContext("2d");
    this.config.canvasWidth = window.innerWidth;
    this.config.canvasHeight = window.innerHeight;
    this.ctx = ctx;
    canvas.width = this.config.canvasWidth;
    canvas.height = this.config.canvasHeight;
  }
  //创建背景图
  creatBackground() {
    let ctx = this.ctx;
    let bg = this.config.imgList["bg"];
    let width = this.config.canvasWidth;
    let height = this.config.canvasHeight;
    this.background1 = { x: 0 };
    this.background2 = { x: this.config.canvasWidth };

    ctx.drawImage(bg, this.background1.x, 0, width, height);
    ctx.drawImage(bg, this.background2.x, 0, width, height);
  }
  //绘制地板
  createGround() {
    let ctx = this.ctx;
    let ground = this.config.imgList["ground"];
    let height = this.config.canvasHeight;
    this.ground1 = { x: 0 };
    this.ground2 = { x: 840 };
    ctx.drawImage(ground, this.ground1.x, height - 281 / 2, 840, 281 / 2);
    ctx.drawImage(ground, this.ground2.x, height - 281 / 2, 840, 281 / 2);
  }
  //创建图片
  createImg(name, x, y, width, height) {
    let img = this.config.imgList[name];
    let scale = 1.5;
    if (x == "center") {
      x = (this.config.canvasWidth - width / scale) / 2;
    }
    this.ctx.drawImage(img, x, y, width / scale, height / scale);
  }
  //更新
  update() {
    let pipes = this.config.pipes;
    let groundY = this.config.canvasHeight - 281 / 2;
    this.config.birdTime++;
    this.updateBg();
    this.bird.draw(this.config.birdFrame);
    this.bird.move("down", this.config.birdTime);
    this.keyBoard.is_click ? this.bird.move("up", this.config.birdTime) : 0;
    this.config.birdFrame<60 ? this.config.birdFrame++ : this.config.birdFrame=0;

    this.playTimer = setTimeout(() => {
      this.update();
    }, 1000 / 60);

    // 小鸟碰撞检测
    if (this.bird.crash(groundY)) {
      this.setStatus("end");
    }
    //管道碰撞检测
    for (let i = pipes.length - 1; i >= 0; i--) {
      let item = pipes[i];
      item.draw();
      item.move();
      if (item.crash(this.bird)) {
        this.setStatus("end");
      }
      if (item.x <= -40) {
        this.config.pipes.splice(i, 1);
        item.direction == "top" ? this.config.gameScore++ : 0;
      }
    }
    this.updateGround();
    this.drawScore();
  }
  //更新背景图
  updateBg() {
    let ctx = this.ctx;
    let width = this.config.canvasWidth;
    let height = this.config.canvasHeight;
    ctx.clearRect(0, 0, this.config.canvasWidth, this.config.canvasHeight);

    //更新背景
    let bg = this.config.imgList["bg"];
    this.background1.x = this.background1.x - 1;
    this.background2.x = this.background2.x - 1;
    ctx.drawImage(bg, this.background1.x, 0, width, height);
    ctx.drawImage(bg, this.background2.x, 0, width, height);

    // 判断是否到达边界
    if (this.background1.x <= -width) {
      this.background1.x = width;
    }
    if (this.background2.x <= -width) {
      this.background2.x = width;
    }
  }
  //更新地板
  updateGround() {
    let ground = this.config.imgList["ground"];
    let groundY = this.config.canvasHeight - 281 / 2;
    this.ground1.x = this.ground1.x - 1;
    this.ground2.x = this.ground2.x - 1;
    this.ctx.drawImage(ground, this.ground1.x, groundY, 840, 281 / 2);
    this.ctx.drawImage(ground, this.ground2.x, groundY, 840, 281 / 2);

    if (this.ground1.x <= -840) {
      this.ground1.x = 840;
    }
    if (this.ground2.x <= -840) {
      this.ground2.x = 840;
    }
  }
  //绘制分数
  drawScore() {
    let ctx = this.ctx;
    ctx.font = "18px Arial";
    ctx.textBaseline = "bottom";
    ctx.fillStyle = "white";
    ctx.fillText(
      "分数: " + this.config.gameScore,
      this.config.canvasWidth - 80,
      40
    );
  }
  //设置游戏状态
  setStatus(status = "loading") {
    if (status == "end") {
      document.querySelector(".container-modal").style.display = "block";
      document.querySelector(".modal-score").innerHTML = this.config.gameScore;
      clearTimeout(this.playTimer);
    }
    this.config.status = status;
  }
  //事件绑定
  bindEvent(e) {
    window.addEventListener("click", this.fn, false);
  }
  //解除addeventlistener
  fn() {
    game.setStatus("play");
    clearTimeout(game.preStartTimer);
    game.play();
  }
}
let game = new Game();
game.init();
