const gameArea = document.getElementById("gameArea");
const player = document.getElementById("player");
const scoreElement = document.getElementById("score");

let playerX = 50;
let playerY = 0;
let jumping = false;
let score = 0;
let gameOver = false;

// Movimiento con teclado
document.addEventListener("keydown", (e) => {
  if (gameOver) return;
  if (e.key === "ArrowLeft") moveLeft();
  if (e.key === "ArrowRight") moveRight();
  if (e.key === " " || e.key === "ArrowUp") jump();
});

// Movimiento con botones táctiles
document.getElementById("left").addEventListener("click", moveLeft);
document.getElementById("right").addEventListener("click", moveRight);
document.getElementById("jump").addEventListener("click", jump);

function moveLeft() {
  if (playerX > 0) playerX -= 40;
  player.style.left = playerX + "px";
}

function moveRight() {
  if (playerX < 535) playerX += 40;
  player.style.left = playerX + "px";
}

function jump() {
  if (jumping) return;
  jumping = true;
  let jumpHeight = 0;
  const up = setInterval(() => {
    if (jumpHeight >= 180) {
      clearInterval(up);
      const down = setInterval(() => {
        if (jumpHeight <= 0) {
          clearInterval(down);
          jumping = false;
        }
        jumpHeight -= 15;
        player.style.bottom = jumpHeight + "px";
      }, 20);
    }
    jumpHeight += 15;
    player.style.bottom = jumpHeight + "px";
  }, 20);
}

// Crear obstáculos
function createObstacle() {
  if (gameOver) return;

  const obstacle = document.createElement("div");
  obstacle.classList.add("obstacle");
  obstacle.style.right = "0px";
  gameArea.appendChild(obstacle);

  let obstacleX = 0;
  const move = setInterval(() => {
    if (gameOver) {
      clearInterval(move);
      return;
    }
    obstacleX += 13;
    obstacle.style.right = obstacleX + "px";

    // Posiciones para colisión
    const obstacleLeft = 600 - obstacleX -65;
    const playerBottom = parseInt(player.style.bottom) || 0;

    if (
      obstacleLeft < playerX + 65 &&
      obstacleLeft + 70 > playerX &&
      playerBottom < 65
    ) {
      alert("💀 ¡Game Over! Tu puntuación: " + score);
      gameOver = true;
      location.reload();
    }

    if (obstacleX > 640) {
      clearInterval(move);
      obstacle.remove();
      score++;
      scoreElement.textContent = score;
    }
  }, 30);

  setTimeout(createObstacle, 2400 + Math.random() * 2400);
}

createObstacle();