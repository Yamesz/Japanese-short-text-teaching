// js/progress.js
const LEGACY_ARTICLE_IDS = {
  'prog-story-01': 'progressive-01',
  'prog-story-04': 'progressive-04'
};

function getLearnedArticles() {
  const learned = JSON.parse(localStorage.getItem('sakura_learned_articles') || '[]');
  const normalized = [...new Set(learned.map(id => LEGACY_ARTICLE_IDS[id] || id))];
  if (normalized.length !== learned.length || normalized.some((id, index) => id !== learned[index])) {
    localStorage.setItem('sakura_learned_articles', JSON.stringify(normalized));
  }
  return normalized;
}

function toggleArticleLearned(articleId) {
  let learned = getLearnedArticles();
  const index = learned.indexOf(articleId);
  const btn = document.getElementById('mark-learned-btn');

  if (index === -1) {
    learned.push(articleId);
    if (btn) {
      btn.classList.add('is-learned');
      btn.innerHTML = '🎉 已完成本單元學習！ (點擊取消)';
    }
    if (typeof speakJapanese === 'function') speakJapanese('よくできました！素晴らしい！');
  } else {
    learned.splice(index, 1);
    if (btn) {
      btn.classList.remove('is-learned');
      btn.innerHTML = '✅ 標記為已學習';
    }
  }
  localStorage.setItem('sakura_learned_articles', JSON.stringify(learned));
}

function initArticleLearnedState(articleId) {
  const learned = getLearnedArticles();
  const btn = document.getElementById('mark-learned-btn');
  if (btn && learned.includes(articleId)) {
    btn.classList.add('is-learned');
    btn.innerHTML = '🎉 已完成本單元學習！ (點擊取消)';
  }

  if (typeof syncSpeedControlButtons === 'function') syncSpeedControlButtons();
}

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('mark-learned-btn');
  if (btn) {
    const match = (btn.getAttribute('onclick') || '').match(/toggleArticleLearned\(['"]([^'"]+)['"]\)/);
    const articleId = match ? match[1] : btn.getAttribute('data-article-id');
    if (articleId) initArticleLearnedState(articleId);
  }
});
