import { watches, collections, productCard } from './main.js';

// ---------- Настройки фильтров ----------
// key — поле в watches.json, options — галочки. В одной группе работает «ИЛИ», между группами — «И».
const GROUPS = {
  wrist: [
    { key: 'gender', title: 'Тип часов', options: ['Женские', 'Мужские', 'Детские', 'Унисекс'] },
    { key: 'winding', title: 'Тип механизма', options: ['Кварцевый', 'Механические (автоподзавод)', 'Механические (ручной завод)'] },
    { key: 'movementBrand', title: 'Механизм', options: ['Луч, РБ', 'Miyota, Япония', 'Seiko, Япония', 'Ronda, Швейцария', 'Sellita, Швейцария', 'Восток, РФ'] },
    { key: 'caseMaterial', title: 'Материал корпуса', options: ['Керамика', 'Дамасская сталь', 'Дерево', 'Латунь', 'Нержавеющая сталь', 'Пластик', 'Сталь', 'Титан'] },
    { key: 'glassType', title: 'Стекло', collapsed: true, options: ['Сапфировое', 'Минеральное'] },
    { key: 'waterRes', title: 'Водонепроницаемость', collapsed: true, options: ['3 бар', '5 бар', '10 бар'] },
    { key: 'chrono', title: 'Хронограф', collapsed: true, options: ['Есть'], value: w => (w.chrono ? 'Есть' : null) },
  ],
  interior: [
    { key: 'type', title: 'Тип часов', options: ['Будильник', 'Настольные часы'], labels: { 'Будильник': 'Будильники' } },
  ],
  accessories: [],
};
const FLAGS = [
  { key: 'isNew', title: 'Новинки' },
  { key: 'limited', title: 'Лимитированная серия' },
];

// ---------- Состояние ----------
const params = new URLSearchParams(location.search);
const query = (params.get('q') || '').trim().toLowerCase();
let collectionSlug = params.get('collection') || '';
let tab = params.get('tab') || 'wrist';
if (collectionSlug) {
  const first = watches.find(w => w.collectionSlug === collectionSlug);
  if (first) tab = first.category;
}
const checked = {};          // { gender: Set(['Мужские']), isNew: true, ... }
const collapsed = {};        // какие группы свёрнуты
const PAGE = 24;
let shown = PAGE;

const el = id => document.getElementById(id);
const fromInput = el('price-from'), toInput = el('price-to'), sortSel = el('sort');
const searchInput = document.querySelector('.search input');
if (searchInput) searchInput.value = query;

const fieldValue = (g, w) => (g.value ? g.value(w) : w[g.key]);
const inTab = w => w.category === tab;
const maxPrice = () => Math.max(0, ...watches.filter(inTab).map(w => w.priceByn || 0));

// ---------- Фильтрация ----------
function filtered() {
  const from = Number(fromInput.value) || 0;
  const to = Number(toInput.value) || Infinity;
  const priceTouched = from > 0 || to < maxPrice();

  let list = watches.filter(w =>
    inTab(w) &&
    (!collectionSlug || w.collectionSlug === collectionSlug) &&
    (!query || w.name.toLowerCase().includes(query) || w.collection.toLowerCase().includes(query)) &&
    FLAGS.every(f => !checked[f.key] || w[f.key]) &&
    GROUPS[tab].every(g => !checked[g.key]?.size || checked[g.key].has(fieldValue(g, w))) &&
    (w.priceByn ? w.priceByn >= from && w.priceByn <= to : !priceTouched)
  );

  const price = (w, empty) => w.priceByn ?? empty;
  if (sortSel.value === 'asc') list = [...list].sort((a, b) => price(a, Infinity) - price(b, Infinity));
  if (sortSel.value === 'desc') list = [...list].sort((a, b) => price(b, -1) - price(a, -1));
  if (sortSel.value === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name, 'ru'));
  return list;
}

