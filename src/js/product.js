import '../css/gallery.css';
import { watches, productImage, productCard, formatPrice, getCart, glass } from './main.js';

// Берём id (артикул) из адреса: product.html?id=97460638
const id = new URLSearchParams(location.search).get('id');
const w = watches.find(x => x.id === id);
const root = document.querySelector('#product');
const dash = v => v || '—';

if (!w) {
  root.innerHTML = `
    <h1>Товар не найден</h1>
    <p><a class="btn" href="catalog.html">Вернуться в каталог</a></p>`;
} else {
  document.title = `${w.name} — Луч`;

  root.innerHTML = `
    <a href="catalog.html?collection=${w.collectionSlug}" class="back">← ${w.collection}</a>
    <div class="product">
      ${(w.gallery && w.gallery.length > 1) ? galleryHTML(w.gallery, w.name) : `<div class="product-img ${w.image ? 'has-photo' : ''}">${productImage(w, 380)}</div>`}
      <div class="product-info">
        <a class="muted" href="catalog.html?collection=${w.collectionSlug}">Коллекция ${w.collection}</a>
        <h1>${w.name}</h1>
        <div class="price big">${formatPrice(w.priceByn)}</div>
        <table class="specs">
          ${w.article !== '—' ? `<tr><td>Артикул</td><td>${w.article}</td></tr>` : ''}
          ${w.category === 'accessories' ? `
          <tr><td>Тип изделия</td><td>${dash(w.type)}</td></tr>
          <tr><td>Материал</td><td>${dash(w.material)}</td></tr>
          <tr><td>Цвет</td><td>${dash(w.color)}</td></tr>
          ${w.width ? `<tr><td>Ширина</td><td>${w.width} мм</td></tr>` : ''}` : `
          <tr><td>Механизм</td><td>${dash(w.mechanism)}</td></tr>
          <tr><td>Корпус</td><td>${dash(w.case)}</td></tr>
          <tr><td>Стекло</td><td>${dash(w.glass)}</td></tr>
          <tr><td>Водозащита</td><td>${dash(w.water)}</td></tr>
          <tr><td>Для кого</td><td>${dash(w.gender)}</td></tr>`}
        </table>
        <button class="btn cart-btn ${getCart().includes(w.id) ? 'in-cart' : ''}" data-id="${w.id}">${getCart().includes(w.id) ? 'В корзине ✓' : 'В корзину'}</button>
        ${w.url ? `<a class="btn light" href="${w.url}" target="_blank" rel="noopener">Смотреть на luch.by</a>` : ''}
        <p class="muted small" style="margin-top:12px">Адреса магазинов — на странице <a href="contacts.html">«Контакты»</a>.</p>
      </div>
    </div>
    <h2 class="section-title">Из той же коллекции</h2>
    <div class="grid" id="similar"></div>`;

  const similar = watches.filter(x => x.collectionSlug === w.collectionSlug && x.id !== w.id);
  document.querySelector('#similar').innerHTML = similar.length
    ? similar.map(productCard).join('')
    : '<p class="muted">Других моделей в коллекции нет.</p>';
}

// ---------- Галерея как на luch.by: миниатюры слева, стрелки у главного фото ----------
function galleryHTML(imgs, name) {
  return `
  <div class="gallery" id="gallery">
    <div class="g-thumbs">
      <button class="g-up" aria-label="Выше">&#8963;</button>
      <div class="g-list">${imgs.map((src, i) => `<button class="g-thumb ${i === 0 ? 'active' : ''}" data-i="${i}"><img src="${src}" alt="${name}, фото ${i + 1}" /></button>`).join('')}</div>
      <button class="g-down" aria-label="Ниже">&#8964;</button>
    </div>
    <div class="g-main">
      <img id="g-big" src="${imgs[0]}" alt="${name}" />
      <button class="g-arrow g-prev" aria-label="Предыдущее фото">←</button>
      <button class="g-arrow g-next" aria-label="Следующее фото">→</button>
    </div>
  </div>`;
}

const gallery = document.querySelector('#gallery');
if (gallery) {
  const thumbs = [...gallery.querySelectorAll('.g-thumb')];
  const big = gallery.querySelector('#g-big');
  const list = gallery.querySelector('.g-list');
  gallery.querySelectorAll('.g-arrow').forEach(glass);
  let cur = 0;
  function go(i) {
    cur = (i + thumbs.length) % thumbs.length;
    big.src = thumbs[cur].querySelector('img').src;
    thumbs.forEach((t, n) => t.classList.toggle('active', n === cur));
  }
  thumbs.forEach((t, n) => t.addEventListener('click', () => go(n)));
  gallery.querySelector('.g-prev').addEventListener('click', () => go(cur - 1));
  gallery.querySelector('.g-next').addEventListener('click', () => go(cur + 1));
  gallery.querySelector('.g-up').addEventListener('click', () => go(cur - 1));
  gallery.querySelector('.g-down').addEventListener('click', () => go(cur + 1));
  // Если фото одно-два, стрелки у миниатюр не нужны — оставляем их только при большом списке
  if (thumbs.length <= 4) gallery.classList.add('few');
}
