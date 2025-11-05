
import { ChangeDetectionStrategy, Component, computed, effect, inject, OnDestroy, OnInit, Signal } from '@angular/core';
import { GameBoardComponent } from './components/game-board/game-board.component';
import { GameService } from './services/game.service';
import { fromEvent, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [GameBoardComponent],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  gameService = inject(GameService);
  
  private keydownSubscription: Subscription | undefined;

  nextPieceGrid: Signal<string[][]> = computed(() => {
    const piece = this.gameService.nextPiece();
    const grid = Array.from({ length: 4 }, () => Array(4).fill('bg-transparent'));
    if (piece) {
        piece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    grid[y][x] = piece.color;
                }
            });
        });
    }
    return grid;
  });

  ngOnInit() {
    this.keydownSubscription = fromEvent<KeyboardEvent>(document, 'keydown').subscribe(event => {
      if (this.gameService.isGameOver()) {
        return;
      }
      
      switch (event.code) {
        case 'ArrowLeft':
          this.gameService.moveLeft();
          break;
        case 'ArrowRight':
          this.gameService.moveRight();
          break;
        case 'ArrowDown':
          this.gameService.softDrop();
          break;
        case 'ArrowUp':
          this.gameService.rotate();
          break;
        case 'Space':
          event.preventDefault(); // prevent page scroll
          this.gameService.hardDrop();
          break;
        case 'KeyP':
          this.gameService.togglePause();
          break;
      }
    });
  }

  ngOnDestroy() {
    this.keydownSubscription?.unsubscribe();
  }
  
  startGame() {
    this.gameService.startGame();
  }
}
