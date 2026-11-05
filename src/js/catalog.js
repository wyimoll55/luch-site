import { watches, productCard } from './main.js';

const list = document.querySelector('#catalog-list');
const count = document.querySelector('#count');
const form = document.querySelector('#filters');

// Заполняем список коллекций из данных
const collections = [...new Set(watches.map(w => w.collection))];
form.collection.innerHTML =
  '<option value="">Все коллекции</option>' +
  collections.map(c => `<option>${c}</option>`).join('');

function render() {
  const gender = form.gender.value;
  const mechanism = form.mechanism.value;
  const collection = form.collection.value;
  const sort = form.sort.value;

  let result = watches.filter(w =>
    (!gender || w.gender === gender) &&
    (!mechanism || w.mechanism === mechanism) &&
    (!collection || w.collection === collection)
  );

  if (sort === 'asc') result = [...result].sort((a, b) => a.price - b.price);
  if (sort === 'desc') result = [...result].sort((a, b) => b.price - a.price);

  count.textContent = `Найдено: ${result.length}`;
  list.innerHTML = result.length
    ? result.map(productCard).join('')
    : '<p class="muted">Ничего не найдено. Попробуйте изменить фильтры.</p>';
}

form.addEventListener('change', render);
form.addEventListener('reset', () => setTimeout(render));

render();
