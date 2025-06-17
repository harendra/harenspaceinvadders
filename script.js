const gameBoard = document.getElementById('game-board');
const player = document.createElement('div');
player.classList.add('player');
player.textContent = '▲'; // Player character

// UI Elements
const scoreDisplay = document.getElementById('score');
const gameOverMessage = document.getElementById('game-over-message');
const winMessage = document.getElementById('win-message');
const startButton = document.getElementById('start-button');

// Player properties
let playerPosition = { x: 280, y: 360 };
const playerSpeed = 10;

// Invader properties
const invaderRows = 5;
const invaderCols = 10;
const invaderChar = 'Ж';
let invaders = [];
const invaderSpeed = 5;
const invaderDropSpeed = 10;
let invaderDirection = 1;
const invaderContainer = document.createElement('div');
invaderContainer.classList.add('invader-container');
gameBoard.appendChild(invaderContainer);

// Projectile properties
const projectileChar = '|';
let projectiles = [];
const projectileSpeed = 15;

// Game State Variables
let score = 0;
let gameRunning = false;

// Initialize Player
function initPlayer() {
    const playerWidth = player.offsetWidth || 20;
    const gameBoardWidth = gameBoard.offsetWidth;
    playerPosition = {
        x: (gameBoardWidth / 2) - (playerWidth / 2),
        y: gameBoard.offsetHeight - (player.offsetHeight || 20) - 10
    };
    player.style.left = playerPosition.x + 'px';
    player.style.top = playerPosition.y + 'px';
    if (!gameBoard.contains(player)) {
        gameBoard.appendChild(player);
    }
}

function movePlayer(dx) {
    const newX = playerPosition.x + dx;
    const playerWidth = player.offsetWidth || 20;
    if (newX >= 0 && newX <= (gameBoard.offsetWidth - playerWidth)) {
        playerPosition.x = newX;
        player.style.left = playerPosition.x + 'px';
    }
}

// Initialize Invaders
function initInvaders() {
    invaderContainer.innerHTML = '';
    invaders = [];
    for (let i = 0; i < invaderRows; i++) {
        invaders[i] = [];
        for (let j = 0; j < invaderCols; j++) {
            const invader = document.createElement('div');
            invader.classList.add('invader');
            invader.textContent = invaderChar;
            const x = j * 40 + 50;
            const y = i * 30 + 30;
            invader.style.left = x + 'px';
            invader.style.top = y + 'px';
            invaderContainer.appendChild(invader);
            invaders[i][j] = { element: invader, x: x, y: y, alive: true };
        }
    }
}

// Event Listener for Controls
document.addEventListener('keydown', (event) => {
    // Keyboard controls are active only if the game is running
    if (gameRunning) {
        if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') {
            movePlayer(-playerSpeed);
        } else if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') {
            movePlayer(playerSpeed);
        } else if (event.key === ' ' || event.key.toLowerCase() === 'spacebar') {
            fireProjectile();
        }
    }
});

// Event listener for the start button
if (startButton) {
    startButton.addEventListener('click', () => {
        if (!gameRunning) {
            startGame();
        } else {
            // If game is running, confirm then restart
            if (confirm("Restart game?")) {
                stopGame();
                startGame();
            }
        }
    });
}


function fireProjectile() {
    const projectile = document.createElement('div');
    projectile.classList.add('projectile');
    projectile.textContent = projectileChar;
    const playerWidth = player.offsetWidth || 20;
    const projectileWidth = 5;
    const projectileHeight = 15;

    const x = playerPosition.x + (playerWidth / 2) - (projectileWidth / 2);
    const y = playerPosition.y - projectileHeight;

    projectile.style.left = x + 'px';
    projectile.style.top = y + 'px';
    gameBoard.appendChild(projectile);
    projectiles.push({ element: projectile, x: x, y: y });
}

function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

function updateScore(points) {
    score += points;
    updateScoreDisplay();
}

function updateScoreDisplay() {
    scoreDisplay.textContent = 'Score: ' + score;
}

function checkWinCondition() {
    let allInvadersDead = true;
    for (let i = 0; i < invaderRows; i++) {
        for (let j = 0; j < invaderCols; j++) {
            if (invaders[i][j].alive) {
                allInvadersDead = false;
                break;
            }
        }
        if (!allInvadersDead) break;
    }

    if (allInvadersDead) {
        winMessage.style.display = 'block';
        stopGame(); // This will also update button text
        console.log("You Win!");
    }
}

