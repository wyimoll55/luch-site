import { watches, watchSVG, productCard } from './main.js';

// Берём id из адреса: product.html?id=3
const id = Number(new URLSearchParams(location.search).get('id'));
const w = watches.find(x => x.id === id);
const root = document.querySelector('#product');

if (!w) {
  root.innerHTML = `
    <h1>Товар не найден</h1>
    <p><a class="btn" href="catalog.html">Вернуться в каталог</a></p>`;
} else {
  document.title = `${w.name} — Луч`;

  root.innerHTML = `
    <a href="catalog.html" class="back">← Каталог</a>
    <div class="product">
      <div class="product-img">${watchSVG(w, 380)}</div>
      <div class="product-info">
        <div class="muted">${w.collection}</div>
        <h1>${w.name}</h1>
        <div class="price big">${w.price} BYN</div>
        <p>${w.description}</p>
        <table class="specs">
          <tr><td>Механизм</td><td>${w.mechanism}</td></tr>
          <tr><td>Корпус</td><td>${w.case}</td></tr>
          <tr><td>Стекло</td><td>${w.glass}</td></tr>
          <tr><td>Водозащита</td><td>${w.water}</td></tr>
          <tr><td>Ремешок</td><td>${w.strap}</td></tr>
          <tr><td>Для кого</td><td>${w.gender}</td></tr>
        </table>
        <button class="btn" id="buy">Где купить</button>
        <p class="muted small" id="buy-msg"></p>
      </div>
    </div>
    <h2 class="section-title">Из той же коллекции</h2>
    <div class="grid" id="similar"></div>`;

  document.querySelector('#buy').addEventListener('click', () => {
    document.querySelector('#buy-msg').textContent =
      'Адреса магазинов — на странице «Контакты».';
  });

  const similar = watches.filter(x => x.collection === w.collection && x.id !== w.id);
  document.querySelector('#similar').innerHTML = similar.length
    ? similar.map(productCard).join('')
    : '<p class="muted">Других моделей в коллекции пока нет.</p>';
}
