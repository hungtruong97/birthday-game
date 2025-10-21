// Photo-Block Tetris - mobile-first prototype
// Lightweight Tetris implementation that uses uploaded images as block textures.
// Controls: left, right, rotate, soft drop, hard drop
// 5 levels: speed increases as lines are cleared. Everything runs client-side.

(() => {
  // Canvas & layout
  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  const levelEl = document.getElementById('level');
  const scoreEl = document.getElementById('score');
  const linesEl = document.getElementById('lines');
  const overlay = document.getElementById('overlay');
  const memPhoto = document.getElementById('memory-photo');
  const memCaption = document.getElementById('memory-caption');
  const closeModal = document.getElementById('close-modal');

  const startBtn = document.getElementById('start-btn');
  const imagesUpload = document.getElementById('images-upload');
  const thumbs = document.getElementById('thumbs');

  // Mobile controls
  const leftBtn = document.getElementById('left');
  const rightBtn = document.getElementById('right');
  const rotateBtn = document.getElementById('rotate');
  const downBtn = document.getElementById('down');
  const dropBtn = document.getElementById('drop');

  // Game constants
  const COLS = 10;
  const ROWS = 20;
  let blockSize = 32; // will adjust to canvas size
  let canvasWidth = 320;
  let canvasHeight = 640;

  // Level settings (5 levels). value = drop interval ms
  const levelSpeeds = [800, 600, 420, 300, 180];
  const linesToAdvance = 5; // every 5 lines -> next level
  const maxLevel = 5;

  // Game state
  let grid = createMatrix(COLS, ROWS);
  let current = null;
  let nextPiece = null;
  let dropCounter = 0;
  let dropInterval = levelSpeeds[0];
  let lastTime = 0;
  let isRunning = false;
  let score = 0;
  let totalLines = 0;
  let level = 1;

  // Photo textures uploaded by user
  let textures = []; // array of Image objects
  let memQueue = []; // queue of photos to show when a line is cleared (cycle through uploaded images)

  // Tetris pieces (tetromino shapes)
  const TETROMINOES = {
    I: [[1,1,1,1]],
    J: [[1,0,0],[1,1,1]],
    L: [[0,0,1],[1,1,1]],
    O: [[1,1],[1,1]],
    S: [[0,1,1],[1,1,0]],
    T: [[0,1,0],[1,1,1]],
    Z: [[1,1,0],[0,1,1]]
  };
  const TET_KEYS = Object.keys(TETROMINOES);

  // Helpers
  function createMatrix(w,h){
    const m=[];
    for(let y=0;y<h;y++){
      m.push(new Array(w).fill(0));
    }
    return m;
  }

  function clearMatrix(){
    grid = createMatrix(COLS, ROWS);
  }

  // Piece factory
  function createPiece(type){
    const shape = TETROMINOES[type].map(row => row.slice());
    // assign a texture index to this piece (choose random from uploaded textures, fallback to color)
    const texIndex = textures.length ? Math.floor(Math.random()*textures.length) : -1;
    return { x: Math.floor(COLS/2) - Math.ceil(shape[0].length/2), y: 0, shape, texIndex, type };
  }

  // Collision detection
  function collide(grid, piece){
    const { shape, x: px, y: py } = piece;
    for(let y=0;y<shape.length;y++){
      for(let x=0;x<shape[y].length;x++){
        if(shape[y][x]){
          const gx = px + x;
          const gy = py + y;
          if(gx < 0 || gx >= COLS || gy >= ROWS) return true;
          if(gy >= 0 && grid[gy][gx]) return true;
        }
      }
    }
    return false;
  }

  // Merge piece into grid
  function merge(grid, piece){
    const { shape, x: px, y: py, texIndex } = piece;
    for(let y=0;y<shape.length;y++){
      for(let x=0;x<shape[y].length;x++){
        if(shape[y][x]){
          const gx = px + x;
          const gy = py + y;
          if(gy>=0 && gy<ROWS && gx>=0 && gx<COLS){
            // store an object with texture index or color
            grid[gy][gx] = texIndex >= 0 ? { tex: texIndex } : 1;
          }
        }
      }
    }
  }

  // Rotate matrix
  function rotate(matrix, dir){
    // transpose
    for(let y=0;y<matrix.length;y++){
      for(let x=0;x<y;x++){
        [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
      }
    }
    // reverse rows or columns
    if(dir > 0){
      matrix.forEach(row => row.reverse());
    } else {
      matrix.reverse();
    }
    return matrix;
  }

  // Clear full lines and return number cleared
  function sweep(){
    let rowCount = 0;
    outer: for(let y=ROWS-1;y>=0;y--){
      for(let x=0;x<COLS;x++){
        if(!grid[y][x]) continue outer;
      }
      // full row
      const removed = grid.splice(y,1)[0];
      grid.unshift(new Array(COLS).fill(0));
      y++; // re-check same y in next iteration
      rowCount++;
      // queue a memory photo for this cleared line
      if(textures.length) {
        const photo = memQueue.length ? memQueue.shift() : textures[Math.floor(Math.random()*textures.length)];
        memQueue.push(photo); // cycle - push back to end
        showMemory(photo);
      }
    }
    return rowCount;
  }

  // Scoring (simple)
  function addScore(linesCleared){
    const points = [0, 40, 100, 300, 1200];
    score += points[linesCleared] || 0;
  }

  // Draw helpers
  function resizeCanvas(){
    // Keep 2:1 ratio (tall phone)
    const maxWidth = Math.min(window.innerWidth - 40, 400);
    canvasWidth = maxWidth;
    canvasHeight = Math.floor(canvasWidth * 2);
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    // compute block size based on grid
    blockSize = Math.floor(canvasWidth / COLS);
  }

  function draw(){
    ctx.fillStyle = '#08111b';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // draw grid background
    for(let y=0;y<ROWS;y++){
      for(let x=0;x<COLS;x++){
        const cell = grid[y][x];
        if(cell){
          drawCell(x,y,cell);
        } else {
          // empty cell subtle grid lines
          ctx.strokeStyle = 'rgba(255,255,255,0.02)';
          ctx.strokeRect(x*blockSize, y*blockSize, blockSize, blockSize);
        }
      }
    }

    // draw current piece
    if(current){
      const { shape, x: px, y: py, texIndex } = current;
      for(let y=0;y<shape.length;y++){
        for(let x=0;x<shape[y].length;x++){
          if(shape[y][x]){
            drawCell(px + x, py + y, texIndex >= 0 ? { tex: texIndex } : 1);
          }
        }
      }
    }
  }

  function drawCell(gx, gy, cell){
    const x = gx * blockSize;
    const y = gy * blockSize;
    if(typeof cell === 'object' && cell.tex !== undefined){
      const img = textures[cell.tex];
      if(img && img.complete){
        // draw the image clipped into the block square
        try{
          ctx.drawImage(img, x, y, blockSize, blockSize);
        }catch(e){
          // fallback
          ctx.fillStyle = '#6ec6ff';
          ctx.fillRect(x,y,blockSize,blockSize);
        }
      } else {
        ctx.fillStyle = '#6ec6ff';
        ctx.fillRect(x,y,blockSize,blockSize);
      }
    } else {
      ctx.fillStyle = '#6ec6ff';
      ctx.fillRect(x,y,blockSize,blockSize);
    }
    // subtle border
    ctx.strokeStyle = 'rgba(0,0,0,0.25)';
    ctx.strokeRect(x+0.5,y+0.5,blockSize-1,blockSize-1);
  }

  // Game loop
  function update(time = 0){
    if(!isRunning) return;
    const delta = time - lastTime;
    lastTime = time;
    dropCounter += delta;
    if(dropCounter > dropInterval){
      playerDrop();
    }
    draw();
    requestAnimationFrame(update);
  }

  // Player actions
  function playerDrop(){
    current.y++;
    if(collide(grid, current)){
      current.y--;
      merge(grid, current);
      const cleared = sweep();
      if(cleared){
        totalLines += cleared;
        addScore(cleared);
        // level up logic
        const newLevel = Math.min(maxLevel, Math.floor(totalLines / linesToAdvance) + 1);
        if(newLevel !== level){
          level = newLevel;
          dropInterval = levelSpeeds[level-1];
        }
      }
      // spawn next
      current = nextPiece || createPiece(randomPiece());
      nextPiece = createPiece(randomPiece());
      if(collide(grid, current)){
        // game over
        isRunning = false;
        alert('Game over! Tap Start to try again.');
      }
      dropCounter = 0;
      updateUI();
    }
    updateUI();
  }

  function playerMove(dir){
    current.x += dir;
    if(collide(grid, current)){
      current.x -= dir;
    }
  }

  function playerRotate(){
    rotate(current.shape, 1);
    // wall kick simple attempt
    if(collide(grid, current)){
      current.x++;
      if(collide(grid, current)){
        current.x -= 2;
        if(collide(grid, current)){
          // revert rotation
          rotate(current.shape, -1);
          current.x++;
        }
      }
    }
  }

  function hardDrop(){
    while(!collide(grid, current)){
      current.y++;
    }
    current.y--;
    merge(grid, current);
    const cleared = sweep();
    if(cleared){
      totalLines += cleared;
      addScore(cleared);
      const newLevel = Math.min(maxLevel, Math.floor(totalLines / linesToAdvance) + 1);
      if(newLevel !== level){
        level = newLevel;
        dropInterval = levelSpeeds[level-1];
      }
    }
    current = nextPiece || createPiece(randomPiece());
    nextPiece = createPiece(randomPiece());
    if(collide(grid, current)){
      isRunning = false;
      alert('Game over! Tap Start to try again.');
    }
    dropCounter = 0;
    updateUI();
  }

  // Utilities
  function randomPiece(){ return TET_KEYS[Math.floor(Math.random()*TET_KEYS.length)]; }

  function updateUI(){
    levelEl.textContent = level;
    scoreEl.textContent = score;
    linesEl.textContent = totalLines;
  }

  // Memory modal when a line clears
  function showMemory(image){
    // image is an Image object (from uploaded textures)
    memPhoto.src = image.src || '';
    memCaption.textContent = ''; // user can replace via instructions
    overlay.classList.remove('hidden');
  }
  closeModal.addEventListener('click', () => {
    overlay.classList.add('hidden');
  });

  // Input handling (touch + click)
  function hookControls(){
    leftBtn.addEventListener('touchstart', e => { e.preventDefault(); playerMove(-1); draw(); }, {passive:false});
    rightBtn.addEventListener('touchstart', e => { e.preventDefault(); playerMove(1); draw(); }, {passive:false});
    rotateBtn.addEventListener('touchstart', e => { e.preventDefault(); playerRotate(); draw(); }, {passive:false});
    downBtn.addEventListener('touchstart', e => { e.preventDefault(); playerDrop(); draw(); }, {passive:false});
    dropBtn.addEventListener('touchstart', e => { e.preventDefault(); hardDrop(); draw(); }, {passive:false});

    // support click too (for desktop debugging)
    leftBtn.addEventListener('click', ()=>{ playerMove(-1); draw(); });
    rightBtn.addEventListener('click', ()=>{ playerMove(1); draw(); });
    rotateBtn.addEventListener('click', ()=>{ playerRotate(); draw(); });
    downBtn.addEventListener('click', ()=>{ playerDrop(); draw(); });
    dropBtn.addEventListener('click', ()=>{ hardDrop(); draw(); });

    // keyboard for development
    window.addEventListener('keydown', e=>{
      if(!isRunning) return;
      if(e.key === 'ArrowLeft') playerMove(-1);
      if(e.key === 'ArrowRight') playerMove(1);
      if(e.key === 'ArrowUp') playerRotate();
      if(e.key === 'ArrowDown') playerDrop();
      if(e.key === ' ') hardDrop();
      draw();
    });
  }

  // Upload handling: load images and show thumbnails
  imagesUpload.addEventListener('change', (ev) => {
    const files = Array.from(ev.target.files).slice(0, 24); // limit to prevent memory issues
    files.forEach(f => {
      if(!f.type.startsWith('image/')) return;
      const img = new Image();
      const url = URL.createObjectURL(f);
      img.onload = () => {
        textures.push(img);
        // also add to memQueue if not already
        memQueue.push(img);
        renderThumbs();
        URL.revokeObjectURL(url);
      };
      img.src = url;
    });
  });

  function renderThumbs(){
    thumbs.innerHTML = '';
    textures.forEach((img, idx) => {
      const t = document.createElement('img');
      t.src = img.src;
      t.title = `Texture ${idx+1}`;
      thumbs.appendChild(t);
    });
  }

  // Start / reset
  startBtn.addEventListener('click', startGame);

  function startGame(){
    // reset state
    clearMatrix();
    current = createPiece(randomPiece());
    nextPiece = createPiece(randomPiece());
    dropCounter = 0;
    score = 0;
    totalLines = 0;
    level = 1;
    dropInterval = levelSpeeds[0];
    isRunning = true;
    updateUI();
    requestAnimationFrame(update);
  }

  // Responsive
  window.addEventListener('resize', () => {
    resizeCanvas();
    draw();
  });

  // Initialize
  (function init(){
    resizeCanvas();
    hookControls();
    draw();
    // small instructional hint: tap Start then upload photos or upload first then start
    // pre-load a placeholder if no images available (optional)
    const placeholder = new Image();
    placeholder.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect fill="%23ffb3c6" width="100%" height="100%"/><text x="50%" y="50%" font-size="24" dominant-baseline="middle" text-anchor="middle" fill="%23071025">Upload photos to use as blocks</text></svg>';
    placeholder.onload = () => {
      // keep placeholder available if textures empty
    };
    // ensure first UI update
    updateUI();
  })();

})();
