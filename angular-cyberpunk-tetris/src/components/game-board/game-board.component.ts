
import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { GameService } from '../../services/game.service';
import { EMPTY_CELL_COLOR } from '../../models/tetris.model';

@Component({
  selector: 'app-game-board',
  standalone: true,
  templateUrl: './game-board.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameBoardComponent {
  private gameService = inject(GameService);

  displayBoard: Signal<string[][]> = computed(() => {
    const board = this.gameService.board();
    const currentPiece = this.gameService.currentPiece();

    if (!currentPiece) {
      return board;
    }

    const newBoard = board.map(row => [...row]);

    currentPiece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          const boardX = currentPiece.x + x;
          const boardY = currentPiece.y + y;
          if (boardY >= 0 && boardY < newBoard.length && boardX >= 0 && boardX < newBoard[0].length) {
              if (newBoard[boardY][boardX] === EMPTY_CELL_COLOR) {
                  newBoard[boardY][boardX] = currentPiece.color;
              }
          }
        }
      });
    });

    return newBoard;
  });
}
