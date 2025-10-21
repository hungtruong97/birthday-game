```markdown
# Photo-Block Tetris — Prototype

A mobile-first Tetris-like web game that uses your family photos as block textures. Built as a one-week prototype and designed to be hosted as a static website (GitHub Pages / Netlify / Vercel).

Goals you specified:
- 5 levels, increasing difficulty
- Mobile device focused
- Hosted on a website (static)
- Buildable within one week

What this prototype includes
- index.html / style.css / game.js — a minimal Tetris implementation
- Mobile touch controls (large buttons)
- Photo upload (client-side) — uploaded images are used as block textures
- Memory overlay: when a line is cleared, a photo from your uploads is shown as a "Memory unlocked!"
- Progression across 5 levels — speed increases as lines are cleared

How to use (development / local)
1. Download the files (index.html, style.css, game.js, README.md) into a folder.
2. Open index.html in a mobile browser or desktop browser (for testing).
   - For mobile testing, you can serve locally with a simple static server:
     - Python 3: `python -m http.server 8000` then visit `http://localhost:8000`
     - Node: `npx serve .`
3. Tap "Start / Restart" to begin.
4. Upload photos using the "Upload photos" button. Photos stay in the browser — nothing is uploaded to any server.
5. Play using the on-screen controls: left, rotate, right, soft drop, hard drop.

Photos & personalization
- Upload 6–12 photos for good variety (max ~24 supported).
- The uploaded images are used as textures for the falling blocks. When you clear a line, one of the uploaded photos is revealed in a modal.
- For voice notes: you can keep voice files locally and pair them later — the prototype focuses on photos and the in-browser reveal. If you'd like, I can add a simple audio-pairing UI (upload audio files and attach to photos) in the next iteration.

Deploying to the web (quick)
Option A — GitHub Pages:
1. Create a repository on GitHub (e.g., `yourname/photo-tetris`).
2. Push the files to the `main` branch.
3. Enable GitHub Pages from repository Settings → Pages → Source: `main` / `/ (root)`.
4. Visit the provided `https://yourname.github.io/photo-tetris/`.

Option B — Netlify / Vercel:
1. Drag & drop the project folder into Netlify Drop (https://app.netlify.com/drop), or connect repo in Netlify/Vercel.
2. Deploy — site is served over HTTPS.

One-week build plan (day-by-day)
Day 1 — Core scaffold
Day 2 — Mobile controls & responsiveness
Day 3 — Photo upload & textures
Day 4 — Level progression & polish
Day 5 — Bugfixing & UI polish
Day 6 — Testing on devices
Day 7 — Deploy & wrap-up
```
