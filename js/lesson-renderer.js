// Shared renderer for data-driven lesson passages and sentence breakdowns.
// Lesson data stays local to the unit; this module owns only repeated markup.
window.LessonRenderer = {
  renderPassage(target, sentences) {
    const root = typeof target === 'string' ? document.querySelector(target) : target;
    if (!root) return;
    root.innerHTML = sentences.map((sentence, index) => `
      <div class="karaoke-line" data-sentence-index="${index}">
        <span class="karaoke-jp">${sentence.jp}</span>
        <div class="karaoke-cn">${sentence.cn}</div>
      </div>`).join('');
  },

  renderBreakdown(target, sentences) {
    const root = typeof target === 'string' ? document.querySelector(target) : target;
    if (!root) return;
    root.innerHTML = sentences.map(sentence => `
      <div class="sentence-card">
        <div class="sentence-jp">${sentence.display}</div>
        <div class="sentence-romaji">${sentence.romaji}</div>
        <div class="sentence-cn">
          <span>中文：${sentence.cn}</span>
          <button class="audio-btn" type="button" data-speak-text="${sentence.jp}">🔊</button>
        </div>
      </div>`).join('');
  },

  bindSpeechButtons(root = document) {
    root.querySelectorAll('[data-speak-text]').forEach(button => {
      button.addEventListener('click', () => speakJapanese(button.dataset.speakText));
    });
  },

  adoptLegacyLesson() {
    if (window.LESSON_DATA || !document.querySelector('.image-viewer-card .karaoke-line')) return;
    const firstLine = document.querySelector('.image-viewer-card .karaoke-line');
    const passage = firstLine.parentElement;
    const breakdown = document.querySelector('.sentence-list');
    if (!passage || !breakdown) return;

    const sentences = Array.from(passage.querySelectorAll('.karaoke-line')).map((line, index) => {
      const detail = breakdown.querySelectorAll('.sentence-card')[index];
      return {
        jp: line.querySelector('.karaoke-jp')?.textContent.trim() || '',
        cn: line.querySelector('.karaoke-cn')?.textContent.trim() || '',
        display: detail?.querySelector('.sentence-jp')?.innerHTML.trim() || '',
        romaji: detail?.querySelector('.sentence-romaji')?.textContent.trim() || ''
      };
    });
    if (!sentences.length || sentences.some(sentence => !sentence.display)) return;

    window.LESSON_DATA = { id: document.body.dataset.articleId || '', sentences };
    this.renderPassage(passage, sentences);
    this.renderBreakdown(breakdown, sentences);
    this.bindSpeechButtons();
  }
};

document.addEventListener('DOMContentLoaded', () => window.LessonRenderer.adoptLegacyLesson());
