const gameBoard = document.getElementById('game-board');
const player = document.createElement('div');
player.classList.add('player');
player.textContent = '▲'; // Player character

// UI Elements
const scoreDisplay = document.getElementById('score');
const gameOverMessage = document.getElementById('game-over-message');
const winMessage = document.getElementById('win-message');
const startButton = document.getElementById('start-button');
const usernameArea = document.getElementById('username-area');
const usernameInput = document.getElementById('username-input');
const submitUsernameButton = document.getElementById('submit-username-button');
const gameBoardArea = document.getElementById('game-board-area');
const highScoresArea = document.getElementById('high-scores-area');
const currentPlayerDisplay = document.getElementById('current-player');
const highScoresList = document.getElementById('high-scores-list');

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
if (gameBoard) gameBoard.appendChild(invaderContainer);

// Projectile properties
const projectileChar = '|';
let projectiles = [];
const projectileSpeed = 15;

// Game State Variables
let score = 0;
let gameRunning = false;
let currentUsername = '';

// Initialize Player
function initPlayer() {
    if (!gameBoard) return;
    const playerWidth = player.offsetWidth || 20;
    const gameBoardWidth = gameBoard.offsetWidth;
    if (gameBoardWidth > 0 && gameBoard.offsetHeight > 0) {
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
}

function movePlayer(dx) {
    if (!gameRunning || !gameBoard) return;
    const newX = playerPosition.x + dx;
    const playerWidth = player.offsetWidth || 20;
    if (newX >= 0 && newX <= (gameBoard.offsetWidth - playerWidth)) {
        playerPosition.x = newX;
        player.style.left = playerPosition.x + 'px';
    }
}

// Initialize Invaders
function initInvaders() {
    if (!invaderContainer) return;
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

// Username Handling & UI Switching
function handleSubmitUsername() {
    if (!usernameInput || !usernameArea || !gameBoardArea || !highScoresArea || !currentPlayerDisplay || !startButton) return;
    const username = usernameInput.value.trim();
    if (username === '') {
        alert('Please enter a username to play!');
        return;
    }
    currentUsername = username;
    currentPlayerDisplay.textContent = 'Player: ' + currentUsername;

    usernameArea.style.display = 'none';
    gameBoardArea.style.display = 'block';

    // Display current high scores below the game area when username is submitted
    displayHighScores();
    highScoresArea.style.display = 'block'; // Make it visible initially with game board

    startButton.textContent = 'Start Game';
    startButton.focus();
    updateScoreDisplay();
}

if (submitUsernameButton) {
    submitUsernameButton.addEventListener('click', handleSubmitUsername);
}
if (usernameInput) {
    usernameInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            handleSubmitUsername();
        }
    });
}

// Event Listener for Game Controls (keydown)
document.addEventListener('keydown', (event) => {
    if (!gameRunning) {
        if (event.key === ' ' || event.key.toLowerCase() === 'spacebar') {
            if (document.activeElement === startButton) {
                return;
            }
        }
    }

    if (gameRunning) {
        if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') {
            movePlayer(-playerSpeed);
        } else if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') {
            movePlayer(playerSpeed);
        } else if (event.key === ' ' || event.key.toLowerCase() === 'spacebar') {
            event.preventDefault();
            if (startButton && document.activeElement === startButton) {
                startButton.blur();
            }
            fireProjectile();
        }
    }
});

// Event listener for the start/restart game button (click)
if (startButton) {
    startButton.addEventListener('click', () => {
        if (gameRunning) {
            if (confirm("Restart game?")) {
                // stopGame(); // stopGame is implicitly called if game over/win leads here.
                            // For direct restart, startGame handles the reset.
                startGame(); // startGame includes reset logic
            }
        } else {
            startGame();
        }
    });
}


function fireProjectile() {
    if (!gameRunning || !gameBoard) return;
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
    if (scoreDisplay) scoreDisplay.textContent = 'Score: ' + score;
}

function checkWinCondition() {
    if (!gameRunning || !invaders || invaders.length === 0) return;

    let allInvadersDead = true;
    for (let i = 0; i < invaderRows; i++) {
        if (!invaders[i]) continue;
        for (let j = 0; j < invaderCols; j++) {
            if (!invaders[i][j]) continue;
            if (invaders[i][j].alive) {
                allInvadersDead = false;
                break;
            }
        }
        if (!allInvadersDead) break;
    }

    if (allInvadersDead) {
        if (winMessage) winMessage.style.display = 'block';
        stopGame();
        console.log("You Win!");
    }
}

