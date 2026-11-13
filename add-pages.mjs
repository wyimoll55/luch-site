// Дописывает страницы payment, news, museum в список страниц сборки (vite.config.js)
import fs from 'node:fs';
const file = ['vite.config.js', 'vite.config.mjs', 'vite.config.ts'].find(f => fs.existsSync(f));
if (!file) { console.log('НЕ НАЙДЕН vite.config.js. Запустите команду в папке проекта.'); process.exit(1); }
const pages = ['payment', 'news', 'museum'];
let text = fs.readFileSync(file, 'utf8');
const need = pages.filter(p => !text.includes(p + '.html'));
if (!need.length) { console.log('Страницы уже есть в ' + file + ', менять нечего.'); process.exit(0); }
const lines = text.split('\n');
const i = lines.findIndex(l => l.includes('contacts.html'));
if (i < 0) { console.log('В ' + file + ' нет строки с contacts.html. Пришлите этот файл.'); process.exit(1); }
const line = lines[i];
if ((line.match(/\.html/g) || []).length > 1) {
  // все страницы записаны в одну строку
  const q = line.match(/(['"`])contacts\.html\1/);
  if (!q) { console.log('Не удалось разобрать строку. Пришлите ' + file + '.'); process.exit(1); }
  lines[i] = line.replace(q[0], [q[0], ...need.map(p => q[1] + p + '.html' + q[1])].join(', '));
} else {
  const cr = line.endsWith('\r') ? '\r' : '';
  let base = line.replace(/\r$/, '').replace(/\s+$/, '');
  if (!base.endsWith(',')) base += ',';
  lines[i] = base + cr;
  lines.splice(i + 1, 0, ...need.map(p => base.replace(/contacts/g, p) + cr));
}
fs.copyFileSync(file, file + '.bak');
fs.writeFileSync(file, lines.join('\n'));
console.log('Готово: в ' + file + ' добавлены ' + need.join(', ') + '. Копия старого файла: ' + file + '.bak');
