// Background image handling
export let backgroundImg = null;

export function setBackgroundImg(img) {
  backgroundImg = img;
}

export function renderThumbs() {
  const thumbs = document.getElementById('thumbs');
  thumbs.innerHTML = '';
  if (backgroundImg) {
    const t = document.createElement('img');
    t.src = backgroundImg.src;
    t.title = 'Background';
    thumbs.appendChild(t);
  }
}