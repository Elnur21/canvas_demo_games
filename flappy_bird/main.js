let canvas = document.querySelector(".gameBoard");

let width = 400;
let height = 600;
canvas.width = width;
canvas.height = height;
let ctx = canvas.getContext("2d");

let enemies = [];

class Enemy {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.first = this.height;
    this.second = this.height + 100;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fillRect(this.x, this.height + 100, this.width, height - this.height);
  }
  update() {
    this.x -= 0.5;
  }
  remove() {
    enemies.splice(enemies.indexOf(this), 1);
  }
}

class Player {
  constructor(x, y, r, c) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.c = c;
  }
  draw() {
    ctx.fillStyle = this.c;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  }
  update(y) {
    this.y = y;
  }
}

const getRandom = () => {
  return Math.random() * 10 * 50;
};

//setup
let playing = true;
let playerY = height / 2 - 10;
let player = new Player(40, playerY, 10, "white");
let enemy = new Enemy(110, 0, 50, getRandom(), "red");
console.log(enemy);
enemies.push(enemy);

function animate() {
  requestAnimationFrame(animate);
  if (playing) {
    playerY += 0.5;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "blue";
    ctx.fillRect(0, 0, width, height);
    enemies.forEach((enemy) => {
      enemy.draw();
      enemy.update();
      if (enemy.x < 0) {
        enemy.remove();
        enemies.push(new Enemy(width, 0, 50, getRandom(), "red"));
      }
      if (
        player.x >= enemy.x &&
        (player.y <= enemy.first || player.y >= enemy.second)
      ) {
        playing = false;
      }
    });
    player.draw();
    player.update(playerY);
    if(playerY>=height || playerY<=0){
      playing = false;
    }
  }
}

canvas.addEventListener("click", (e) => {
  playerY -= 20;
});

animate();
