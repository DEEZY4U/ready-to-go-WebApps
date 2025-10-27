document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const scoreDisplay = document.getElementById('score');
    const newGameBtn = document.getElementById('new-game-btn');
    const boardSize = 4;
    let board = [];
    let score = 0;
    let isGameOver = false;

    // Initialize the game
    function initializeGame() {
        board = Array(boardSize).fill(0).map(() => Array(boardSize).fill(0));
        score = 0;
        scoreDisplay.textContent = score;
        isGameOver = false;
        renderBoard();
        addRandomTile();
        addRandomTile();
    }

    // Render the board visually
    function renderBoard() {
        gameBoard.innerHTML = '';
        // Add grid cells as background
        for (let i = 0; i < boardSize * boardSize; i++) {
            const gridCell = document.createElement('div');
            gridCell.classList.add('grid-cell');
            gameBoard.appendChild(gridCell);
        }

        // Add tiles
        board.forEach((row, rowIndex) => {
            row.forEach((value, colIndex) => {
                if (value !== 0) {
                    const tile = document.createElement('div');
                    tile.classList.add('tile');
                    tile.dataset.value = value;
                    tile.textContent = value;
                    tile.style.transform = `translate(${colIndex * 110}px, ${rowIndex * 110}px)`; // 100px tile + 10px gap
                    gameBoard.appendChild(tile);
                }
            });
        });
    }

    // Add a random tile (2 or 4) to an empty spot
    function addRandomTile() {
        let emptyCells = [];
        for (let r = 0; r < boardSize; r++) {
            for (let c = 0; c < boardSize; c++) {
                if (board[r][c] === 0) {
                    emptyCells.push({ r, c });
                }
            }
        }

        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            board[randomCell.r][randomCell.c] = Math.random() < 0.9 ? 2 : 4;
            renderBoard(); // Re-render after adding a tile
            return true;
        }
        return false;
    }

    // Handle key presses for movement
    document.addEventListener('keydown', handleKeyPress);

    function handleKeyPress(event) {
        if (isGameOver) return;

        let moved = false;
        switch (event.key) {
            case 'ArrowUp':
                moved = moveTiles(0, -1); // Up
                break;
            case 'ArrowDown':
                moved = moveTiles(0, 1); // Down
                break;
            case 'ArrowLeft':
                moved = moveTiles(-1, 0); // Left
                break;
            case 'ArrowRight':
                moved = moveTiles(1, 0); // Right
                break;
        }

        if (moved) {
            addRandomTile();
            checkGameOver();
            renderBoard(); // Re-render after move and new tile
        }
    }

    // Move and merge tiles logic
    function moveTiles(deltaCol, deltaRow) {
        let moved = false;
        let newBoard = JSON.parse(JSON.stringify(board)); // Deep copy to detect changes

        // Determine loop order based on direction
        const rows = deltaRow === 1 ? Array.from({ length: boardSize }, (_, i) => boardSize - 1 - i) : Array.from({ length: boardSize }, (_, i) => i);
        const cols = deltaCol === 1 ? Array.from({ length: boardSize }, (_, i) => boardSize - 1 - i) : Array.from({ length: boardSize }, (_, i) => i);

        for (const r of rows) {
            for (const c of cols) {
                if (board[r][c] === 0) continue;

                let currentRow = r;
                let currentCol = c;

                while (true) {
                    const nextRow = currentRow + deltaRow;
                    const nextCol = currentCol + deltaCol;

                    if (nextRow < 0 || nextRow >= boardSize || nextCol < 0 || nextCol >= boardSize) {
                        break; // Out of bounds
                    }

                    if (board[nextRow][nextCol] === 0) {
                        // Move to empty spot
                        board[nextRow][nextCol] = board[currentRow][currentCol];
                        board[currentRow][currentCol] = 0;
                        currentRow = nextRow;
                        currentCol = nextCol;
                        moved = true;
                    } else if (board[nextRow][nextCol] === board[currentRow][currentCol] && !hasTileBeenMergedInMove(nextRow, nextCol)) {
                        // Merge
                        board[nextRow][nextCol] *= 2;
                        score += board[nextRow][nextCol];
                        scoreDisplay.textContent = score;
                        board[currentRow][currentCol] = 0;
                        markTileAsMergedInMove(nextRow, nextCol);
                        moved = true;
                        break; // Can't merge more than once per move
                    } else {
                        break; // Obstruction
                    }
                }
            }
        }
        
        // This is a simple check. For advanced animations, you'd track tile movements.
        // A more robust way to detect actual movement is to compare the board before and after.
        if (JSON.stringify(newBoard) !== JSON.stringify(board)) {
            return true;
        }
        return false;
    }

    // Helper to prevent a tile from merging multiple times in a single move
    let mergedThisMove = new Set();
    function markTileAsMergedInMove(r, c) {
        mergedThisMove.add(`${r},${c}`);
    }
    function hasTileBeenMergedInMove(r, c) {
        return mergedThisMove.has(`${r},${c}`);
    }
    document.addEventListener('keydown', () => {
        mergedThisMove.clear(); // Clear merges for the new move
    });


    // Check if the game is over (no more moves or merges)
    function checkGameOver() {
        if (getEmptyCells().length > 0) {
            return false; // Still empty spots
        }

        // Check for possible merges
        for (let r = 0; r < boardSize; r++) {
            for (let c = 0; c < boardSize; c++) {
                const value = board[r][c];
                if (value === 0) continue;

                // Check horizontal
                if (c < boardSize - 1 && board[r][c + 1] === value) return false;
                // Check vertical
                if (r < boardSize - 1 && board[r + 1][c] === value) return false;
            }
        }

        isGameOver = true;
        showGameMessage('Game Over!', 'Try Again');
        return true;
    }

    function getEmptyCells() {
        let emptyCells = [];
        for (let r = 0; r < boardSize; r++) {
            for (let c = 0; c < boardSize; c++) {
                if (board[r][c] === 0) {
                    emptyCells.push({ r, c });
                }
            }
        }
        return emptyCells;
    }

    function showGameMessage(message, buttonText) {
        let gameMessageDiv = document.querySelector('.game-message');
        if (!gameMessageDiv) {
            gameMessageDiv = document.createElement('div');
            gameMessageDiv.classList.add('game-message');
            document.body.appendChild(gameMessageDiv);
        }
        gameMessageDiv.innerHTML = `
            <div>${message}</div>
            <button>${buttonText}</button>
        `;
        gameMessageDiv.classList.add('visible');
        gameMessageDiv.querySelector('button').onclick = () => {
            gameMessageDiv.classList.remove('visible');
            initializeGame();
        };
    }


    // Event listener for New Game button
    newGameBtn.addEventListener('click', initializeGame);

    // Start the game for the first time
    initializeGame();
});