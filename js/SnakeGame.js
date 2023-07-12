// Game Constants
const gameSound = new Audio("../music/music.mp3");
const gameOverSound = new Audio("../music/gameover.mp3");
const moveSound = new Audio("../music/move.mp3");
const foodSound = new Audio("../music/food.mp3");

// Game Variables
let inputDir = { x: 0, y: 0 };
let score = 0;
let speed = 5;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };

// Cached DOM Elements
const scoreBox = document.getElementById("scoreBox");
const hiscoreBox = document.getElementById("hiscoreBox");
const board = document.getElementById("board");

// Retrieve High Score from Local Storage
let hiscore = localStorage.getItem("hiscore");
let hiscoreval;

// Set Initial High Score
if (hiscore === null) {
  hiscoreval = 0;
  localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
} else {
  hiscoreval = JSON.parse(hiscore);
  hiscoreBox.textContent = "High Score: " + hiscore;
}

// Main Game Loop
function main(currTime) {
  window.requestAnimationFrame(main);

  const secondsSinceLastPaint = (currTime - lastPaintTime) / 1000;
  if (secondsSinceLastPaint < 1 / speed) {
    return;
  }

  lastPaintTime = currTime;
  gameEngine();
}

// Check if Snake Collides with Itself or Walls
function isCollide(snake) {
  const head = snake[0];

  if (head.x <= 0 || head.x >= 18 || head.y <= 0 || head.y >= 18) {
    return true; // If Snake Bumps Into Wall
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true; // If Snake Bumps Into Itself
    }
  }

  return false;
}

// Game Logic
function gameEngine() {
  if (isCollide(snakeArr)) {
    gameSound.pause();
    gameOverSound.play();
    inputDir = { x: 0, y: 0 };
    alert("Press Any Key to Play Again");
    gameSound.play();
    snakeArr = [{ x: 13, y: 15 }];
    score = 0;
  }

  if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
    foodSound.play();
    score += 1;

    if (score > hiscoreval) {
      hiscoreval = score;
      localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
      hiscoreBox.textContent = "High Score: " + hiscoreval;
    }

    scoreBox.textContent = "Score: " + score;
    snakeArr.unshift({
      x: snakeArr[0].x + inputDir.x,
      y: snakeArr[0].y + inputDir.y,
    });

    let validFood = false;

    while (!validFood) {
      let min = 2;
      let max = 16;
      food = {
        x: Math.floor(min + (max - min) * Math.random()),
        y: Math.floor(min + (max - min) * Math.random()),
      };

      validFood = snakeArr.every(
        (segment) => segment.x !== food.x || segment.y !== food.y
      );
    }
  }

  for (let i = snakeArr.length - 2; i >= 0; i--) {
    snakeArr[i + 1] = { ...snakeArr[i] };
  }

  snakeArr[0].x += inputDir.x;
  snakeArr[0].y += inputDir.y;

  board.innerHTML = "";

  snakeArr.forEach((segment, index) => {
    const snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = segment.y;
    snakeElement.style.gridColumnStart = segment.x;

    if (index === 0) {
      snakeElement.classList.add("head");
    } else {
      snakeElement.classList.add("snake");
    }

    board.appendChild(snakeElement);
  });

  const foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add("food");
  board.appendChild(foodElement);
}

// Event Listener for Keyboard Input
window.addEventListener("keydown", (event) => {
  inputDir = { x: 0, y: 1 };
  moveSound.play();

  switch (event.key) {
    case "ArrowUp":
      inputDir.x = 0;
      inputDir.y = -1;
      break;
    case "ArrowDown":
      inputDir.x = 0;
      inputDir.y = 1;
      break;
    case "ArrowLeft":
      inputDir.x = -1;
      inputDir.y = 0;
      break;
    case "ArrowRight":
      inputDir.x = 1;
      inputDir.y = 0;
      break;
    default:
      console.log("Invalid Input");
      break;
  }
});

// Start the Game Loop
hiscoreval = 0;
window.requestAnimationFrame(main);
