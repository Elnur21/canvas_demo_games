// setup
let c = document.querySelector(".gameBoard");
let width = 500;
let height = 500;
c.width = width;
c.height = height;
let ctx = c.getContext("2d");

let px, py, pw, ph, directionX, directionY, player, keys, playing, targets;

// setup
px = 0;
py = 0;
pw = 20;
ph = 20;
playing = true;
directionX = 0;
directionY = 0;
keys = {
  ArrowUp: 0,
  ArrowDown: 0,
  ArrowLeft: 0,
  ArrowRight: 0,
};

class Player {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  draw() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
  update(x, y) {
    this.x = x;
    this.y = y;
  }
}

player = new Player(px, py, pw, ph);

function animate() {
  if (keys.ArrowUp == 1) {
    directionX = 0;
    directionY = -1;
  }
  if (keys.ArrowDown == 1) {
    directionX = 0;
    directionY = 1;
  }
  if (keys.ArrowLeft == 1) {
    directionX = -1;
    directionY = 0;
  }
  if (keys.ArrowRight == 1) {
    directionX = 1;
    directionY = 0;
  }

  px += directionX;
  py += directionY;
  if (playing) {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, width, height);
    player.draw();
    player.update(px, py);
  }
}

function init() {
  animate();
}

init();

onkeydown = (d) => (keys[d.key] = 1);
onkeyup = (d) => (keys[d.key] = 0);
