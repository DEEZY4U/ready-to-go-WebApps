// const canvas = document.getElementById('gameCanvas');
// const ctx = canvas.getContext('2d');
// const nextCanvas = document.getElementById('nextCanvas');
// const nextCtx = nextCanvas.getContext('2d');

// const COLS = 10;
// const ROWS = 20;
// const BLOCK_SIZE = 30;

// const COLORS = [
//     '#ff0000', // I
//     '#00ff00', // O
//     '#0000ff', // T
//     '#ffff00', // S
//     '#ff00ff', // Z
//     '#00ffff', // J
//     '#ffa500'  // L
// ];

// const SHAPES = [
//     [[1,1,1,1]], // I
//     [[1,1],[1,1]], // O
//     [[0,1,0],[1,1,1]], // T
//     [[0,1,1],[1,1,0]], // S
//     [[1,1,0],[0,1,1]], // Z
//     [[1,0,0],[1,1,1]], // J
//     [[0,0,1],[1,1,1]]  // L
// ];

// let board = [];
// let score = 0;
// let lines = 0;
// let level = 1;
// let highScore = 0;
// let gameRunning = false;
// let gamePaused = false;
// let currentPiece = null;
// let nextPiece = null;
// let dropInterval = 1000;
// let lastDrop = 0;

// // Load high score
// const savedHighScore = parseInt(localStorage.getItem('tetrisHighScore')) || 0;
// highScore = savedHighScore;
// document.getElementById('highScore').textContent = highScore;

// function initBoard() {
//     board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
// }

// function createPiece() {
//     const type = Math.floor(Math.random() * SHAPES.length);
//     return {
//         shape: SHAPES[type],
//         color: COLORS[type],
//         x: Math.floor(COLS / 2) - Math.floor(SHAPES[type][0].length / 2),
//         y: 0
//     };
// }

// function drawBlock(ctx, x, y, color, size = BLOCK_SIZE) {
//     ctx.fillStyle = color;
//     ctx.fillRect(x * size, y * size, size, size);
//     ctx.strokeStyle = '#000';
//     ctx.lineWidth = 2;
//     ctx.strokeRect(x * size, y * size, size, size);
    
//     // Add highlight
//     ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
//     ctx.fillRect(x * size, y * size, size / 3, size / 3);
// }

// function drawBoard() {
//     ctx.fillStyle = '#000';
//     ctx.fillRect(0, 0, canvas.width, canvas.height);
    
//     for (let y = 0; y < ROWS; y++) {
//         for (let x = 0; x < COLS; x++) {
//             if (board[y][x]) {
//                 drawBlock(ctx, x, y, board[y][x]);
//             }
//         }
//     }
// }

// function drawPiece(piece) {
//     piece.shape.forEach((row, y) => {
//         row.forEach((value, x) => {
//             if (value) {
//                 drawBlock(ctx, piece.x + x, piece.y + y, piece.color);
//             }
//         });
//     });
// }

// function drawNextPiece() {
//     nextCtx.fillStyle = '#000';
//     nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
    
//     if (nextPiece) {
//         const offsetX = (4 - nextPiece.shape[0].length) / 2;
//         const offsetY = (4 - nextPiece.shape.length) / 2;
        
//         nextPiece.shape.forEach((row, y) => {
//             row.forEach((value, x) => {
//                 if (value) {
//                     drawBlock(nextCtx, offsetX + x, offsetY + y, nextPiece.color, 30);
//                 }
//             });
//         });
//     }
// }

// function collide(piece) {
//     for (let y = 0; y < piece.shape.length; y++) {
//         for (let x = 0; x < piece.shape[y].length; x++) {
//             if (piece.shape[y][x]) {
//                 const newX = piece.x + x;
//                 const newY = piece.y + y;
                
//                 if (newX < 0 || newX >= COLS || newY >= ROWS) {
//                     return true;
//                 }
//                 if (newY >= 0 && board[newY][newX]) {
//                     return true;
//                 }
//             }
//         }
//     }
//     return false;
// }

