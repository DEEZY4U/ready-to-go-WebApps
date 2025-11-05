
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export const EMPTY_CELL_COLOR = 'bg-slate-900/60';

export interface Piece {
  x: number;
  y: number;
  shape: number[][];
  color: string;
  name: keyof typeof TETROMINOES;
  rotationIndex: number;
}

export const TETROMINOES = {
  I: {
    shapes: [
      [[1, 1, 1, 1]],
      [[1], [1], [1], [1]],
    ],
    color: 'bg-cyan-400 border-cyan-200 border-t-cyan-200 border-l-cyan-200 border-b-cyan-600 border-r-cyan-600',
  },
  O: {
    shapes: [
      [[1, 1], [1, 1]],
    ],
    color: 'bg-yellow-400 border-yellow-200 border-t-yellow-200 border-l-yellow-200 border-b-yellow-600 border-r-yellow-600',
  },
  T: {
    shapes: [
      [[0, 1, 0], [1, 1, 1]],
      [[1, 0], [1, 1], [1, 0]],
      [[1, 1, 1], [0, 1, 0]],
      [[0, 1], [1, 1], [0, 1]],
    ],
    color: 'bg-purple-500 border-purple-300 border-t-purple-300 border-l-purple-300 border-b-purple-700 border-r-purple-700',
  },
  L: {
    shapes: [
      [[0, 0, 1], [1, 1, 1]],
      [[1, 0], [1, 0], [1, 1]],
      [[1, 1, 1], [1, 0, 0]],
      [[1, 1], [0, 1], [0, 1]],
    ],
    color: 'bg-orange-500 border-orange-300 border-t-orange-300 border-l-orange-300 border-b-orange-700 border-r-orange-700',
  },
  J: {
    shapes: [
      [[1, 0, 0], [1, 1, 1]],
      [[1, 1], [1, 0], [1, 0]],
      [[1, 1, 1], [0, 0, 1]],
      [[0, 1], [0, 1], [1, 1]],
    ],
    color: 'bg-blue-500 border-blue-300 border-t-blue-300 border-l-blue-300 border-b-blue-700 border-r-blue-700',
  },
  S: {
    shapes: [
      [[0, 1, 1], [1, 1, 0]],
      [[1, 0], [1, 1], [0, 1]],
    ],
    color: 'bg-green-500 border-green-300 border-t-green-300 border-l-green-300 border-b-green-700 border-r-green-700',
  },
  Z: {
    shapes: [
      [[1, 1, 0], [0, 1, 1]],
      [[0, 1], [1, 1], [1, 0]],
    ],
    color: 'bg-red-500 border-red-300 border-t-red-300 border-l-red-300 border-b-red-700 border-r-red-700',
  },
};
