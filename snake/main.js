// setup
let c = document.querySelector(".gameBoard");
let width = 500;
let height = 500;
c.width = width;
c.height = height;
let ctx = c.getContext("2d");

let px,
  py,
  pw,
  ph,
  directionX,
  directionY,
  playerArray,
  keys,
  playing,
  targets,
  maxTarget;

// setup
px = 0;
py = 0;
pw = 20;
ph = 20;
playing = true;
directionX = 0;
directionY = 0;
maxTarget = 1;
playerArray = [];
keys = {
  ArrowUp: 0,
  ArrowDown: 0,
  ArrowLeft: 0,
  ArrowRight: 0,
};

function getRandomNumber() {
  return Math.floor(Math.random() * 480);
}

class Square {
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

class Circle {
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
  update(x, y) {
    this.x = x;
    this.y = y;
  }
  remove() {
    targets.splice(targets.indexOf(this), 1);
  }
}

let direction = "";
function animate() {
  if (keys.ArrowUp == 1) {
    directionX = 0;
    directionY = -1;
  } else if (keys.ArrowDown == 1) {
    directionX = 0;
    directionY = 1;
  } else if (keys.ArrowLeft == 1) {
    directionX = -1;
    directionY = 0;
  } else if (keys.ArrowRight == 1) {
    directionX = 1;
    directionY = 0;
  }

  px += directionX * 4;
  py += directionY * 4;
  if (px > width - 20 || px < 0 || py < 0 || py > height - 20) playing = false;
  if (playing) {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, width, height);

    let prevX = px;
    let prevY = py;
    playerArray.forEach((square, index) => {
      if (index === 0) {
        square.update(px, py);
      } else {
        let tempX = square.x;
        let tempY = square.y;
        square.update(prevX, prevY);
        prevX = tempX;
        prevY = tempY;
      }
      square.draw();
    });
    targets.forEach((target) => {
      target.draw();
      if (
        px - target.x > -20 &&
        px - target.x < 20 &&
        py - target.y > -20 &&
        py - target.y < 20
      ) {
        target.remove();
        let firstPart = playerArray[0];
        playerArray.push(new Square(firstPart.x, firstPart.y, pw, ph));
        targets.push(
          new Circle(getRandomNumber(), getRandomNumber(), 10, "blue")
        );
      }
    });
  }
}

function init() {
  targets = [];
  for (var i = 0; i < maxTarget; i++) {
    targets.push(new Circle(getRandomNumber(), getRandomNumber(), 10, "blue"));
  }
  playerArray.push(new Square(px, py, pw, ph));
  playerArray.push(new Square(px, py, pw, ph));
  playerArray.push(new Square(px, py, pw, ph));
  playerArray.push(new Square(px, py, pw, ph));
  playerArray.push(new Square(px, py, pw, ph));
  playerArray.push(new Square(px, py, pw, ph));
  playerArray.push(new Square(px, py, pw, ph));
  playerArray.push(new Square(px, py, pw, ph));
  playerArray.push(new Square(px, py, pw, ph));
  playerArray.push(new Square(px, py, pw, ph));
  animate();
}

init();

onkeydown = (d) => (keys[d.key] = 1);
onkeyup = (d) => (keys[d.key] = 0);
