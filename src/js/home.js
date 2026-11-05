import { watches, watchSVG, productCard } from './main.js';

// Большие часы в баннере — первый однострелочник
document.querySelector('#hero-watch').innerHTML = watchSVG(watches[0], 340);

// Новинки
const news = watches.filter(w => w.isNew);
document.querySelector('#new-list').innerHTML = news.map(productCard).join('');
