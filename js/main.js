// Main game loop and initialization
import { initCanvas, resizeCanvas, draw } from './drawing.js';
import { hookControls } from './controls.js';
import { 
  resetGame, 
  setCurrent, 
  setNextPiece, 
  setIsRunning,
  current,
  nextPiece,
  isRunning,
  grid,
  score,
  totalLines,
  level,
  addScore,
  updateLevel,
  lastTime
} from './gameState.js';
import { createPiece, randomPiece } from './tetromino.js';
import { collide, merge, sweep } from './grid.js';
import { setBackgroundImg, renderThumbs } from './background.js';

// DOM elements
const levelEl = document.getElementById('level');
const scoreEl = document.getElementById('score');
const linesEl = document.getElementById('lines');
const startBtn = document.getElementById('start-btn');
const imagesUpload = document.getElementById('images-upload');

export function playerDrop() {
  current.y++;
  if (collide(grid, current)) {
    current.y--;
    merge(grid, current);
    const cleared = sweep();
    if (cleared) {
      addScore(cleared);
      updateLevel(cleared);
    }
    // spawn next
    setCurrent(nextPiece || createPiece(randomPiece()));
    setNextPiece(createPiece(randomPiece()));
    if (collide(grid, current)) {
      // game over
      setIsRunning(false);
      alert('Game over! Tap Start to try again.');
    }
    updateUI();
  }
  updateUI();
}

export function updateUI() {
  levelEl.textContent = level;
  scoreEl.textContent = score;
  linesEl.textContent = totalLines;
}

function update(time = 0) {
  if (!isRunning) return;
  const delta = time - lastTime;
  lastTime = time;
  
  draw();
  requestAnimationFrame(update);
}

function startGame() {
  console.log('Starting game...');
  resetGame();
  setCurrent(createPiece(randomPiece()));
  setNextPiece(createPiece(randomPiece()));
  setIsRunning(true); // This was missing!
  updateUI();
  requestAnimationFrame(update);
  console.log('Game started, isRunning:', isRunning);
}

// Upload handling
imagesUpload.addEventListener('change', (ev) => {
  const file = ev.target.files[0];
  if (!file || !file.type.startsWith('image/')) return;
  const img = new Image();
  const url = URL.createObjectURL(file);
  img.onload = () => {
    setBackgroundImg(img);
    renderThumbs();
    URL.revokeObjectURL(url);
  };
  img.src = url;
});

// Start button
startBtn.addEventListener('click', () => {
  console.log('Start button clicked!');
  
  // Hide controls panel and wrapper, show game area when game starts
  const controlsPanel = document.getElementById('controls-panel');
  const controlsWrapper = document.getElementById('controls-wrapper');
  const gameWrapper = document.getElementById('game-wrapper');
  
  console.log('Elements found:', {
    controlsPanel: !!controlsPanel,
    controlsWrapper: !!controlsWrapper, 
    gameWrapper: !!gameWrapper
  });
  
  if (controlsPanel) {
    controlsPanel.style.display = 'none';
    console.log('Hidden controls panel');
  }
  if (controlsWrapper) {
    controlsWrapper.style.display = 'none';
    console.log('Hidden controls wrapper');
  }
  if (gameWrapper) {
    gameWrapper.style.display = '';
    console.log('Showed game wrapper');
  }
  
  try {
    startGame();
    console.log('Started game successfully');
  } catch (error) {
    console.error('Error starting game:', error);
  }
});

// Responsive
window.addEventListener('resize', () => {
  resizeCanvas();
  draw();
});

// Initialize
(function init() {
  console.log('Initializing game...');
  initCanvas();
  resizeCanvas();
  hookControls();
  
  // Load default background image
  const defaultImg = new Image();
  defaultImg.onload = () => {
    console.log('Default background loaded');
    setBackgroundImg(defaultImg);
    renderThumbs();
    draw();
  };
  defaultImg.onerror = () => {
    console.log('Could not load default background, continuing without it');
    draw();
  };
  defaultImg.src = 'photos/memory1.jpg';
  
  updateUI();
  console.log('Game initialized');
})();