// ---------- Отрисовка ----------
function renderFilters() {
  const base = watches.filter(inTab);
  const count = (g, opt) => base.filter(w => fieldValue(g, w) === opt).length;

  const flags = FLAGS.map(f => `
    <label class="check-row flag">
      <input type="checkbox" data-flag="${f.key}" ${checked[f.key] ? 'checked' : ''} />
      <span>${f.title}</span>
    </label>`).join('');

  const groups = GROUPS[tab].map(g => {
    const isCollapsed = collapsed[g.key] ?? !!g.collapsed;
    const opts = g.options.map(o => {
      const n = count(g, o);
      return `
        <label class="check-row ${n ? '' : 'empty'}">
          <input type="checkbox" data-group="${g.key}" value="${o}" ${checked[g.key]?.has(o) ? 'checked' : ''} ${n ? '' : 'disabled'} />
          <span>${g.labels?.[o] || o}</span><em>${n}</em>
        </label>`;
    }).join('');
    return `
      <div class="filter-group ${isCollapsed ? 'collapsed' : ''}">
        <button class="group-head" data-toggle="${g.key}">
          <span>${g.title}</span><i class="group-sign">${isCollapsed ? '+' : '−'}</i>
        </button>
        <div class="group-body">${opts}</div>
      </div>`;
  }).join('');

  el('filter-groups').innerHTML = flags + groups;
}

function renderTabs() {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
}

function renderList() {
  const list = filtered();
  const c = collections.find(x => x.slug === collectionSlug);
  el('active-collection').innerHTML = c
    ? `<span class="chip">Коллекция: ${c.name} <button id="clear-collection" aria-label="Убрать">✕</button></span>
       <p class="muted small">${c.about}</p>`
    : '';

  el('count').textContent = (query ? `Поиск «${query}». ` : '') + `Найдено: ${list.length}`;

  if (tab === 'accessories') {
    el('catalog-list').innerHTML = '<p class="muted">Ремешки и аксессуары скоро появятся.</p>';
  } else {
    el('catalog-list').innerHTML = list.length
      ? list.slice(0, shown).map(productCard).join('')
      : '<p class="muted">Ничего не найдено. Попробуйте изменить фильтры.</p>';
  }
  el('more').parentElement.style.display = list.length > shown ? '' : 'none';
}

function resetPrice() {
  fromInput.value = 0;
  toInput.value = maxPrice();
}

function update() { shown = PAGE; renderList(); }

// ---------- События ----------
el('tabs').addEventListener('click', e => {
  const b = e.target.closest('.tab-btn');
  if (!b || b.dataset.tab === tab) return;
  tab = b.dataset.tab;
  collectionSlug = '';
  Object.keys(checked).forEach(k => delete checked[k]);
  resetPrice(); renderTabs(); renderFilters(); update();
});

el('filter-groups').addEventListener('click', e => {
  const head = e.target.closest('[data-toggle]');
  if (!head) return;
  const key = head.dataset.toggle;
  const g = GROUPS[tab].find(x => x.key === key);
  collapsed[key] = !(collapsed[key] ?? !!g.collapsed);
  renderFilters();
});

el('filter-groups').addEventListener('change', e => {
  const t = e.target;
  if (t.dataset.flag) checked[t.dataset.flag] = t.checked;
  if (t.dataset.group) {
    const set = (checked[t.dataset.group] ||= new Set());
    t.checked ? set.add(t.value) : set.delete(t.value);
  }
  update();
});

el('active-collection').addEventListener('click', e => {
  if (e.target.id !== 'clear-collection') return;
  collectionSlug = '';
  history.replaceState(null, '', 'catalog.html');
  update();
});

[fromInput, toInput].forEach(i => i.addEventListener('input', update));
sortSel.addEventListener('change', update);

el('reset').addEventListener('click', () => {
  Object.keys(checked).forEach(k => delete checked[k]);
  sortSel.value = '';
  resetPrice(); renderFilters(); update();
});

el('more').addEventListener('click', () => { shown += PAGE; renderList(); });

el('filters-toggle').addEventListener('click', () => el('filters').classList.toggle('open'));

// ---------- Старт ----------
resetPrice();
renderTabs();
renderFilters();
renderList();
