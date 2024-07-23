// setup
let c = document.createElement("canvas");
c.classList.add("gameBoard");
let width = window.innerWidth;
let height = window.innerHeight;
c.width = window.innerWidth;
c.height = window.innerHeight;
document.body.appendChild(c);
let ctx = c.getContext("2d");

let px, py, pw, ph, player, bx, by, bs, g, playing, ball;

// setup
px = width * 0.5;
py = height * 0.75;
pw = 100;
ph = 200;
bx = px;
by = height * 0.2;
bs = 0;
g = 0;
playing = true;

c.addEventListener("mousemove", (e) => {
  let x = e.clientX;
  if (x > width - pw) px = width - pw;
  else px = x;
});

class Player {
  constructor(px, py, pw, ph, c) {
    this.x = px;
    this.y = py;
    this.width = pw;
    this.height = ph;
    this.color = c;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  update(px) {
    this.x = px;
  }
}

class Circle {
  constructor(bx, by, r, c, s) {
    this.x = bx;
    this.y = by;
    this.r = r;
    this.c = c;
    this.speed = s;
  }
  draw() {
    ctx.fillStyle = this.c;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  }
  update(x, y) {
    this.y = y;
    this.x = x;
  }
}

player = new Player(px, py, pw, ph, "white");
ball = new Circle(bx, by, 30, "red", 10);

function animate() {
  if (playing) {
    if (bx > px && bx < px + pw && by + 15 >= py) {
      //   playing = false;
      g -= Math.random() * 5;
      bs += Math.floor(Math.random() * 11) - 5;
    } else {
      g += 0.05;
    }
    by += g;
    bx += bs;
    ctx.clearRect(0, 0, width, height);
    requestAnimationFrame(animate);
    player.draw();
    player.update(px);
    ball.draw();
    ball.update(bx, by);
  }
}

function init() {
  animate();
}

init();
