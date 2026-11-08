// Общий код для всех страниц: шапка, подвал, рисование часов, карточка товара
import '../css/style.css';
import watches from '../data/watches.json';

export { watches };

// ---------- Шапка и подвал ----------
// Меню как в макете: «Интернет-магазин» с выпадающим списком + отдельные кнопки
const shopMenu = [
  { href: 'index.html', label: 'Главная' },
  { href: 'catalog.html', label: 'Каталог' },
  { href: '#', label: 'Спецзаказ' },
  { href: 'about.html', label: 'О компании' },
  { href: 'contacts.html', label: 'Контакты' },
];
const topMenu = [
  { href: '#', label: 'Оплата и доставка' },
  { href: '#', label: 'Новости и акции' },
  { href: '#', label: 'Музей' },
];

function renderHeader() {
  const current = location.pathname.split('/').pop() || 'index.html';
  const dropdown = shopMenu
    .map(p => `<li><a href="${p.href}" class="${p.href === current ? 'current' : ''}">${p.label}</a></li>`)
    .join('');

  document.querySelector('#header').innerHTML = `
    <div class="container header-inner">
      <button class="burger pill" aria-label="Меню">☰</button>
      <nav class="nav">
        <div class="dropdown">
          <button class="pill" id="shop-btn">Интернет-магазин <span class="arrow">▾</span></button>
          <ul class="dropdown-menu">${dropdown}</ul>
        </div>
        ${topMenu.map(p => `<a class="pill" href="${p.href}">${p.label}</a>`).join('')}
      </nav>
      <form class="search pill" action="catalog.html">
        <input name="q" placeholder="Поиск" aria-label="Поиск" />
        <span aria-hidden="true">⌕</span>
      </form>
      <a href="index.html" class="logo"><img src="images/logo.svg" alt="Луч" /></a>
    </div>`;

  // Выпадающее меню
  const dd = document.querySelector('.dropdown');
  document.querySelector('#shop-btn').addEventListener('click', e => {
    e.stopPropagation();
    dd.classList.toggle('open');
  });
  document.addEventListener('click', () => dd.classList.remove('open'));

  // Мобильное меню
  document.querySelector('.burger').addEventListener('click', () =>
    document.querySelector('.nav').classList.toggle('open'));
}

function renderFooter() {
  document.querySelector('#footer').innerHTML = `
    <div class="container footer-inner">
      <div class="footer-legal">
        <p class="footer-company">ОАО "Минский часовой завод"</p>
        <p>
          220043, г. Минск, пр. Независимости, 95; УНП 100230391<br>
          Свидетельство о государственной регистрации ОАО "Минский часовой завод" №100230391<br>
          от 24 марта 2016, выданное Минским горисполкомом.<br>
          Регистрационный номер интернет-магазина luch.by в торговом реестре РБ №157658<br>
          от 06.04.2016, выдан Администрацией Первомайского района.
        </p>
        <p class="footer-policies">
          <a href="#">Политика конфиденциальности</a> |
          <a href="#">Политика в отношении обработки cookies</a> |<br>
          <a href="#">Политика видеонаблюдения</a> |
          <a href="#">Порядок подачи покупателем обращений</a>
        </p>
        <p class="footer-note">
          По вопросам защиты прав потребителей можно обратиться в администрацию Первомайского района г.Минска<br>
          по адресу: г.Минск, пер. К. Чорного, 5.
        </p>
        <p class="footer-note">
          Номер контактного телефона, адрес электронной почты лица, уполномоченного продавцом рассматривать обращения<br>
          покупателей о нарушении их прав, предусмотренных законодательством о защите<br>
          прав потребителей: <a href="tel:+375447033645">+375 44 703-36-45</a>, <a href="mailto:shop@luch.by">shop@luch.by</a>.
        </p>
        <p class="footer-copy">© 2013 — ${new Date().getFullYear()} ОАО "Минский часовой завод". Все права защищены</p>
        <p class="footer-copy muted">Учебный проект команды «Солнечные», БГУИР</p>
      </div>

      <div class="footer-shop">
        <h3>Интернет магазин:</h3>
        <p>
          Tel: <a href="tel:7187">7187</a><br>
          Tel: <a href="tel:+375292725156">+375 (29) 272-51-56</a> (МТС)<br>
          Tel: <a href="tel:+375293157526">+375 (29) 315-75-26</a> (А1)
        </p>
        <p class="footer-hours">ПН-ВС: с 10:00 до 20:00</p>
        <p><a class="footer-mail" href="mailto:shop@luch.by">shop@luch.by</a></p>
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
