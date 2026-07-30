// js/progress.js
function toggleArticleLearned(articleId) {
  let learned = JSON.parse(localStorage.getItem('sakura_learned_articles') || '[]');
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
  const learned = JSON.parse(localStorage.getItem('sakura_learned_articles') || '[]');
  const btn = document.getElementById('mark-learned-btn');
  if (btn && learned.includes(articleId)) {
    btn.classList.add('is-learned');
    btn.innerHTML = '🎉 已完成本單元學習！ (點擊取消)';
  }

  const savedRate = parseFloat(localStorage.getItem('sakura_speech_rate') || '1.0');
  if (typeof currentSpeechRate !== 'undefined') currentSpeechRate = savedRate;
  document.querySelectorAll('.speed-control .speed-btn').forEach(b => {
    b.classList.toggle('active', parseFloat(b.getAttribute('data-rate')) === savedRate);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('mark-learned-btn');
  if (btn) {
    const match = (btn.getAttribute('onclick') || '').match(/toggleArticleLearned\(['"]([^'"]+)['"]\)/);
    const articleId = match ? match[1] : btn.getAttribute('data-article-id');
    if (articleId) initArticleLearnedState(articleId);
  }
});
