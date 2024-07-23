// mobile check

// setup
let c = document.createElement("canvas");
c.classList.add("gameBoard");
let width = window.innerWidth;
let height = window.innerHeight;
c.width = window.innerWidth;
c.height = window.innerHeight;
document.body.appendChild(c);
let ctx = c.getContext("2d");

let rotate = 0;
let bullets, enemies, maxenemy;
let shootControl = false;
let playing = true;

ctx.clearRect(0, 0, c.width, c.height);

class Circle {
  constructor(bx, by, tx, ty, r, c, s, type) {
    this.bx = bx;
    this.by = by;
    this.x = bx;
    this.y = by;
    this.r = r;
    this.c = c;
    this.tx = tx;
    this.ty = ty;
    this.speed = s;
    this.type = type;
  }
  draw() {
    ctx.fillStyle = this.c;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  }
  update() {
    let dx = this.tx - this.bx;
    let dy = this.ty - this.by;
    let dist = Math.sqrt(dx * dx + dy * dy);
    this.x += (dx / dist) * this.speed;
    this.y += (dy / dist) * this.speed;
  }
  remove() {
    if (this.x < 0 || this.x > width) {
      if (this.type == "bullet") {
        bullets.splice(bullets.indexOf(this), 1);
      } else {
        enemies.splice(enemies.indexOf(this), 1);
      }
    }
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
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = this.c;
    ctx.beginPath();
    ctx.arc(0, 0, this.r, 0, 2 * Math.PI);
    if (k.ArrowLeft == 1) {
      rotate -= (5 * Math.PI) / 180;
    }
    if (k.ArrowRight == 1) {
      rotate += (5 * Math.PI) / 180;
    }
    ctx.rotate(rotate);
    ctx.fillRect(0, -(this.r * 0.4), this.r + 20, this.r * 0.8);
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }
}

let player;
const k = {
  ArrowUp: 0,
  ArrowLeft: 0,
  ArrowRight: 0,
};

function addEnemy() {
  for (let i = enemies.length; i < maxenemy; i++) {
    let radius = Math.random() * 30 + 10;
    let speed = radius > 20 ? 0.5 : 2;
    let x, y;
    if (Math.random() < 0.5) {
      x = Math.random() > 0.5 ? width : 0;
      y = Math.random() * height;
    } else {
      x = Math.random() * width;
      y = Math.random() > 0.5 ? height : 0;
    }
    enemies.push(
      new Circle(
        x,
        y,
        player.x,
        player.y,
        radius,
        `hsl(${Math.random() * 360},80%,50%)`,
        speed,
        "enemy"
      )
    );
  }
}

function collision(x1, y1, r1, x2, y2, r2) {
  let dx = x1 - x2;
  let dy = y1 - y2;
  let dist = Math.sqrt(dx * dx + dy * dy);
  if (dist < r1 + r2) {
    return true;
  }
  return false;
}

function animate() {
  if (playing) {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, width, height);

    if (k.ArrowUp == 1 && !shootControl) {
      let tx = player.x + Math.cos(rotate) * 1000;
      let ty = player.y + Math.sin(rotate) * 1000;
      bullets.push(
        new Circle(player.x, player.y, tx, ty, 5, "blue", 5, "bullet")
      );
      shootControl = true;
    } else if (k.ArrowUp == 0) {
      shootControl = false;
    }

    enemies.forEach((enemy) => {
      if (collision(enemy.x, enemy.y, enemy.r, player.x, player.y, player.r)) {
        console.log("game over");
        playing = false;
      }
      enemy.remove();
      addEnemy();
      enemy.update();
      enemy.draw();
    });

    bullets.forEach((bullet) => {
      bullet.remove();
      bullet.update();
      bullet.draw();
      enemies.forEach((enemy) => {
        if (
          collision(enemy.x, enemy.y, enemy.r, bullet.x, bullet.y, bullet.r)
        ) {
          bullets.splice(bullets.indexOf(bullet), 1);
          enemies.splice(enemies.indexOf(enemy), 1);
        }
      });
    });

    player.draw();
  }
}

function init() {
  bullets = [];
  enemies = [];
  maxenemy = 4;
  player = new Player(width / 2, height / 2, 20, "white");
  addEnemy();
  animate();
}

init();

onkeydown = (d) => (k[d.key] = 1);
onkeyup = (d) => (k[d.key] = 0);
