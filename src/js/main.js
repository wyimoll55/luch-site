// Общий код для всех страниц: шапка, подвал, рисование часов, карточка товара
import '../css/style.css';
import watches from '../data/watches.json';

export { watches };

// ---------- Шапка и подвал ----------
const pages = [
  { href: 'index.html', label: 'Главная' },
  { href: 'catalog.html', label: 'Каталог' },
  { href: 'about.html', label: 'О бренде' },
  { href: 'contacts.html', label: 'Контакты' },
];

function renderHeader() {
  const current = location.pathname.split('/').pop() || 'index.html';
  const links = pages
    .map(p => `<a href="${p.href}" class="${p.href === current ? 'active' : ''}">${p.label}</a>`)
    .join('');

  document.querySelector('#header').innerHTML = `
    <div class="container header-inner">
      <a href="index.html" class="logo">ЛУЧ</a>
      <button class="burger" aria-label="Меню">☰</button>
      <nav class="nav">${links}</nav>
    </div>`;

  // Мобильное меню
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav');
  burger.addEventListener('click', () => nav.classList.toggle('open'));
}

function renderFooter() {
  document.querySelector('#footer').innerHTML = `
    <div class="container footer-inner">
      <div>
        <div class="logo">ЛУЧ</div>
        <p class="muted">Учебный проект. Не является официальным сайтом бренда.</p>
      </div>
      <div class="footer-links">
        ${pages.map(p => `<a href="${p.href}">${p.label}</a>`).join('')}
      </div>
    </div>`;
}

// ---------- Рисуем циферблат через SVG ----------
// Фото пока нет, поэтому часы рисуются кодом по цветам из JSON.
// Когда появятся фото, можно заменить на <img src="...">.
export function watchSVG(w, size = 220) {
  const marks = Array.from({ length: 12 }, (_, i) => {
    const a = (i * 30 * Math.PI) / 180;
    const r1 = 78, r2 = i % 3 === 0 ? 66 : 71;
    return `<line x1="${100 + r1 * Math.sin(a)}" y1="${100 - r1 * Math.cos(a)}"
                  x2="${100 + r2 * Math.sin(a)}" y2="${100 - r2 * Math.cos(a)}"
                  stroke="${w.hand}" stroke-width="${i % 3 === 0 ? 3 : 1.5}" stroke-linecap="round"/>`;
  }).join('');

  // У однострелочника одна стрелка, у остальных две
  const hands = w.oneHand
    ? `<line x1="100" y1="100" x2="146" y2="58" stroke="${w.hand}" stroke-width="3" stroke-linecap="round"/>`
    : `<line x1="100" y1="100" x2="130" y2="78" stroke="${w.hand}" stroke-width="4" stroke-linecap="round"/>
       <line x1="100" y1="100" x2="100" y2="38" stroke="${w.hand}" stroke-width="2.5" stroke-linecap="round"/>`;

  return `
    <svg viewBox="0 0 200 200" width="${size}" height="${size}" class="watch-svg" aria-hidden="true">
      <rect x="82" y="0" width="36" height="30" rx="6" fill="#6b5f50"/>
      <rect x="82" y="170" width="36" height="30" rx="6" fill="#6b5f50"/>
      <circle cx="100" cy="100" r="92" fill="#c9ccd1"/>
      <circle cx="100" cy="100" r="86" fill="${w.dial}"/>
      ${marks}
      <text x="100" y="128" text-anchor="middle" font-size="10" letter-spacing="3"
            fill="${w.hand}" font-family="Georgia, serif">ЛУЧ</text>
      ${hands}
      <circle cx="100" cy="100" r="4" fill="${w.hand}"/>
      <rect x="190" y="94" width="8" height="12" rx="2" fill="#a9adb3"/>
    </svg>`;
}

// ---------- Карточка в каталоге ----------
export function productCard(w) {
  return `
    <a class="card" href="product.html?id=${w.id}">
      ${w.isNew ? '<span class="badge">Новинка</span>' : ''}
      <div class="card-img">${watchSVG(w, 180)}</div>
      <div class="card-body">
        <div class="muted small">${w.collection} · ${w.mechanism}</div>
        <h3>${w.name}</h3>
        <div class="price">${w.price} BYN</div>
      </div>
    </a>`;
}

renderHeader();
renderFooter();