// function mergePiece() {
//     currentPiece.shape.forEach((row, y) => {
//         row.forEach((value, x) => {
//             if (value) {
//                 const boardY = currentPiece.y + y;
//                 const boardX = currentPiece.x + x;
//                 if (boardY >= 0) {
//                     board[boardY][boardX] = currentPiece.color;
//                 }
//             }
//         });
//     });
// }

// function clearLines() {
//     let linesCleared = 0;
    
//     for (let y = ROWS - 1; y >= 0; y--) {
//         if (board[y].every(cell => cell !== 0)) {
//             board.splice(y, 1);
//             board.unshift(Array(COLS).fill(0));
//             linesCleared++;
//             y++;
//         }
//     }
    
//     if (linesCleared > 0) {
//         lines += linesCleared;
        
//         // Score based on lines cleared (classic Tetris scoring)
//         const lineScores = [0, 100, 300, 500, 800];
//         score += lineScores[linesCleared] * level;
        
//         level = Math.floor(lines / 10) + 1;
//         dropInterval = Math.max(100, 1000 - (level - 1) * 100);
        
//         updateDisplay();
//     }
// }

// function rotate(piece) {
//     const rotated = piece.shape[0].map((_, i) =>
//         piece.shape.map(row => row[i]).reverse()
//     );
    
//     const newPiece = { ...piece, shape: rotated };
    
//     if (!collide(newPiece)) {
//         return newPiece;
//     }
    
//     // Wall kick
//     for (let offset of [1, -1, 2, -2]) {
//         newPiece.x = piece.x + offset;
//         if (!collide(newPiece)) {
//             return newPiece;
//         }
//     }
    
//     return piece;
// }

// function moveDown() {
//     currentPiece.y++;
//     if (collide(currentPiece)) {
//         currentPiece.y--;
//         mergePiece();
//         clearLines();
//         currentPiece = nextPiece;
//         nextPiece = createPiece();
//         drawNextPiece();
        
//         if (collide(currentPiece)) {
//             gameOver();
//         }
//     }
// }

// function hardDrop() {
//     while (!collide({ ...currentPiece, y: currentPiece.y + 1 })) {
//         currentPiece.y++;
//     }
//     moveDown();
// }

// function updateDisplay() {
//     document.getElementById('score').textContent = score;
//     document.getElementById('level').textContent = level;
//     document.getElementById('lines').textContent = lines;
    
//     if (score > highScore) {
//         highScore = score;
//         document.getElementById('highScore').textContent = highScore;
//         localStorage.setItem('tetrisHighScore', highScore);
//     }
// }

// function gameOver() {
//     gameRunning = false;
//     document.getElementById('finalScore').textContent = score;
//     document.getElementById('finalLines').textContent = lines;
    
//     if (score === highScore && score > 0) {
//         document.getElementById('newHighScore').style.display = 'block';
//     } else {
//         document.getElementById('newHighScore').style.display = 'none';
//     }
    
//     document.getElementById('gameOver').classList.add('show');
// }

// function startGame() {
//     initBoard();
//     score = 0;
//     lines = 0;
//     level = 1;
//     dropInterval = 1000;
//     currentPiece = createPiece();
//     nextPiece = createPiece();
//     gameRunning = true;
//     gamePaused = false;
    
//     updateDisplay();
//     drawNextPiece();
//     document.getElementById('gameOver').classList.remove('show');
//     document.getElementById('startBtn').textContent = 'RESTART';
    
//     requestAnimationFrame(gameLoop);
// }

// function gameLoop(timestamp) {
//     if (!gameRunning) return;
    
//     if (!gamePaused) {
//         if (timestamp - lastDrop > dropInterval) {
//             moveDown();
//             lastDrop = timestamp;
//         }
        
//         drawBoard();
//         drawPiece(currentPiece);
//     }
    
//     requestAnimationFrame(gameLoop);
// }

// document.addEventListener('keydown', (e) => {
//     if (!gameRunning || gamePaused) return;
    
