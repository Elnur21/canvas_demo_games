// mobile check
let isMobile = false;
(function (a) {
  if (
    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
      a
    ) ||
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
      a.substr(0, 4)
    )
  )
    isMobile = true;
})(navigator.userAgent || navigator.vendor || window.opera);

// setup
let c = document.createElement("canvas");
c.classList.add("gameBoard");
c.width = window.innerWidth;
c.height = window.innerHeight;
document.body.appendChild(c);
let ctx = c.getContext("2d");

const form = document.getElementById("changeCarForm");
// Get all the radio buttons with the name 'car'
const radios = document.querySelectorAll('input[name="car"]');

// Add event listeners to each radio button
radios.forEach((radio) => {
  radio.addEventListener("change", () => {
    // Get the value of the selected radio button
    const selectedValue = document.querySelector(
      'input[name="car"]:checked'
    ).value;
    localStorage.setItem("car", selectedValue);

    window.location.reload();
  });
});

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
let car = localStorage.getItem("car") ? localStorage.getItem("car") : "07";
let carHeights = {
  "015": 80,
  "07": 80,
  niva: 100,
};
let carWidths = {
  "015": 150,
  "07": 170,
  niva: 130,
};
let x = 0;
let y = 0;
let bgcolor = "aquamarine";
let forecolor = "#4a3f35";
let linecolor = "#2f2519";
let linewidth = 1;
let offset = -10;
let yRatio = 0.3;
let moving = 0;
let speed = 0;
let playing = true;
const k = {
  ArrowUp: 0,
  ArrowLeft: 0,
  ArrowRight: 0,
};

// player
let player = new (function () {
  this.x = c.width / 2;
  this.y = 50;
  this.truck = new Image();
  this.truck.src = `./images/${car}.png`;
  this.rot = 0;
  this.ySpeed = 0;
  this.rSpeed = 0;

  // interface
  this.startBtn = new Image();
  this.startBtn.src = "./images/pause.png";
  this.leftBtn = new Image();
  this.leftBtn.src = "./images/left.png";
  this.rightBtn = new Image();
  this.rightBtn.src = "./images/right.png";
  this.gasBtn = new Image();
  this.gasBtn.src = "./images/gas.png";
  this.pauseBtn = new Image();
  this.pauseBtn.src = "./images/resume.png";

  this.drawInterFace = function () {
    // buttons draw
    if (playing) {
      if (isMobile) {
        ctx.drawImage(this.leftBtn, 20, c.height - 90, 70, 70);
        ctx.drawImage(this.rightBtn, 110, c.height - 90, 70, 70);
        ctx.drawImage(this.gasBtn, c.width - 90, c.height - 90, 70, 70);
      }
    } else {
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "bold 30px Arial";
      ctx.fillStyle = "white";
      ctx.fillText("GAME OVER", c.width / 2, c.height / 3);
      ctx.drawImage(this.startBtn, c.width / 2 - 25, c.height / 3 + 50, 50, 50);
    }
  };
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
    }

    let angle = Math.atan2(p2 - offset - this.y, 5);

    if (ground && playing) {
      this.rot -= (this.rot - angle) * 0.5;
      this.rSpeed = this.rSpeed - (angle - this.rot);
    }

    this.rSpeed += (k.ArrowLeft - k.ArrowRight) * 0.05;
    // this.rot -= this.rSpeed * 0.1;

    this.rot -= this.rSpeed * 0.1;
    if (this.rot > Math.PI) this.rot = -Math.PI;
    if (this.rot < -Math.PI) this.rot = Math.PI;
    this.y += this.ySpeed;

    // player draw
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    ctx.drawImage(this.truck, -75, -40, carWidths[car], carHeights[car]);
    ctx.restore();
  };
})();

function draw() {
  speed -= (speed - k.ArrowUp) * 0.01;
  moving += 10 * speed;

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
  player.drawInterFace();
  requestAnimationFrame(draw);
}

draw();

if (isMobile) {
  // mobile control
  c.addEventListener("touchstart", handleStart, false);
  c.addEventListener("touchend", handleEnd, false);

  function handleStart(e) {
    e.preventDefault();
    let touches = e.changedTouches;
    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
      checkControlButtons(touch.pageX, touch.screenY);
    }
  }

  function handleEnd(e) {
    e.preventDefault();
    let touches = e.changedTouches;
    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
    }
  }
} else {
  // desktop control
  onkeydown = (d) => (k[d.key] = 1);
  onkeyup = (d) => (k[d.key] = 0);

  c.addEventListener("click", handleClick, false);
  function handleClick(e) {
    e.preventDefault();
    checkControlButtons(e.clientX, e.clientY);
  }
}

window.onresize = function () {
  window.location.reload();
};

function checkControlButtons(x, y) {
  console.log(x, y);
  let restartY1 = isMobile ? 150 : -50;
  let restartY2 = isMobile ? 200 : 0;
  if (
    !playing &&
    x > c.width / 2 - 25 &&
    x < c.width / 2 + 25 &&
    y > c.height / 3 + restartY1 &&
    y < c.height / 3 + restartY2
  ) {
    window.location.reload();
  }
  if (playing && x > 20 && x < 90 && y > c.height - 90 && y < c.height - 20) {
    console.log("sol");
  }
  if (playing && x > 110 && x < 180 && y > c.height - 90 && y < c.height - 20) {
    console.log("sag");
  }
  if (
    playing &&
    x > c.width - 90 &&
    x < c.width - 20 &&
    y > c.height - 90 &&
    y < c.height - 20
  ) {
    console.log("gas");
  }
}
