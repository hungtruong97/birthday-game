// Game constants and tetromino definitions
export const COLS = 10;
export const ROWS = 20;

// Level settings (5 levels). value = drop interval ms
export const levelSpeeds = [3200, 2400, 1680, 1200, 720];
export const linesToAdvance = 5; // every 5 lines -> next level
export const maxLevel = 5;

// Tetris pieces (tetromino shapes) with 4 rotations each
export const TETROMINOES = {
  I: [
    [[1,1,1,1]],
    [[1],[1],[1],[1]],
    [[1,1,1,1]],
    [[1],[1],[1],[1]]
  ],
  J: [
    [[1,0,0],[1,1,1]],
    [[1,1],[1,0],[1,0]],
    [[1,1,1],[0,0,1]],
    [[0,1],[0,1],[1,1]]
  ],
  L: [
    [[0,0,1],[1,1,1]],
    [[1,0],[1,0],[1,1]],
    [[1,1,1],[1,0,0]],
    [[1,1],[0,1],[0,1]]
  ],
  O: [
    [[1,1],[1,1]],
    [[1,1],[1,1]],
    [[1,1],[1,1]],
    [[1,1],[1,1]]
  ],
  S: [
    [[0,1,1],[1,1,0]],
    [[1,0],[1,1],[0,1]],
    [[0,1,1],[1,1,0]],
    [[1,0],[1,1],[0,1]]
  ],
  T: [
    [[0,1,0],[1,1,1]],
    [[1,0],[1,1],[1,0]],
    [[1,1,1],[0,1,0]],
    [[0,1],[1,1],[0,1]]
  ],
  Z: [
    [[1,1,0],[0,1,1]],
    [[0,1],[1,1],[1,0]],
    [[1,1,0],[0,1,1]],
    [[0,1],[1,1],[1,0]]
  ]
};

export const TET_KEYS = Object.keys(TETROMINOES);