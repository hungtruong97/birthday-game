// Drawing and rendering logic
import { COLS, ROWS } from './constants.js';
import { grid, current } from './gameState.js';
import { backgroundImg } from './background.js';

export let canvas, ctx;
export let blockSize = 32;
export let canvasWidth = 320;
export let canvasHeight = 640;

export function initCanvas() {
  console.log('Initializing canvas...');
  canvas = document.getElementById('game-canvas');
  console.log('Canvas element:', canvas);
  if (!canvas) {
    console.error('Canvas element not found!');
    return;
  }
  ctx = canvas.getContext('2d', { alpha: false });
  console.log('Canvas context:', ctx);
}

export function resizeCanvas() {
  // Keep 2:1 ratio (tall phone)
  const maxWidth = Math.min(window.innerWidth - 40, 400);
  canvasWidth = maxWidth;
  canvasHeight = Math.floor(canvasWidth * 2);
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  // compute block size based on grid
  blockSize = Math.floor(canvasWidth / COLS);
}

export function draw() {

  // Draw solid background
  ctx.fillStyle = '#08111b';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw grid cells
  const bgRows = 8;
  const bgStart = ROWS - bgRows;
  // Calculate grid area for background
  const gridW = COLS * blockSize;
  const gridH = bgRows * blockSize;
  if (backgroundImg) {
    // Calculate scale to cover grid area, preserve aspect ratio
    const imgRatio = backgroundImg.width / backgroundImg.height;
    const gridRatio = gridW / gridH;
    let srcW, srcH, srcX, srcY;
    if (imgRatio > gridRatio) {
      // Image is wider, crop sides
      srcH = backgroundImg.height;
      srcW = srcH * gridRatio;
      srcX = (backgroundImg.width - srcW) / 2;
      srcY = 0;
    } else {
      // Image is taller, crop top/bottom
      srcW = backgroundImg.width;
      srcH = srcW / gridRatio;
      srcX = 0;
      srcY = (backgroundImg.height - srcH) / 2;
    }
    // Draw each cell
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const cell = grid[y][x];
        if (cell === 'bg-solid' && y >= bgStart) {
          // Calculate cell's position in cropped image
          const cellSrcX = srcX + (x / COLS) * srcW;
          const cellSrcY = srcY + ((y - bgStart) / bgRows) * srcH;
          ctx.drawImage(
            backgroundImg,
            cellSrcX, cellSrcY, srcW / COLS, srcH / bgRows,
            x * blockSize, y * blockSize, blockSize, blockSize
          );
        } else if (cell) {
          drawCell(x, y, cell);
        } else {
          ctx.strokeStyle = 'rgba(255,255,255,0.02)';
          ctx.strokeRect(x * blockSize, y * blockSize, blockSize, blockSize);
        }
      }
    }
  } else {
    // No background image, draw grid as usual
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const cell = grid[y][x];
        if (cell) {
          drawCell(x, y, cell);
        } else {
          ctx.strokeStyle = 'rgba(255,255,255,0.02)';
          ctx.strokeRect(x * blockSize, y * blockSize, blockSize, blockSize);
        }
      }
    }
  }

  // draw current piece
  if (current) {
    const { shape, x: px, y: py } = current;
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          drawCell(px + x, py + y, 1);
        }
      }
    }
  }
}

export function drawCell(gx, gy, cell) {
  const x = gx * blockSize;
  const y = gy * blockSize;
  ctx.fillStyle = '#6ec6ff';
  ctx.fillRect(x, y, blockSize, blockSize);
  // subtle border
  ctx.strokeStyle = 'rgba(0,0,0,0.25)';
  ctx.strokeRect(x + 0.5, y + 0.5, blockSize - 1, blockSize - 1);
}