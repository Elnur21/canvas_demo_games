// setup
let c = document.querySelector(".gameBoard");
let scoreElement = document.querySelector("#score");
let bestScoreElement = document.querySelector("#bestScore");
bestScoreElement.innerHTML = localStorage.getItem("bestScore")
  ? localStorage.getItem("bestScore")
  : 0;
let bestScore = bestScoreElement.textContent;
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
  score,
  borders,
  maxTarget;

// setup
function gameSetup() {
  px = 0;
  py = 0;
  pw = 20;
  ph = 20;
  playing = true;
  directionX = 0;
  directionY = 0;
  maxTarget = 1;
  borders = [];
  playerArray = [new Square(px, py, pw, ph, "red")];
  targets = [new Circle(getRandomNumber(), getRandomNumber(), 10, "blue")];
  score = 0;
  scoreElement.innerHTML = score;
}
keys = {
  ArrowUp: 0,
  ArrowDown: 0,
  ArrowLeft: 0,
  ArrowRight: 0,
};

function getRandomNumber() {
  return Math.floor(Math.random() * 480);
}

c.addEventListener("click", (e) => {
  if (!playing) {
    if (
      e.clientX > window.innerWidth / 2 - 35 &&
      e.clientX < window.innerWidth / 2 + 35 &&
      e.clientY > 405 &&
      e.clientY < 475
    ) {
      gameSetup();
    }
  }
});

class Square {
  constructor(x, y, w, h, c) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;
  }
  draw() {
    ctx.fillStyle = this.c;
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
  requestAnimationFrame(animate);
  if (playing) {
    if (px > width - 10 || px < -10 || py < -10 || py > height - 10)
      playing = false;

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
    borders.forEach((border) => {
      border.draw();
      if (
        px > border.x &&
        px < border.x + 20 &&
        py > border.y &&
        py < border.y + 20
      ) {
        playing = false;
      }
    });
    targets.forEach((target) => {
      target.draw();
      if (
        px - target.x > -20 &&
        px - target.x < 20 &&
        py - target.y > -20 &&
        py - target.y < 20
      ) {
        score += 1;
        if (score != 0 && score % 2 == 0) {
          borders.push(
            new Square(getRandomNumber(), getRandomNumber(), pw, ph, "white")
          );
        } else if (score != 0 && score % 5 == 0) {
          targets.push(
            new Circle(getRandomNumber(), getRandomNumber(), 10, "blue")
          );
        }
        if (Number(bestScore) < score) bestScoreElement.innerHTML = score;
        scoreElement.innerHTML = score;
        target.remove();
        let firstPart = playerArray[0];
        playerArray.push(new Square(firstPart.x, firstPart.y, pw, ph, "red"));
        targets.push(
          new Circle(getRandomNumber(), getRandomNumber(), 10, "blue")
        );
      }
    });
  } else {
    let restartBtn = new Image();
    restartBtn.src = "./images/restart.png";
    ctx.drawImage(restartBtn, 215, 215, 70, 70);
    if (Number(bestScore) < score) localStorage.setItem("bestScore", score);
  }
}

function init() {
  gameSetup();
  animate();
}

init();

onkeydown = (d) => (keys[d.key] = 1);
onkeyup = (d) => (keys[d.key] = 0);