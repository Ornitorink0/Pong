// script.js
const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

// Imposta le dimensioni del canvas
canvas.width = 1200;
canvas.height = 600;

const paddleWidth = 10;
const paddleHeight = 100;
const ballRadius = 10;

const player = {
  x: 0,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  color: "#FFF",
};

const computer = {
  x: canvas.width - paddleWidth,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  color: "#FFF",
  dy: 4,
};

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: ballRadius,
  speed: 4,
  dx: 4,
  dy: 4,
  color: "#FFF",
};

let hitCount = 0; // Contatore dei palleggi
let gamePaused = true; // Stato del gioco: true se in pausa, false se in esecuzione
let gameOver = false; // Stato del gioco: true se partita finita, false se in corso

const initialSpeed = 4; // Velocità iniziale della palla
const maxSpeed = initialSpeed * 1.7; // Velocità massima della palla (+70%)
const speedIncreaseHits = 1; // Numero di palleggi dopo i quali aumentare la velocità

/**
 * Draws a paddle on the canvas at the specified coordinates with the given width, height, and color.
 *
 * @param {number} x - The x-coordinate of the top-left corner of the paddle.
 * @param {number} y - The y-coordinate of the top-left corner of the paddle.
 * @param {number} width - The width of the paddle.
 * @param {number} height - The height of the paddle.
 * @param {string} color - The color of the paddle.
 */
function drawPaddle(x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

/**
 * Draws a ball on the canvas at the specified coordinates with the given radius and color.
 *
 * @param {number} x - The x-coordinate of the center of the ball.
 * @param {number} y - The y-coordinate of the center of the ball.
 * @param {number} radius - The radius of the ball.
 * @param {string} color - The color of the ball.
 */
function drawBall(x, y, radius, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
}

/**
 * Draws the hit count on the canvas.
 *
 * @return {void} This function does not return a value.
 */
function drawHitCount() {
  ctx.font = "bold 30px Poppins";
  ctx.fillStyle = "#A0A0A0";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#A0A0A0";
  ctx.fillText(hitCount, canvas.width / 2, 30);
}

/**
 * Returns a random direction for the ball with an inclination between 90° and 120°.
 *
 * @return {Object} An object containing the x and y components of the direction vector.
 */
function getRandomDirection() {
  // Ritorna una direzione casuale per la palla con inclinazione tra 90° e 120°
  // Converti gradi in radianti
  const minAngle = 90 * (Math.PI / 180);
  const maxAngle = 120 * (Math.PI / 180);
  const angle = Math.random() * (maxAngle - minAngle) + minAngle;

  return {
    dx: ball.speed * Math.cos(angle),
    dy: ball.speed * Math.sin(angle),
  };
}

/**
 * Returns a random vertical direction based on the input value.
 *
 * @param {number} dy - The input value to be randomly negated or returned as is.
 * @return {number} The input value either negated or returned as is.
 */
function getRandomDirectionVertically(dy) {
  if (Math.random() < 0.5) {
    return -dy;
  } else {
    return dy;
  }
}

/**
 * Updates the position of the ball based on its current velocity and checks for collisions with the game boundaries, player paddle, and computer paddle.
 * If a collision is detected, the ball's direction is updated accordingly.
 * If the ball goes out of bounds, the game is paused and the game over state is set.
 *
 * @return {void} This function does not return a value.
 */
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Collisione con le pareti superiore e inferiore
  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.dy *= -1;
  }

  // Collisione con la racchetta del giocatore
  if (
    ball.x - ball.radius < player.x + player.width &&
    ball.y > player.y &&
    ball.y < player.y + player.height
  ) {
    ball.dx = -ball.dx; // Inverte la direzione orizzontale
    const { dx, dy } = getRandomDirection(); // Cambia la traiettoria
    ball.dx = Math.abs(ball.dx) * (ball.dx > 0 ? 1 : -1); // Mantieni la direzione orizzontale
    ball.dy = getRandomDirectionVertically(dy);
    hitCount++; // Incrementa il contatore dei palleggi
    increaseBallSpeed(); // Aumenta la velocità della palla

    // Log velocità palla
    console.log(`Ball speed: ${ball.dx} ${ball.dy}`);
  }

  // Collisione con la racchetta del computer
  if (
    ball.x + ball.radius > computer.x &&
    ball.y > computer.y &&
    ball.y < computer.y + computer.height
  ) {
    ball.dx = -ball.dx; // Inverte la direzione orizzontale
    const { dx, dy } = getRandomDirection(); // Cambia la traiettoria
    ball.dx = Math.abs(ball.dx) * (ball.dx > 0 ? 1 : -1); // Mantieni la direzione orizzontale
    ball.dy = getRandomDirectionVertically(dy);
    hitCount++; // Incrementa il contatore dei palleggi
    increaseBallSpeed(); // Aumenta la velocità della palla

    // Log velocità palla
    console.log(`Ball speed: ${ball.dx} ${ball.dy}`);
  }

  // Reset della palla se esce dai bordi
  if (ball.x - ball.radius < 0) {
    // Il giocatore perde
    gameOver = true;
    gamePaused = true; // Pausa il gioco
  } else if (ball.x + ball.radius > canvas.width) {
    // Il computer perde
    gameOver = true;
    gamePaused = true; // Pausa il gioco
  }
}

