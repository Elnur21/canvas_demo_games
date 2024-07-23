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
let bullets;
let shootControl = false;

ctx.clearRect(0, 0, c.width, c.height);

c.addEventListener("click", (e) => {});

class Circle {
  constructor(bx, by, tx, ty, r, c, s) {
    this.bx = bx;
    this.by = by;
    this.x = bx;
    this.y = by;
    this.r = r;
    this.c = c;
    this.tx = tx;
    this.ty = ty;
    this.speed = s;
  }
  draw() {
    ctx.fillStyle = this.c;
    ctx.beginPath();
    console.log(rotate);
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
      bullets.splice(bullets.indexOf(this), 1);
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

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, width, height);
  player.draw();

  if (k.ArrowUp == 1 && !shootControl) {
    let tx = player.x + Math.cos(rotate) * 1000;
    let ty = player.y + Math.sin(rotate) * 1000;
    bullets.push(new Circle(player.x, player.y, tx, ty, 5, "blue", 5));
    shootControl = true;
  } else if (k.ArrowUp == 0) {
    shootControl = false;
  }

  bullets.forEach((bullet) => {
    bullet.remove();
    bullet.update();
    bullet.draw();
  });
}

function init() {
  bullets = [];
  player = new Player(width / 2, height / 2, 20, "red");
  animate();
}

init();

onkeydown = (d) => (k[d.key] = 1);
onkeyup = (d) => (k[d.key] = 0);
