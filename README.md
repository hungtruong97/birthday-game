# Photo-Block Tetris — Specs

Current Features:

- Tetris-like gameplay with manual controls (left, right, rotate, drop)
- The goal: reveal a family photo by clearing rows
- The background image is revealed only in the bottom 8 rows, one row at a time
- When the 8th row is revealed, the game ends and shows a win message
- The image is cropped and centered to fit the grid, preserving its aspect ratio
- No distortion of the photo
- Responsive mobile-first UI
- No upload required: default photo is used

How to play:

1. Open `index.html` in your browser
2. Tap Start/Restart to begin
3. Use the on-screen controls to move, rotate, and drop blocks
4. Clear rows at the bottom to reveal the photo
5. When all 8 rows are revealed, you win!

---

## TODO (next features)

1. Add levels: each level requires clearing a higher number of rows to win
2. Update the UI to make it look cuter
3. Show the win/message on the game screen (not just alert)
4. Remove the first page, add new controls
