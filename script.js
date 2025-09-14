const menu = document.getElementById("menu");
const startBtn = document.getElementById("startBtn");
const scoresBtn = document.getElementById("scoresBtn");
const gameArea = document.getElementById("gameArea");
const scorePanel = document.getElementById("scorePanel");
const controls = document.getElementById("controls");
const scoresPanel = document.getElementById("scoresPanel");
const scoresList = document.getElementById("scoresList");
const backBtn = document.getElementById("backBtn");

const player = document.getElementById("player");
const scoreElement = document.getElementById("score");

let playerX = 50;
let jumping = false;
let score = 0;
let gameOver = false;
let scores = [];
let obstacleInterval = null;

// Mostrar menú de inicio
function showMenu() {
  menu.style.display = "";
  gameArea.style.display = "none";
  scorePanel.style.display = "none";
  controls.style.display = "none";
  scoresPanel.style.display = "none";
}

// Iniciar juego
function startGame() {
  menu.style.display = "none";
  gameArea.style.display = "";
  scorePanel.style.display = "";
  controls.style.display = "";
  scoresPanel.style.display = "none";
  score = 0;
  scoreElement.textContent = score;
  gameOver = false;
  playerX = 50;
  player.style.left = playerX + "px";
  removeObstacles();
setTimeout(createObstacle,1000);
}

// Mostrar puntajes
function showScores() {
  menu.style.display = "none";
  scoresPanel.style.display = "";
  scoresList.innerHTML = "";
  scores.forEach((s, i) => {
    const li = document.createElement("li");
    li.textContent = `Intento ${i + 1}: ${s} puntos`;
    scoresList.appendChild(li);
  });
}

// Volver al menú desde puntajes
backBtn.onclick = showMenu;
startBtn.onclick = startGame;
scoresBtn.onclick = showScores;

// Movimiento con botones táctiles
document.getElementById("left").addEventListener("click", moveLeft);
document.getElementById("right").addEventListener("click", moveRight);
document.getElementById("jump").addEventListener("click", jump);

// Movimiento con teclado
document.addEventListener("keydown", (e) => {
  if (gameOver) return;
  if (e.key === "ArrowLeft") moveLeft();
  if (e.key === "ArrowRight") moveRight();
  if (e.key === " " || e.key === "ArrowUp") jump();
});

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

// Eliminar obstáculos existentes
function removeObstacles() {
  document.querySelectorAll(".obstacle").forEach(o => o.remove());
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
      obstacle.remove();
      return;
    }
    obstacleX += 13;
    obstacle.style.right = obstacleX + "px";

    // Colisión
    const obstacleLeft = 600 - obstacleX - 70;
    const playerBottom = parseInt(player.style.bottom) || 0;
    if (
      obstacleLeft < playerX + 65 &&
      obstacleLeft + 70 > playerX &&
      playerBottom < 65
    ) {
      clearInterval(move);
      gameOver = true;
      scores.push(score);
      setTimeout(() => {
        showMenu();
        alert("💀 ¡Game Over! Tu puntuación: " + score);
      }, 100);
      return;
    }

    // Eliminar obstáculo y sumar puntaje
    if (obstacleX > 640) {
      clearInterval(move);
      obstacle.remove();
      score++;
      scoreElement.textContent = score;
    }
  }, 20);

  // Crear el siguiente obstáculo
  setTimeout(createObstacle, 3000 + Math.random() * 3000);
}

// Mostrar menú al cargar
showMenu();