//     switch(e.key) {
//         case 'ArrowLeft':
//             currentPiece.x--;
//             if (collide(currentPiece)) currentPiece.x++;
//             break;
//         case 'ArrowRight':
//             currentPiece.x++;
//             if (collide(currentPiece)) currentPiece.x--;
//             break;
//         case 'ArrowDown':
//             moveDown();
//             break;
//         case 'ArrowUp':
//             currentPiece = rotate(currentPiece);
//             break;
//         case ' ':
//             e.preventDefault();
//             hardDrop();
//             break;
//     }
    
//     drawBoard();
//     drawPiece(currentPiece);
// });

// document.addEventListener('keydown', (e) => {
//     if (e.key.toLowerCase() === 'p' && gameRunning) {
//         gamePaused = !gamePaused;
//         if (gamePaused) {
//             ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
//             ctx.fillRect(0, 0, canvas.width, canvas.height);
//             ctx.fillStyle = '#ffff00';
//             ctx.font = '48px Courier New';
//             ctx.textAlign = 'center';
//             ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
//         }
//     }
// });

// document.getElementById('startBtn').addEventListener('click', startGame);
// document.getElementById('restartBtn').addEventListener('click', startGame);

// // Draw initial empty board
// drawBoard();
// drawNextPiece();

///////////////////////////////////////////////////////////////////////

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const nextCanvas = document.getElementById('nextCanvas');
const nextCtx = nextCanvas.getContext('2d');

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

const COLORS = [
    '#ff0000', // I
    '#00ff00', // O
    '#0000ff', // T
    '#ffff00', // S
    '#ff00ff', // Z
    '#00ffff', // J
    '#ffa500'  // L
];

const SHAPES = [
    [[1,1,1,1]], // I
    [[1,1],[1,1]], // O
    [[0,1,0],[1,1,1]], // T
    [[0,1,1],[1,1,0]], // S
    [[1,1,0],[0,1,1]], // Z
    [[1,0,0],[1,1,1]], // J
    [[0,0,1],[1,1,1]]  // L
];

let board = [];
let score = 0;
let lines = 0;
let level = 1;
let highScore = 0;
let gameRunning = false;
let gamePaused = false;
let currentPiece = null;
let nextPiece = null;
let dropInterval = 1000;
let lastDrop = 0;

// Load high score
const savedHighScore = parseInt(localStorage.getItem('tetrisHighScore')) || 0;
highScore = savedHighScore;
document.getElementById('highScore').textContent = highScore;

function initBoard() {
    board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
}

function createPiece() {
    const type = Math.floor(Math.random() * SHAPES.length);
    return {
        shape: SHAPES[type],
        color: COLORS[type],
        x: Math.floor(COLS / 2) - Math.floor(SHAPES[type][0].length / 2),
        y: 0
    };
}

function drawBlock(ctx, x, y, color, size = BLOCK_SIZE) {
    ctx.fillStyle = color;
    ctx.fillRect(x * size, y * size, size, size);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(x * size, y * size, size, size);
    
    // Add highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(x * size, y * size, size / 3, size / 3);
}

function drawBoard() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            if (board[y][x]) {
                drawBlock(ctx, x, y, board[y][x]);
            }
        }
    }
}

function drawPiece(piece) {
    piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                drawBlock(ctx, piece.x + x, piece.y + y, piece.color);
            }
        });
    });
}

function drawNextPiece() {
    nextCtx.fillStyle = '#000';
    nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
    
    if (nextPiece) {
        const blockSize = 25;
        const offsetX = (4 - nextPiece.shape[0].length) / 2;
        const offsetY = (4 - nextPiece.shape.length) / 2;
        
        nextPiece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    drawBlock(nextCtx, offsetX + x, offsetY + y, nextPiece.color, blockSize);
                }
            });
        });
    }
}

function collide(piece) {
    for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
            if (piece.shape[y][x]) {
                const newX = piece.x + x;
                const newY = piece.y + y;
                
                if (newX < 0 || newX >= COLS || newY >= ROWS) {
                    return true;
                }
                if (newY >= 0 && board[newY][newX]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function mergePiece() {
    currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                const boardY = currentPiece.y + y;
                const boardX = currentPiece.x + x;
                if (boardY >= 0) {
                    board[boardY][boardX] = currentPiece.color;
                }
            }
        });
    });
}