function moveProjectiles() {
    if (!gameRunning) return;
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
    if (!gameRunning || !gameBoard) return;
    let hitEdge = false;
    let shouldGameOver = false;

    for (let i = 0; i < invaderRows; i++) {
        if (!invaders[i]) continue;
        for (let j = 0; j < invaderCols; j++) {
            if (!invaders[i][j]) continue;
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
             if (!invaders[i]) continue;
            for (let j = 0; j < invaderCols; j++) {
                if (!invaders[i][j]) continue;
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
        if (gameOverMessage) gameOverMessage.style.display = 'block';
        stopGame();
        console.log("Game Over!");
    }
}

function gameLoop(timestamp) {
    if (!gameRunning) return;
    moveInvaders();
    moveProjectiles();
    requestAnimationFrame(gameLoop);
}

// Initialize Game State (called by startGame)
function initGameState() {
    score = 0;
    updateScoreDisplay();
    if (gameOverMessage) gameOverMessage.style.display = 'none';
    if (winMessage) winMessage.style.display = 'none';
    if (highScoresArea) highScoresArea.style.display = 'none'; // Hide high scores during game setup

    projectiles.forEach(p => p.element.remove());
    projectiles = [];

    if (currentUsername && currentPlayerDisplay) {
        currentPlayerDisplay.textContent = 'Player: ' + currentUsername;
    }
}

// Start Game
function startGame() {
    if (!currentUsername) {
        alert("Error: No username set. Please enter username first.");
        if (usernameArea) usernameArea.style.display = 'block';
        if (gameBoardArea) gameBoardArea.style.display = 'none';
        if (highScoresArea) highScoresArea.style.display = 'block'; // Show scores if returning to username
        return;
    }

    initGameState(); // Resets score, messages, hides high scores area

    if (invaderContainer) invaderContainer.innerHTML = ''; // Clear previous invaders
    invaders = []; // Reset invaders array
    initInvaders(); // Create new invaders

    initPlayer(); // Reset player position

    gameRunning = true;
    if (startButton) startButton.textContent = 'Restart Game';

    if (gameBoardArea) gameBoardArea.style.display = 'block'; // Ensure game area is visible
    if (usernameArea) usernameArea.style.display = 'none'; // Ensure username area is hidden
    if (highScoresArea) highScoresArea.style.display = 'none'; // Ensure high scores are hidden during gameplay

    requestAnimationFrame(gameLoop);
    console.log("Game started for user:", currentUsername);
}

// Stop Game
function stopGame() {
    // if (!gameRunning) return; // This was in the prompt, but might prevent stopGame if called sequentially.
                               // Game logic (win/loss) should ensure it's called when gameRunning is true.
                               // If called from button when gameRunning is already false, it's fine.
    gameRunning = false;
    if (startButton) startButton.textContent = 'Start Game';
    console.log("Game stopped!");

    if (currentUsername && typeof score === 'number') {
        saveHighScore(currentUsername, score);
    }
    displayHighScores();
    if (highScoresArea) highScoresArea.style.display = 'block';
}

// High Score Management
const MAX_HIGH_SCORES = 10;

function getHighScores() {
    try {
        const scoresJSON = localStorage.getItem('jsInvadersHighScores');
        return scoresJSON ? JSON.parse(scoresJSON) : [];
    } catch (e) {
        console.error("Error getting high scores from localStorage:", e);
        return [];
    }
}

function saveHighScore(username, scoreValue) {
    if (!username || typeof scoreValue !== 'number') {
        console.error("Invalid data for saveHighScore:", username, scoreValue);
        return;
    }
    const newScoreEntry = { name: username, score: scoreValue };
    let highScores = getHighScores();
    highScores.push(newScoreEntry);
    highScores.sort((a, b) => b.score - a.score);
    highScores = highScores.slice(0, MAX_HIGH_SCORES);
    try {
        localStorage.setItem('jsInvadersHighScores', JSON.stringify(highScores));
    } catch (e) {
        console.error("Error saving high scores to localStorage:", e);
    }
}

function displayHighScores() {
    if (!highScoresList || !highScoresArea) {
        console.error("High score display elements not found.");
        return;
    }
    const scores = getHighScores();
    highScoresList.innerHTML = '';
    if (scores.length === 0) {
        highScoresList.innerHTML = '<li>No high scores yet!</li>';
    } else {
        scores.forEach(scoreEntry => {
            const li = document.createElement('li');
            const nameSpan = document.createElement('span');
            nameSpan.classList.add('score-name');
            nameSpan.textContent = scoreEntry.name;
            const scoreSpan = document.createElement('span');
            scoreSpan.classList.add('score-value');
            scoreSpan.textContent = scoreEntry.score;
            li.appendChild(nameSpan);
            li.appendChild(scoreSpan);
            highScoresList.appendChild(li);
        });
    }
}

// Initial App Setup
function initializeApp() {
    if (!usernameArea || !gameBoardArea || !highScoresArea || !scoreDisplay || !startButton) {
        console.error("One or more critical UI elements are missing from the DOM. Cannot initialize app.");
        return;
    }
    usernameArea.style.display = 'block';
    gameBoardArea.style.display = 'none';

    displayHighScores(); // Display high scores initially
    highScoresArea.style.display = 'block'; // Show them below username input

    scoreDisplay.textContent = 'Score: 0';
    startButton.textContent = 'Start Game';
}

initializeApp();
