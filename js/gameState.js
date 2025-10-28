// Game state management
import { COLS, ROWS, levelSpeeds } from './constants.js';

export let grid = createMatrix(COLS, ROWS);
export let current = null;
export let nextPiece = null;
export let dropCounter = 0;
export let dropInterval = levelSpeeds[0];
export let lastTime = 0;
export let isRunning = false;
export let score = 0;
export let totalLines = 0;
export let level = 1;

export function createMatrix(w, h) {
  const m = [];
  for (let y = 0; y < h; y++) {
    m.push(new Array(w).fill(0));
  }
  return m;
}

export function clearMatrix() {
  grid = createMatrix(COLS, ROWS);
}

export function setCurrent(piece) {
  current = piece;
}

export function setNextPiece(piece) {
  nextPiece = piece;
}

export function setIsRunning(running) {
  isRunning = running;
}

export function resetGame() {
  clearMatrix();
  dropCounter = 0;
  score = 0;
  totalLines = 0;
  level = 1;
  dropInterval = levelSpeeds[0];
  isRunning = true;
}

export function addScore(linesCleared) {
  const points = [0, 40, 100, 300, 1200];
  score += points[linesCleared] || 0;
}

export function updateLevel(cleared) {
  if (cleared) {
    totalLines += cleared;
    const newLevel = Math.min(5, Math.floor(totalLines / 5) + 1);
    if (newLevel !== level) {
      level = newLevel;
      dropInterval = levelSpeeds[level - 1];
    }
  }
}