function clearLines() {
    let linesCleared = 0;
    
    for (let y = ROWS - 1; y >= 0; y--) {
        if (board[y].every(cell => cell !== 0)) {
            board.splice(y, 1);
            board.unshift(Array(COLS).fill(0));
            linesCleared++;
            y++;
        }
    }
    
    if (linesCleared > 0) {
        lines += linesCleared;
        
        // Score based on lines cleared (classic Tetris scoring)
        const lineScores = [0, 100, 300, 500, 800];
        score += lineScores[linesCleared] * level;
        
        level = Math.floor(lines / 10) + 1;
        dropInterval = Math.max(100, 1000 - (level - 1) * 100);
        
        updateDisplay();
    }
}

function rotate(piece) {
    const rotated = piece.shape[0].map((_, i) =>
        piece.shape.map(row => row[i]).reverse()
    );
    
    const newPiece = { ...piece, shape: rotated };
    
    if (!collide(newPiece)) {
        return newPiece;
    }
    
    // Wall kick
    for (let offset of [1, -1, 2, -2]) {
        newPiece.x = piece.x + offset;
        if (!collide(newPiece)) {
            return newPiece;
        }
    }
    
    return piece;
}

function moveDown() {
    currentPiece.y++;
    if (collide(currentPiece)) {
        currentPiece.y--;
        mergePiece();
        clearLines();
        currentPiece = nextPiece;
        nextPiece = createPiece();
        drawNextPiece();
        
        if (collide(currentPiece)) {
            gameOver();
        }
    }
}

function hardDrop() {
    while (!collide({ ...currentPiece, y: currentPiece.y + 1 })) {
        currentPiece.y++;
    }
    moveDown();
}

function updateDisplay() {
    document.getElementById('score').textContent = score;
    document.getElementById('level').textContent = level;
    document.getElementById('lines').textContent = lines;
    
    if (score > highScore) {
        highScore = score;
        document.getElementById('highScore').textContent = highScore;
        localStorage.setItem('tetrisHighScore', highScore);
    }
}

function gameOver() {
    gameRunning = false;
    document.getElementById('finalScore').textContent = score;
    document.getElementById('finalLines').textContent = lines;
    
    if (score === highScore && score > 0) {
        document.getElementById('newHighScore').style.display = 'block';
    } else {
        document.getElementById('newHighScore').style.display = 'none';
    }
    
    document.getElementById('gameOver').classList.add('show');
}

function startGame() {
    initBoard();
    score = 0;
    lines = 0;
    level = 1;
    dropInterval = 1000;
    currentPiece = createPiece();
    nextPiece = createPiece();
    gameRunning = true;
    gamePaused = false;
    
    updateDisplay();
    drawNextPiece();
    document.getElementById('gameOver').classList.remove('show');
    document.getElementById('startBtn').textContent = 'RESTART';
    
    requestAnimationFrame(gameLoop);
}

function gameLoop(timestamp) {
    if (!gameRunning) return;
    
    if (!gamePaused) {
        if (timestamp - lastDrop > dropInterval) {
            moveDown();
            lastDrop = timestamp;
        }
        
        drawBoard();
        drawPiece(currentPiece);
    }
    
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
    if (!gameRunning || gamePaused) return;
    
    switch(e.key) {
        case 'ArrowLeft':
            currentPiece.x--;
            if (collide(currentPiece)) currentPiece.x++;
            break;
        case 'ArrowRight':
            currentPiece.x++;
            if (collide(currentPiece)) currentPiece.x--;
            break;
        case 'ArrowDown':
            moveDown();
            break;
        case 'ArrowUp':
            currentPiece = rotate(currentPiece);
            break;
        case ' ':
            e.preventDefault();
            hardDrop();
            break;
    }
    
    drawBoard();
    drawPiece(currentPiece);
});

document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'p' && gameRunning) {
        gamePaused = !gamePaused;
        if (gamePaused) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#ffff00';
            ctx.font = '48px Courier New';
            ctx.textAlign = 'center';
            ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
        }
    }
});

document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('restartBtn').addEventListener('click', startGame);

// Draw initial empty board
drawBoard();
drawNextPiece();