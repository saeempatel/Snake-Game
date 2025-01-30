const gameBoard = document.querySelector(".board");
const gameRestart = document.querySelector(".reset");
const highScoreBox = document.querySelector("#high-score");
const currentScoreBox = document.querySelector("#score");

const backgroundMusic = new Audio('music.mp3');
backgroundMusic.loop = true; 
backgroundMusic.volume = 0.5; 


let lastRenderTime = 0;
let gameOver = false;
let currentScore = 0;
let highScore = 0;
let gridSize = 21;
let snakeSpeed = 5;
let snakeBody = [{ x: 10, y: 10 }];
let food = randomFoodPosition();
let inputDirection = { x: 0, y: 0 };
let lastInputDirection = { x: 0, y: 0 };


function playBackgroundMusic() {
    backgroundMusic.play().catch((error) => {
        console.error('Music could not be played:', error);
    });
}


playBackgroundMusic();




function main(currentTime) {
    if (gameOver) {
        displayGameOver();
        return;
    }

    window.requestAnimationFrame(main);

    if ((currentTime - lastRenderTime) / 1000 < 1 / snakeSpeed) {
        return;
    }
    lastRenderTime = currentTime;
    gameEngine();
}


function gameEngine() {
    drawBoard();
    checkCollision();
    updateFood();
    moveSnake();
    drawSnake();
    drawFood();
}

function drawBoard() {
    gameBoard.innerHTML = ""; 
}


function drawSnake() {
    snakeBody.forEach((segment) => {
        const snakeElement = document.createElement("div");
        snakeElement.style.gridRowStart = segment.y;
        snakeElement.style.gridColumnStart = segment.x;
        snakeElement.classList.add("snake");
        gameBoard.appendChild(snakeElement);
    });
}

function drawFood() {
    const foodElement = document.createElement("div");
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add("food");
    gameBoard.appendChild(foodElement);
}

function checkCollision() {
    if (isCollide(snakeBody)) {
        gameOver = true;
    }
}

function isCollide(snake) {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    if (snake[0].x > gridSize || snake[0].x < 1 || snake[0].y > gridSize || snake[0].y < 1) {
        return true;
    }
    return false;
}

const eatSound = new Audio('ding.mp3');

function updateFood() {
    if (snakeBody[0].x === food.x && snakeBody[0].y === food.y) {
        eatSound.play();
        currentScore++;
        updateScore();
        snakeSpeed += 0.5;
        snakeBody.push({ ...snakeBody[snakeBody.length - 1] });
        food = randomFoodPosition();
    }
}


function randomFoodPosition() {
    let newFoodPosition;
    do {
        newFoodPosition = {
            x: Math.floor(Math.random() * gridSize) + 1,
            y: Math.floor(Math.random() * gridSize) + 1,
        };
    } while (onSnake(newFoodPosition));
    return newFoodPosition;
}

function onSnake(position) {
    return snakeBody.some((segment) => segment.x === position.x && segment.y === position.y);
}

function updateScore() {
    if (currentScore > highScore) {
        highScore = currentScore;
        localStorage.setItem("HighScore", highScore);
        highScoreBox.innerText = highScore;
    }
    currentScoreBox.innerText = currentScore;
}

function moveSnake() {
    inputDirection = getInputDirection();
    for (let i = snakeBody.length - 2; i >= 0; i--) {
        snakeBody[i + 1] = { ...snakeBody[i] };
    }
    snakeBody[0].x += inputDirection.x;
    snakeBody[0].y += inputDirection.y;
}

function getInputDirection() {
    lastInputDirection = inputDirection;
    return inputDirection;
}


const gameOverSound = new Audio('game-over.mp3');

function displayGameOver() {
    gameOverSound.play();

    const gameOverText = document.createElement("div");
    gameOverText.id = "game-over";
    gameOverText.className = "game-over";
    gameOverText.innerText = "GAME OVER";

    document.body.appendChild(gameOverText);

    if (currentScore > highScore) {
        const highScoreMessage = document.createElement("div");
        highScoreMessage.id = "new-highscore";
        highScoreMessage.className = "highscore-message";
        highScoreMessage.innerText = `NEW HIGHSCORE: ${currentScore}`;

        gameOverText.appendChild(highScoreMessage);

        highScore = currentScore;
        localStorage.setItem("HighScore", highScore);
    }
}


function restartGame() {
    gameOver = false;
    currentScore = 0;
    snakeSpeed = 5;
    snakeBody = [{ x: 10, y: 10 }];
    inputDirection = { x: 0, y: 0 };
    lastInputDirection = { x: 0, y: 0 };
    food = randomFoodPosition();

    currentScoreBox.innerText = "0";

    const gameOverText = document.getElementById("game-over");
    if (gameOverText) {
        gameOverText.remove();
    }

    gameBoard.innerHTML = "";
    window.requestAnimationFrame(main);
}
const instructions = document.getElementById("instructions");

function hideInstructions() {
    instructions.classList.add("hidden"); 
    window.removeEventListener("keydown", hideInstructions); 
}

window.addEventListener("keydown", (e) => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        hideInstructions();
    }
})
    
window.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowUp":
            if (lastInputDirection.y !== 0) break;
            inputDirection = { x: 0, y: -1 };
            break;
        case "ArrowDown":
            if (lastInputDirection.y !== 0) break;
            inputDirection = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
            if (lastInputDirection.x !== 0) break;
            inputDirection = { x: -1, y: 0 };
            break;
        case "ArrowRight":
            if (lastInputDirection.x !== 0) break;
            inputDirection = { x: 1, y: 0 };
            break;
    }
    
});

gameRestart.addEventListener("click", restartGame);
window.requestAnimationFrame(main);
