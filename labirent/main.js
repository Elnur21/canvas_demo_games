const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Define the size of the grid
const gridSize = 25;
const cols = canvas.width / gridSize;
const rows = canvas.height / gridSize;

// Create a 2D array to represent the maze
let maze = [];
for (let y = 0; y < rows; y++) {
  maze[y] = [];
  for (let x = 0; x < cols; x++) {
    maze[y][x] = {
      x: x,
      y: y,
      walls: [true, true, true, true], // top, right, bottom, left
      visited: false,
    };
  }
}

// Define start and end points
const start = maze[0][0];
const end = maze[rows - 1][cols - 1];

let currentCell = start;
currentCell.visited = true;

// Player object
let player = {
  x: start.x,
  y: start.y,
};

function drawMaze() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let cell = maze[y][x];
      let xPos = cell.x * gridSize;
      let yPos = cell.y * gridSize;

      ctx.beginPath();
      if (cell.walls[0])
        ctx.moveTo(xPos, yPos), ctx.lineTo(xPos + gridSize, yPos);
      if (cell.walls[1])
        ctx.moveTo(xPos + gridSize, yPos),
          ctx.lineTo(xPos + gridSize, yPos + gridSize);
      if (cell.walls[2])
        ctx.moveTo(xPos + gridSize, yPos + gridSize),
          ctx.lineTo(xPos, yPos + gridSize);
      if (cell.walls[3])
        ctx.moveTo(xPos, yPos + gridSize), ctx.lineTo(xPos, yPos);
      ctx.stroke();
    }
  }

  // Draw start and end points
  ctx.fillStyle = "green";
  ctx.fillRect(start.x * gridSize, start.y * gridSize, gridSize, gridSize);

  ctx.fillStyle = "red";
  ctx.fillRect(end.x * gridSize, end.y * gridSize, gridSize, gridSize);

  // Draw player
  ctx.fillStyle = "blue";
  ctx.fillRect(player.x * gridSize, player.y * gridSize, gridSize, gridSize);
}

// Helper function to get unvisited neighbors
function getUnvisitedNeighbors(cell) {
  let neighbors = [];

  let top = maze[cell.y - 1] ? maze[cell.y - 1][cell.x] : undefined;
  let right = maze[cell.y][cell.x + 1];
  let bottom = maze[cell.y + 1] ? maze[cell.y + 1][cell.x] : undefined;
  let left = maze[cell.y][cell.x - 1];

  if (top && !top.visited) neighbors.push(top);
  if (right && !right.visited) neighbors.push(right);
  if (bottom && !bottom.visited) neighbors.push(bottom);
  if (left && !left.visited) neighbors.push(left);

  return neighbors;
}

// Recursive backtracking algorithm to generate the maze
let stack = [];

function generateMaze() {
  drawMaze();

  let nextCell = getUnvisitedNeighbors(currentCell);
  if (nextCell.length > 0) {
    let next = nextCell[Math.floor(Math.random() * nextCell.length)];
    stack.push(currentCell);

    // Remove walls between current cell and next cell
    if (next.y < currentCell.y) {
      currentCell.walls[0] = false;
      next.walls[2] = false;
    } else if (next.x > currentCell.x) {
      currentCell.walls[1] = false;
      next.walls[3] = false;
    } else if (next.y > currentCell.y) {
      currentCell.walls[2] = false;
      next.walls[0] = false;
    } else if (next.x < currentCell.x) {
      currentCell.walls[3] = false;
      next.walls[1] = false;
    }

    currentCell = next;
    currentCell.visited = true;
  } else if (stack.length > 0) {
    currentCell = stack.pop();
  }

  if (stack.length > 0) {
    requestAnimationFrame(generateMaze);
  } else {
    drawMaze();
  }
}

// Move player
document.addEventListener("keydown", (event) => {
  const key = event.key;
  let newX = player.x;
  let newY = player.y;

  if (key === "ArrowUp") newY--;
  if (key === "ArrowRight") newX++;
  if (key === "ArrowDown") newY++;
  if (key === "ArrowLeft") newX--;

  if (newX >= 0 && newX < cols && newY >= 0 && newY < rows) {
    let playerCell = maze[player.y][player.x];

    // Check if the player can move to the new cell
    if (
      (newY < player.y && !playerCell.walls[0]) ||
      (newX > player.x && !playerCell.walls[1]) ||
      (newY > player.y && !playerCell.walls[2]) ||
      (newX < player.x && !playerCell.walls[3])
    ) {
      player.x = newX;
      player.y = newY;
    }
  }

  drawMaze();
});

// Generate the maze and draw the initial state
generateMaze();
