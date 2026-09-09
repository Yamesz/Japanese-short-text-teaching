function zelda40YouTubeUrl(seconds) {
  return `${ZELDA40_SOURCE}&t=${Math.max(0, Math.floor(seconds))}s`;
}

function renderZelda40Series() {
  const grid = document.getElementById('series-grid');
  if (!grid) return;

  grid.innerHTML = ZELDA40_UNITS.map(unit => `
    <a class="series-unit-card" data-level="${unit.level}" data-article-id="${unit.id}" href="./${unit.no}/index.html">
      <div class="series-unit-meta">
        <span class="series-unit-no">第 ${unit.no} 篇</span>
        <span class="series-unit-level ${unit.level}">${unit.level}</span>
      </div>
      <div class="series-unit-title">${unit.title}</div>
      <div class="series-unit-subtitle">${unit.titleCn}</div>
      <div class="series-unit-source">${unit.subtitleRange}・${unit.start}–${unit.end}<span class="series-unit-done">　✅ 已學習</span></div>
    </a>
  `).join('');
}

function updateZelda40SeriesProgress() {
  const learned = new Set(typeof getLearnedArticles === 'function' ? getLearnedArticles() : []);
  const cards = document.querySelectorAll('.series-unit-card');
  let count = 0;
  cards.forEach(card => {
    const done = learned.has(card.dataset.articleId);
    card.classList.toggle('completed', done);
    if (done) count += 1;
  });
  const total = cards.length;
  const percent = total ? Math.round((count / total) * 100) : 0;
  const text = document.getElementById('series-progress-text');
  const fill = document.getElementById('series-progress-fill');
  if (text) text.textContent = `已學 ${count} / ${total} 篇 (${percent}%)`;
  if (fill) fill.style.width = `${percent}%`;
}

function initZelda40Filters() {
  const buttons = document.querySelectorAll('.series-filter-btn');
  const cards = document.querySelectorAll('.series-unit-card');
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      buttons.forEach(item => item.classList.remove('active'));
      button.classList.add('active');
      const filter = button.dataset.filter;
      cards.forEach(card => card.classList.toggle('hidden', filter !== 'all' && card.dataset.level !== filter));
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderZelda40Series();
  initZelda40Filters();
  updateZelda40SeriesProgress();
});
