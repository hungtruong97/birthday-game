// Tetromino piece creation and manipulation
import { TETROMINOES, TET_KEYS, COLS } from './constants.js';

export function createPiece(type) {
  const shapes = TETROMINOES[type];
  const shape = shapes[0].map(row => row.slice()); // start with first rotation
  return { 
    x: Math.floor(COLS/2) - Math.ceil(shape[0].length/2), 
    y: 0, 
    shape, 
    type, 
    rotation: 0 
  };
}

export function randomPiece() { 
  return TET_KEYS[Math.floor(Math.random() * TET_KEYS.length)]; 
}

export function rotatePiece(piece) {
  const nextRotation = (piece.rotation + 1) % 4;
  const nextShape = TETROMINOES[piece.type][nextRotation].map(row => row.slice());
  
  return {
    ...piece,
    shape: nextShape,
    rotation: nextRotation
  };
}