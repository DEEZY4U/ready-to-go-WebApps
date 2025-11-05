
import { Injectable, signal, WritableSignal } from '@angular/core';
import { BOARD_HEIGHT, BOARD_WIDTH, EMPTY_CELL_COLOR, Piece, TETROMINOES } from '../models/tetris.model';

type Board = string[][];
type TetrominoKey = keyof typeof TETROMINOES;

@Injectable({ providedIn: 'root' })
export class GameService {
  board: WritableSignal<Board> = signal(this.createEmptyBoard());
  currentPiece: WritableSignal<Piece | null> = signal(null);
  nextPiece: WritableSignal<Piece | null> = signal(null);
  
  score = signal(0);
  level = signal(1);
  linesCleared = signal(0);
  
  isGameOver = signal(false);
  isPaused = signal(false);
  
  private pieceSequence: TetrominoKey[] = [];
  private gameLoopInterval: any;

  startGame() {
    this.board.set(this.createEmptyBoard());
    this.score.set(0);
    this.level.set(1);
    this.linesCleared.set(0);
    this.isGameOver.set(false);
    this.isPaused.set(false);
    this.fillPieceSequence();
    
    this.spawnPiece();
    this.spawnPiece(); // Call twice to populate current and next piece
    this.gameLoop();
  }

  togglePause() {
    this.isPaused.update(p => !p);
    if (!this.isPaused()) {
      this.gameLoop();
    } else {
      clearInterval(this.gameLoopInterval);
    }
  }

  moveLeft() {
    if (this.isPaused() || this.isGameOver()) return;
    this.movePiece(-1, 0);
  }

  moveRight() {
    if (this.isPaused() || this.isGameOver()) return;
    this.movePiece(1, 0);
  }

  softDrop() {
    if (this.isPaused() || this.isGameOver()) return;
    this.movePiece(0, 1);
  }
  
  hardDrop() {
    if (this.isPaused() || this.isGameOver()) return;
    const piece = this.currentPiece();
    if (!piece) return;

    let dropDistance = 0;
    while (!this.checkCollision(piece.x, piece.y + dropDistance + 1, piece.shape)) {
        dropDistance++;
    }
    
    this.currentPiece.update(p => p ? { ...p, y: p.y + dropDistance } : null);
    this.lockPiece();
    this.score.update(s => s + dropDistance * 2);
  }

  rotate() {
    if (this.isPaused() || this.isGameOver()) return;
    const piece = this.currentPiece();
    if (!piece) return;

    const tetromino = TETROMINOES[piece.name];
    const newRotationIndex = (piece.rotationIndex + 1) % tetromino.shapes.length;
    const newShape = tetromino.shapes[newRotationIndex];
    
    // Basic wall kick
    let kick = 0;
    if (this.checkCollision(piece.x, piece.y, newShape)) {
      kick = piece.x + newShape[0].length > BOARD_WIDTH ? -1 : 1;
    }

    if (!this.checkCollision(piece.x + kick, piece.y, newShape)) {
        this.currentPiece.update(p => p ? { ...p, shape: newShape, rotationIndex: newRotationIndex, x: p.x + kick } : null);
    }
  }

  private gameLoop() {
    if (this.isGameOver() || this.isPaused()) {
      clearInterval(this.gameLoopInterval);
      return;
    }
    
    const speed = Math.max(200, 1000 - (this.level() - 1) * 50);
    
    this.gameLoopInterval = setInterval(() => {
      if (!this.isPaused()) {
          this.tick();
      }
    }, speed);
  }

  private tick() {
    if (this.isGameOver()) return;

    const piece = this.currentPiece();
    if (!piece) return;

    if (!this.checkCollision(piece.x, piece.y + 1, piece.shape)) {
      this.currentPiece.update(p => p ? { ...p, y: p.y + 1 } : null);
    } else {
      this.lockPiece();
    }
  }

  private lockPiece() {
    const piece = this.currentPiece();
    if (!piece) return;
    
    const newBoard = this.board().map(row => [...row]);
    piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          const boardX = piece.x + x;
          const boardY = piece.y + y;
          if (boardY >= 0) {
            newBoard[boardY][boardX] = piece.color;
          }
        }
      });
    });

    this.board.set(newBoard);
    this.clearLines();
    this.spawnPiece();
  }

  private clearLines() {
    let lines = 0;
    const newBoard = this.board().filter(row => !row.every(cell => cell !== EMPTY_CELL_COLOR));
    lines = BOARD_HEIGHT - newBoard.length;

    if (lines > 0) {
      const emptyRows = Array.from({ length: lines }, () => Array(BOARD_WIDTH).fill(EMPTY_CELL_COLOR));
      this.board.set([...emptyRows, ...newBoard]);
      this.linesCleared.update(l => l + lines);

      const points = [0, 100, 300, 500, 800];
      this.score.update(s => s + points[lines] * this.level());
      this.level.set(Math.floor(this.linesCleared() / 10) + 1);

      clearInterval(this.gameLoopInterval);
      this.gameLoop();
    }
  }

  private createEmptyBoard(): Board {
    return Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(EMPTY_CELL_COLOR));
  }

  private spawnPiece() {
    this.currentPiece.set(this.nextPiece());
    
    if (this.pieceSequence.length < 2) {
      this.fillPieceSequence();
    }

    const name = this.pieceSequence.pop()!;
    const tetromino = TETROMINOES[name];
    const shape = tetromino.shapes[0];

    const newPiece: Piece = {
      x: Math.floor((BOARD_WIDTH - shape[0].length) / 2),
      y: 0,
      shape: shape,
      color: tetromino.color,
      name: name,
      rotationIndex: 0,
    };
    this.nextPiece.set(newPiece);

    if (this.currentPiece() && this.checkCollision(this.currentPiece()!.x, this.currentPiece()!.y, this.currentPiece()!.shape)) {
        this.isGameOver.set(true);
        clearInterval(this.gameLoopInterval);
    }
  }

  private fillPieceSequence() {
    const pieces = Object.keys(TETROMINOES) as TetrominoKey[];
    while(pieces.length) {
      const rand = Math.floor(Math.random() * pieces.length);
      this.pieceSequence.push(pieces.splice(rand, 1)[0]);
    }
  }

  private movePiece(dx: number, dy: number) {
    const piece = this.currentPiece();
    if (!piece) return;
    
    if (!this.checkCollision(piece.x + dx, piece.y + dy, piece.shape)) {
      this.currentPiece.update(p => p ? { ...p, x: p.x + dx, y: p.y + dy } : null);
    }
  }
  
  private checkCollision(x: number, y: number, shape: number[][]): boolean {
    const board = this.board();
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const newX = x + col;
          const newY = y + row;

          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
            return true; // Collision with walls or floor
          }

          if (newY < 0) continue; // Allow spawning above the board

          if (board[newY] && board[newY][newX] !== EMPTY_CELL_COLOR) {
            return true; // Collision with another piece
          }
        }
      }
    }
    return false;
  }
}
