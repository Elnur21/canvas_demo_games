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

ctx.clearRect(0, 0, c.width, c.height);

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

// ctx.fillStyle = "white";
// ctx.arc(100, 100, 20, 0, Math.PI * 2);
// ctx.fillRect(100, 95, 30, 10);
// ctx.fill();
let player;
const k = {
  ArrowUp: 0,
  ArrowLeft: 0,
  ArrowRight: 0,
};

function animate() {
  requestAnimationFrame(animate);
  ctx.fillRect(0, 0, width, height);
  player.draw();
}

function init() {
  player = new Player(width / 2, height / 2, 20, "red");
  animate();
}

init();

onkeydown = (d) => (k[d.key] = 1);
onkeyup = (d) => (k[d.key] = 0);
