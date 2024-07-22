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

function draw() {
  speed -= (speed - 1) * 0.01;
  moving += 5 * speed;

  ctx.fillStyle = bgcolor;
  ctx.fillRect(x, y, c.width, c.height);

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
  requestAnimationFrame(draw);
}

draw();
