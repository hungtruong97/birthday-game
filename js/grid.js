// Grid operations (collision detection, merging, line clearing)
import { COLS, ROWS } from './constants.js';
import { grid } from './gameState.js';

export function collide(gridRef, piece) {
  const { shape, x: px, y: py } = piece;
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const gx = px + x;
        const gy = py + y;
        if (gx < 0 || gx >= COLS || gy >= ROWS) return true;
        // Treat transparent cells as empty
        if (gy >= 0 && gridRef[gy][gx] && gridRef[gy][gx] !== 'transparent') return true;
      }
    }
  }
  return false;
}

export function merge(gridRef, piece) {
  const { shape, x: px, y: py } = piece;
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const gx = px + x;
        const gy = py + y;
        if (gy >= 0 && gy < ROWS && gx >= 0 && gx < COLS) {
          gridRef[gy][gx] = 1;
        }
      }
    }
  }
}

export function sweep() {
  let rowCount = 0;
  
  // Only process row clearing, do not reveal background for last row
  // Only allow background rows in rows 1-10 from bottom
  const bgRows = 8;
  const bgStart = ROWS - bgRows;
  let bgCount = 0;
  for (let y = ROWS - 1; y >= bgStart; y--) {
    let isBgRow = true;
    for (let x = 0; x < COLS; x++) {
      if (grid[y][x] !== 'bg-solid') {
        isBgRow = false;
        break;
      }
    }
    if (isBgRow) {
      bgCount++;
    } else {
      break;
    }
  }

  // Mark all consecutive cleared bottom rows as background rows
  let revealRows = [];
  for (let y = ROWS - 1 - bgCount; y >= bgStart; y--) {
    let fullPlayableRow = true;
    for (let x = 0; x < COLS; x++) {
      if (!grid[y][x] || grid[y][x] === 'bg-solid') {
        fullPlayableRow = false;
        break;
      }
    }
    if (fullPlayableRow) {
      revealRows.push(y);
    } else {
      break;
    }
  }
  for (const y of revealRows) {
    rowCount++;
    for (let x = 0; x < COLS; x++) {
      grid[y][x] = 'bg-solid';
    }
    if (y === bgStart) {
      import('./gameState.js').then(mod => {
        mod.setIsRunning(false);
        alert('Congrats, you win!');
      });
    }
  }

  // Now calculate the new lastPlayableRow (just above the last bg-solid row)
  let newBgCount = 0;
  for (let y = ROWS - 1; y >= bgStart; y--) {
    let isBgRow = true;
    for (let x = 0; x < COLS; x++) {
      if (grid[y][x] !== 'bg-solid') {
        isBgRow = false;
        break;
      }
    }
    if (isBgRow) {
      newBgCount++;
    } else {
      break;
    }
  }
  const lastPlayableRow = ROWS - 1 - newBgCount;

  // For all other rows above, clear as usual
  for (let y = lastPlayableRow; y >= 0; y--) {
    let fullRow = true;
    for (let x = 0; x < COLS; x++) {
      if (!grid[y][x] || grid[y][x] === 'bg-solid') {
        fullRow = false;
        break;
      }
    }
    if (fullRow) {
      rowCount++;
      // Shift all rows above down
      for (let moveY = y; moveY > 0; moveY--) {
        for (let x = 0; x < COLS; x++) {
          grid[moveY][x] = grid[moveY - 1][x];
        }
      }
      for (let x = 0; x < COLS; x++) {
        grid[0][x] = 0;
      }
      y++;
    }
  }
  return rowCount;
}