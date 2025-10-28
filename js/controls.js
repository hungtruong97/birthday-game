// Input handling and controls
import { current, isRunning } from './gameState.js';
import { grid } from './gameState.js';
import { collide } from './grid.js';
import { rotatePiece } from './tetromino.js';
import { draw } from './drawing.js';
import { playerDrop } from './main.js';

export function playerMove(dir) {
  current.x += dir;
  if (collide(grid, current)) {
    current.x -= dir;
  }
}

export function playerRotate() {
  const rotatedPiece = rotatePiece(current);
  const oldShape = current.shape;
  const oldRotation = current.rotation;
  
  current.shape = rotatedPiece.shape;
  current.rotation = rotatedPiece.rotation;
  
  // wall kick simple attempt
  if (collide(grid, current)) {
    current.x++;
    if (collide(grid, current)) {
      current.x -= 2;
      if (collide(grid, current)) {
        // revert rotation
        current.shape = oldShape;
        current.rotation = oldRotation;
        current.x++;
      }
    }
  }
}

export function hookControls() {
  // Button controls
  const btnLeft = document.getElementById('btn-left');
  const btnRight = document.getElementById('btn-right');
  const btnRotate = document.getElementById('btn-rotate');
  const btnDrop = document.getElementById('btn-drop');

  if (btnLeft) btnLeft.addEventListener('click', () => {
    if (!isRunning) return;
    playerMove(-1);
    draw();
  });
  if (btnRight) btnRight.addEventListener('click', () => {
    if (!isRunning) return;
    playerMove(1);
    draw();
  });
  if (btnRotate) btnRotate.addEventListener('click', () => {
    if (!isRunning) return;
    playerRotate();
    draw();
  });
  if (btnDrop) btnDrop.addEventListener('click', () => {
    if (!isRunning) return;
    playerDrop();
    draw();
  });

  // keyboard for development
  window.addEventListener('keydown', e => {
    if (!isRunning) return;
    if (e.key === 'ArrowLeft') playerMove(-1);
    if (e.key === 'ArrowRight') playerMove(1);
    if (e.key === 'ArrowUp') playerRotate();
    if (e.key === 'ArrowDown') playerDrop();
    draw();
  });
}