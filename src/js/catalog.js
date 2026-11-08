import { watches, collections, productCard } from './main.js';

const list = document.querySelector('#catalog-list');
const count = document.querySelector('#count');
const about = document.querySelector('#collection-about');
const form = document.querySelector('#filters');
const params = new URLSearchParams(location.search);

// Текст из строки поиска в шапке: catalog.html?q=formal
const query = (params.get('q') || '').trim().toLowerCase();
const searchInput = document.querySelector('.search input');
if (searchInput) searchInput.value = query;

// Список всех коллекций в фильтре
form.collection.innerHTML =
  '<option value="">Все коллекции</option>' +
  collections.map(c => `<option value="${c.slug}">${c.name} (${c.count})</option>`).join('');

// Коллекция из адреса: catalog.html?collection=1801
if (params.get('collection')) form.collection.value = params.get('collection');

function render() {
  const gender = form.gender.value;
  const mechanism = form.mechanism.value;
  const slug = form.collection.value;
  const sort = form.sort.value;

  let result = watches.filter(w =>
    (!gender || w.gender === gender) &&
    (!mechanism || w.mechanism === mechanism) &&
    (!slug || w.collectionSlug === slug) &&
    (!query || w.name.toLowerCase().includes(query) || w.collection.toLowerCase().includes(query))
  );

  // Модели без цены всегда в конце
  const price = w => w.price ?? Infinity;
  if (sort === 'asc') result = [...result].sort((a, b) => price(a) - price(b));
  if (sort === 'desc') result = [...result].sort((a, b) => (b.price ?? -1) - (a.price ?? -1));

  // Описание выбранной коллекции над карточками
  const c = collections.find(x => x.slug === slug);
  about.innerHTML = c
    ? `<h2>${c.name}</h2><p>${c.about}</p>
       <a class="small muted" href="${c.url}" target="_blank" rel="noopener">Коллекция на luch.by ↗</a>`
    : '';

  count.textContent = (query ? `Поиск «${query}». ` : '') + `Найдено: ${result.length}`;
  list.innerHTML = result.length
    ? result.map(productCard).join('')
    : '<p class="muted">Ничего не найдено. Попробуйте изменить фильтры.</p>';
}

form.addEventListener('change', render);
form.addEventListener('reset', () => setTimeout(render));

render();
