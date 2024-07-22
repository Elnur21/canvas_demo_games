let c = document.createElement("canvas");
c.classList.add("gameBoard");
c.width = window.innerWidth;
c.height = window.innerHeight;
document.body.appendChild(c);
let ctx = c.getContext("2d");

let points = Array.from({ length: 255 }, (_, i) => i + 1);
for (let i = points.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [points[i], points[j]] = [points[j], points[i]];
}

var noise = (x) => {
  x = x * 0.01;
  return lerp(points[Math.floor(x)], points[Math.ceil(x)], x - Math.floor(x));
};

let lerp = (a, b, t) => a + ((b - a) * (1 - Math.cos(t * Math.PI))) / 2;

// variables
let x = 0;
let y = 0;
let bgcolor = "#ff4301";
let forecolor = "#4a3f35";
let linecolor = "#2f2519";
let linewidth = 1;
let offset = -10;
let yRatio = 0.3;
let moving = 0;
let speed = 0;
let playing = true;

// player
let player = new (function () {
  this.x = c.width / 2;
  this.y = 50;
  this.truck = new Image();
  this.truck.src = "./images/015.png";
  this.rot = 0;
  this.ySpeed = 0;
  this.rSpeed = 0;

  this.draw = function () {
    let p1 = c.height * 0.9 - noise(this.x + moving) * yRatio;
    let p2 = c.height * 0.9 - noise(this.x + moving + 5) * yRatio;
    let ground = 0;
    let offset = 35;
    if (p1 - offset > this.y) {
      this.ySpeed += 0.1;
    } else {
      this.ySpeed -= this.y - (p1 - offset);
      this.y = p1 - offset;
      ground = 1;
    }

    if (!playing || (ground && Math.abs(this.rot) > Math.PI * 0.5)) {
      playing = false;
      this.x -= speed * 5;
      this.rSpeed = 5;

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "bold 30px Arial";
      ctx.fillStyle = "white";
      ctx.fillText("GAME OVER", c.width / 2, c.height / 3);
    }

    let angle = Math.atan2(p2 - offset - this.y, 5);

    if (ground && playing) {
      this.rot -= (this.rot - angle) * 0.5;
      this.rSpeed = this.rSpeed - (angle - this.rot);
    }

    this.rot -= this.rSpeed * 0.1;
    if (this.rot > Math.PI) this.rot = -Math.PI;
    if (this.rot < -Math.PI) this.rot = Math.PI;
    this.y += this.ySpeed;
    ctx.save();
    ctx.translate(this.x, this.y);

    // if(noise(this.x + moving)>noise(this.x + moving -1)){
    //     ctx.rotate(-this.rot);
    // }else{
    ctx.rotate(this.rot);
    // }
    ctx.drawImage(this.truck, -75, -40, 150, 80);
    ctx.restore();
  };
})();

function draw() {
  speed -= (speed - 1) * 0.01;
  moving += 5 * speed;

  //   background
  ctx.fillStyle = bgcolor;
  ctx.fillRect(x, y, c.width, c.height);

  //   ground
  ctx.strokeStyle = linecolor;
  ctx.lineWidth = linewidth;
  ctx.fillStyle = forecolor;
  ctx.beginPath();
  ctx.moveTo(offset, c.height - offset);
  for (let i = offset; i < c.width - offset; ++i) {
    ctx.lineTo(i, c.height * 0.9 - noise(i + moving) * yRatio);
  }
  ctx.lineTo(c.width - offset, c.height - offset);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  player.draw();
  requestAnimationFrame(draw);
}

draw();
