
let score = 0;
let timeLeft = 60;
let spawnRate = 1200;
let isMuted = false;

const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const area = document.getElementById("cockroach-area");
const bgMusic = document.getElementById("bg-music");
const squishSound = document.getElementById("squish-sound");
const muteBtn = document.getElementById("mute-btn");
const startPopup = document.getElementById("start-popup");
const startBtn = document.getElementById("start-btn");
const gameContainer = document.getElementById("game-container");
const gameOverPopup = document.getElementById("game-over-popup");
const finalScore = document.getElementById("final-score");
const restartBtn = document.getElementById("restart-btn");

function spawnCockroach() {
  const roach = document.createElement("div");
  roach.className = "cockroach";
  roach.style.top = Math.random() * 350 + "px";
  roach.style.left = Math.random() * (window.innerWidth - 60) + "px";
  area.appendChild(roach);

  roach.addEventListener("click", () => {
    roach.classList.add("dead");
    setTimeout(() => roach.remove(), 500);
    score++;
    scoreEl.textContent = "Score: " + score;
    if (!isMuted) squishSound.play();
  });

  setTimeout(() => {
    if (!roach.classList.contains("dead")) roach.remove();
  }, 2000);
}

function startGame() {
  let gameInterval = setInterval(() => {
    spawnCockroach();
  }, spawnRate);

  let timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = "Time: " + timeLeft + "s";

    if (timeLeft % 10 === 0 && spawnRate > 500) {
      clearInterval(gameInterval);
      spawnRate -= 200;
      gameInterval = setInterval(spawnCockroach, spawnRate);
      showSpeedIncreaseMessage(); // Show alert
    }

    if (timeLeft <= 0) {
      clearInterval(timer);
      clearInterval(gameInterval);
      finalScore.textContent = "Cockroaches Killed: " + score;
      gameOverPopup.classList.remove("hidden");
    }
  }, 1000);
  function showSpeedIncreaseMessage() {
    const msg = document.createElement("div");
    msg.textContent = "⚡Speed Increased!";
    msg.style.position = "fixed";
    msg.style.top = "50%";
    msg.style.left = "50%";
    msg.style.transform = "translate(-50%, -50%)";
    msg.style.background = "#ff4136";
    msg.style.color = "white";
    msg.style.padding = "10px 20px";
    msg.style.borderRadius = "5px";
    msg.style.fontSize = "18px";
    msg.style.zIndex = "1000";
    msg.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.2)";
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 2000);
  }
}

muteBtn.addEventListener("click", () => {
  isMuted = !isMuted;
  bgMusic.muted = isMuted;
  squishSound.muted = isMuted;
  muteBtn.textContent = bgMusic.muted ? '🔇' : '🔊';
});

window.addEventListener("load", () => {
  if (!navigator.onLine) {
    alert("You are offline!");
  }

  startBtn.addEventListener("click", () => {
    startPopup.style.display = "none";
    gameContainer.style.display = "block";
    bgMusic.play().catch(err => console.log("Autoplay blocked:", err));
    startGame();
  });
});
restartBtn.addEventListener("click", () => {
  gameOverPopup.classList.add("hidden");
  score = 0;
  timeLeft = 60;
  spawnRate = 2000;
  scoreEl.textContent = "Score: 0";
  timerEl.textContent = "Time: 60s";
  startGame();
});
