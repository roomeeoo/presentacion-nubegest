// Navegación de la presentación. El movimiento vive en CSS: aquí solo se decide
// qué diapositiva está activa, cuál sale y en qué sentido se avanza.
const deck = document.querySelector('.deck');
const slides = [...deck.querySelectorAll('.slide')];
const seam = deck.querySelector('.deck__seam');
const controls = document.querySelector('.controls');
const counter = controls.querySelector('[data-current]');
const EXIT_TIME = 1000;

let current = 0;
let exitTimer;

function slideFromHash() {
  const index = slides.findIndex(slide => `#${slide.id}` === location.hash);
  return Math.max(index, 0);
}

function render() {
  slides.forEach((slide, i) => slide.inert = i !== current);
  counter.textContent = String(current + 1).padStart(2, '0');
  controls.style.setProperty('--progress', (current + 1) / slides.length);
  history.replaceState(null, '', `#${slides[current].id}`);
}

function goTo(index) {
  index = Math.min(Math.max(index, 0), slides.length - 1);
  if (index === current) return;

  // Un cambio rápido corta la salida anterior para que nunca convivan tres diapositivas.
  clearTimeout(exitTimer);
  slides.forEach(slide => slide.classList.remove('is-leaving'));

  const leaving = slides[current];
  deck.dataset.direction = index > current ? 'forward' : 'backward';
  leaving.classList.replace('is-active', 'is-leaving');
  slides[index].classList.add('is-active');
  current = index;

  seam.classList.remove('is-sweeping');
  void seam.offsetWidth; // reinicia la animación del trazo
  seam.classList.add('is-sweeping');

  exitTimer = setTimeout(() => leaving.classList.remove('is-leaving'), EXIT_TIME);
  render();
}

const actions = {
  next: () => goTo(current + 1),
  prev: () => goTo(current - 1),
  restart: () => goTo(0),
  last: () => goTo(slides.length - 1),
  fullscreen: () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.(),
};

const keys = {
  ArrowRight: 'next', ArrowDown: 'next', PageDown: 'next', ' ': 'next',
  ArrowLeft: 'prev', ArrowUp: 'prev', PageUp: 'prev',
  Home: 'restart', End: 'last', f: 'fullscreen', F: 'fullscreen',
};

document.addEventListener('keydown', event => {
  const action = keys[event.key];
  if (!action || event.altKey || event.ctrlKey || event.metaKey) return;
  if (event.key === ' ' && event.target.closest('button')) return;
  event.preventDefault();
  actions[action]();
});

controls.addEventListener('click', event => {
  const button = event.target.closest('[data-action]');
  if (button) actions[button.dataset.action]();
});

// Deslizar con el dedo
let touchStart = null;
deck.addEventListener('touchstart', event => { touchStart = event.touches[0]; }, { passive: true });
deck.addEventListener('touchend', event => {
  if (!touchStart) return;
  const dx = event.changedTouches[0].clientX - touchStart.clientX;
  const dy = event.changedTouches[0].clientY - touchStart.clientY;
  touchStart = null;
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) actions[dx < 0 ? 'next' : 'prev']();
});

window.addEventListener('hashchange', () => goTo(slideFromHash()));

// Arranque: si la URL apunta a una diapositiva, se abre directamente en ella.
const initial = slideFromHash();
if (initial !== current) {
  slides[current].classList.remove('is-active');
  slides[initial].classList.add('is-active');
  current = initial;
}
render();