function moveProjectiles() {
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const p = projectiles[i];
        p.y -= projectileSpeed;

        const pWidth = p.element.offsetWidth || 5;
        const pHeight = p.element.offsetHeight || 15;

        if (p.y + pHeight < 0) {
            p.element.remove();
            projectiles.splice(i, 1);
        } else {
            p.element.style.top = p.y + 'px';
            let hitInvader = false;
            for (let r = 0; r < invaderRows; r++) {
                for (let c = 0; c < invaderCols; c++) {
                    if (invaders[r][c].alive) {
                        const invader = invaders[r][c];
                        const invWidth = invader.element.offsetWidth || 20;
                        const invHeight = invader.element.offsetHeight || 20;

                        const projectileRect = { x: p.x, y: p.y, width: pWidth, height: pHeight };
                        const invaderRect = { x: invader.x, y: invader.y, width: invWidth, height: invHeight };

                        if (checkCollision(projectileRect, invaderRect)) {
                            p.element.remove();
                            projectiles.splice(i, 1);
                            hitInvader = true;

                            invader.element.style.display = 'none';
                            invaders[r][c].alive = false;
                            updateScore(10);
                            checkWinCondition();
                            break;
                        }
                    }
                }
                if (hitInvader) break;
            }
        }
    }
}

function moveInvaders() {
    let hitEdge = false;
    let shouldGameOver = false;

    for (let i = 0; i < invaderRows; i++) {
        for (let j = 0; j < invaderCols; j++) {
            if (invaders[i][j].alive) {
                const invader = invaders[i][j];
                invader.x += invaderSpeed * invaderDirection;
                invader.element.style.left = invader.x + 'px';

                const invWidth = invader.element.offsetWidth || 20;
                const invHeight = invader.element.offsetHeight || 20;

                if (invader.x + invWidth >= gameBoard.offsetWidth || invader.x <= 0) {
                    hitEdge = true;
                }
                if (invader.y + invHeight >= gameBoard.offsetHeight) {
                    shouldGameOver = true;
                }
            }
        }
    }

    if (hitEdge) {
        invaderDirection *= -1;
        for (let i = 0; i < invaderRows; i++) {
            for (let j = 0; j < invaderCols; j++) {
                if (invaders[i][j].alive) {
                    const invader = invaders[i][j];
                    invader.y += invaderDropSpeed;
                    invader.element.style.top = invader.y + 'px';
                    const invHeight = invader.element.offsetHeight || 20;
                    if (invader.y + invHeight >= gameBoard.offsetHeight) {
                        shouldGameOver = true;
                    }
                }
            }
        }
    }

    if (shouldGameOver) {
        gameOverMessage.style.display = 'block';
        stopGame(); // This will also update button text
    }
}

function gameLoop(timestamp) {
    if (!gameRunning) return;
    moveInvaders();
    moveProjectiles();
    requestAnimationFrame(gameLoop);
}

function initGameState() {
    score = 0;
    updateScoreDisplay();
    gameOverMessage.style.display = 'none';
    winMessage.style.display = 'none';

    projectiles.forEach(p => p.element.remove());
    projectiles = [];

    // Button text is handled by startGame and stopGame directly.
    // If stopGame wasn't called (e.g. very first load), initial text is set at the bottom.
}

function startGame() {
    // If game is already running and user doesn't want to restart, exit.
    // This specific check for confirm was moved to the button's event listener
    // to avoid confirm dialog when starting for the very first time.
    // if (gameRunning && !confirm("Restart game?")) {
    //     return;
    // }

    initGameState();
    initPlayer();
    initInvaders();

    gameRunning = true;
    if (startButton) startButton.textContent = 'Restart Game';
    requestAnimationFrame(gameLoop);
    console.log("Game started!");
}

function stopGame() {
    gameRunning = false;
    if (startButton) startButton.textContent = 'Start Game';
    console.log("Game stopped!");
}

// Initial setup
initPlayer();
initInvaders();
updateScoreDisplay();
if (startButton) {
    startButton.textContent = 'Start Game';
}
