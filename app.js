const playboard = document.querySelector('.game-field');
const score = document.querySelector('.score');
const controls = document.querySelectorAll('.controls i');
const gameOverText = document.querySelector('.game-over');
const resetBtn = document.querySelector('.reset-game');

let appleX, appleY;
let snakeX, snakeY;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let snake;
let apple;
let gameOver = false;
let intervalID;
let scoreCounter = 0;

function randomApple(){
    appleX = Math.floor(Math.random() * 30) + 1;
    appleY = Math.floor(Math.random() * 30) + 1;
}

function randomSnake(){
    do{
        snakeX = Math.floor(Math.random() * 30) + 1;
        snakeY = Math.floor(Math.random() * 30) + 1;
    }while(snakeX == appleX && snakeY == appleY);
}

function createSnake() {
    const el = document.createElement('div');
    el.classList.add('snake');
    return el;
}

function createApple() {
    const el = document.createElement('div');
    el.classList.add('apple');
    return el;
}

function moveSnake(e) {
    switch (e.key) {
        case 'ArrowUp':
            if(velocityY !== 1){
                velocityX = 0;
                velocityY = -1;
            }   
            break;
        case 'ArrowDown':
            if(velocityY !== -1){
                velocityX = 0;
                velocityY = 1;
            }
            break;
        case 'ArrowLeft':
            if(velocityX !== 1){
                velocityX = -1;
                velocityY = 0;
            }  
            break;
        case 'ArrowRight':
            if(velocityX !== -1){
                velocityX = 1;
                velocityY = 0;
            }
            break;
    }
}

controls.forEach(key => {
    key.addEventListener('click', () => moveSnake({key: key.dataset.key}));
});

function resetGame() {
    gameOverText.style.display = 'none';
    clearInterval(intervalID); 
    location.reload();
}

resetBtn.addEventListener('click',resetGame);

function initGame() {
    randomApple();
    randomSnake(); 
    snake = createSnake();
    apple = createApple();
}

function handleGameOver() {
    gameOverText.style.display = 'block';
}

function updateGame() {
    if(gameOver) {
        return handleGameOver();
    }

    let fragment = document.createDocumentFragment();

    apple.style.gridArea = `${appleY} / ${appleX}`;
    fragment.appendChild(apple);

    if(snakeX === appleX && snakeY === appleY) {
        snakeBody.push([appleX,appleY]);
        randomApple();  
        scoreCounter++;
        score.textContent = scoreCounter;
    }

    for(let i = snakeBody.length - 1; i > 0; i--) {
       snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX,snakeY];
    snakeX += velocityX;
    snakeY += velocityY;

    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
    }

    for(let i = 0; i < snakeBody.length; i++) {
        const snakePart = createSnake();
        snakePart.style.gridArea = `${snakeBody[i][1]} / ${snakeBody[i][0]}`;
        fragment.appendChild(snakePart);
        if( i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]){
            gameOver = true;
        }
    }

    playboard.replaceChildren(fragment);
}

initGame();
intervalID = setInterval(updateGame, 125);
document.addEventListener("keydown",moveSnake);