/**
 * Updates the positions of the player's and computer's paddles based on the current game state.
 *
 * @return {void} This function does not return a value.
 */
function movePaddles() {
  if (!gameOver) {
    // Movimento del giocatore basato sulla posizione del mouse
    player.y = mouseY - player.height / 2;

    // Limita la racchetta del giocatore all'interno del canvas
    if (player.y < 0) {
      player.y = 0;
    } else if (player.y + player.height > canvas.height) {
      player.y = canvas.height - player.height;
    }

    // Movimento del computer
    if (ball.y < computer.y + computer.height / 2) {
      computer.y -= computer.dy;
    } else if (ball.y > computer.y + computer.height / 2) {
      computer.y += computer.dy;
    }

    if (computer.y < 0) {
      computer.y = 0;
    } else if (computer.y + computer.height > canvas.height) {
      computer.y = canvas.height - computer.height;
    }
  }
}

/**
 * Resets the position of the ball to a random location and sets its speed.
 *
 * @return {void} This function does not return a value.
 */
function resetBall() {
  // Posizione casuale della palla
  ball.x = Math.random() * (canvas.width - 2 * ball.radius) + ball.radius;
  ball.y = Math.random() * (canvas.height - 2 * ball.radius) + ball.radius;

  // Imposta la velocità della palla
  ball.dx = Math.random() < 0.5 ? initialSpeed : -initialSpeed;
  ball.dy = Math.random() < 0.5 ? initialSpeed : -initialSpeed;
}

/**
 * Increases the speed of the ball if the hit count is a multiple of the speed increase hits and the ball's current speed is less than the maximum speed.
 *
 * @return {void} This function does not return a value.
 */
function increaseBallSpeed() {
  if (hitCount % speedIncreaseHits === 0) {
    if (ball.dx < maxSpeed) {
      ball.dx *= 1.01;
      ball.dy *= 1.01;
    }
  }
}

/**
 * Clear the canvas and draw paddles, ball, and hit count. Display "Game Over" if the game is over.
 *
 * @return {void} This function does not return a value.
 */
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPaddle(player.x, player.y, player.width, player.height, player.color);
  drawPaddle(
    computer.x,
    computer.y,
    computer.width,
    computer.height,
    computer.color
  );
  drawBall(ball.x, ball.y, ball.radius, ball.color);
  drawHitCount(); // Mostra il contatore dei palleggi

  if (gameOver) {
    ctx.fillStyle = "#FFF";
    ctx.font = "bold 50px Poppins";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2);
  }
}

/**
 * Updates the game state by moving the ball and paddles if the game is not paused or over, and redraws the game canvas.
 *
 * @return {void} This function does not return a value.
 */
function update() {
  if (!gamePaused) {
    if (!gameOver) {
      moveBall();
      movePaddles();
    }
  }
  draw();
}

// Gestore dell'evento del mouse per ottenere la posizione y
let mouseY = canvas.height / 2;

canvas.addEventListener("mousemove", function (e) {
  const rect = canvas.getBoundingClientRect();
  mouseY = e.clientY - rect.top;
});

canvas.addEventListener("click", function () {
  if (gameOver) {
    // Resetta il gioco se è finito
    hitCount = 0;
    resetBall();
    gameOver = false;
  }
  gamePaused = !gamePaused; // Toggle tra pausa e ripresa del gioco
});

/**
 * Executes the game loop by calling the `update` function and scheduling the next frame using `requestAnimationFrame`.
 *
 * @return {void} This function does not return a value.
 */
function gameLoop() {
  update();
  requestAnimationFrame(gameLoop);
}

gameLoop();
