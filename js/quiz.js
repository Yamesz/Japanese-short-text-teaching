// js/quiz.js
let quizScores = {};

// Normalize the older Story02/03 quiz markup to the shared quiz contract.
// New lessons should author .quiz-question-block directly; this bridge keeps
// existing lessons functional while they are migrated.
function upgradeLegacyQuizMarkup() {
  const legacyGroups = new Map();

  document.querySelectorAll('.quiz-opt-btn[onclick*="checkQuizQuestion"]').forEach(button => {
    const match = button.getAttribute('onclick').match(/checkQuizQuestion\('([^']+)'/);
    if (!match) return;
    const questionId = match[1];
    const options = button.parentElement;
    if (!legacyGroups.has(questionId)) legacyGroups.set(questionId, options);
  });

  legacyGroups.forEach((options, questionId) => {
    if (document.getElementById(`quiz-block-${questionId}`)) return;

    const block = document.createElement('div');
    block.id = `quiz-block-${questionId}`;
    block.className = 'quiz-question-block';
    options.parentNode.insertBefore(block, options.previousElementSibling);

    const question = options.previousElementSibling;
    if (question && question.tagName === 'P') block.appendChild(question);
    block.appendChild(options);

    const feedback = document.createElement('div');
    feedback.id = `quiz-fb-${questionId}`;
    feedback.className = 'quiz-feedback';
    feedback.style.display = 'none';
    feedback.style.marginTop = '1rem';
    block.appendChild(feedback);
  });

  if (legacyGroups.size > 0 && !document.getElementById('quiz-score-summary')) {
    const summary = document.createElement('div');
    summary.id = 'quiz-score-summary';
    summary.className = 'quiz-score-summary';
    summary.innerHTML = '<h3 style="color: var(--deep-sakura); margin-bottom: 0.5rem;">🎉 測驗完成結果</h3><div class="quiz-score-number"></div><div class="quiz-score-msg" style="color: var(--text-dark); font-weight: bold; margin-top: 0.5rem;"></div>';
    const lastBlock = Array.from(legacyGroups.values()).at(-1).closest('.quiz-question-block');
    if (lastBlock) lastBlock.parentElement.appendChild(summary);
  }
}

function checkQuizQuestion(qId, selectedIdx, correctIdx, explanation) {
  const fb = document.getElementById(`quiz-fb-${qId}`);
  const block = document.getElementById(`quiz-block-${qId}`);
  if (!fb || !block) return;

  const buttons = block.querySelectorAll('.quiz-opt-btn');
  buttons.forEach(b => b.disabled = true);
  fb.style.display = 'block';

  if (selectedIdx === correctIdx) {
    quizScores[qId] = true;
    buttons[selectedIdx].style.background = '#D1FAE5';
    buttons[selectedIdx].style.borderColor = '#059669';
    fb.style.background = '#D1FAE5';
    fb.style.color = '#065F46';
    fb.innerHTML = `🌸 <b>よくできました！（做得很好！）</b><br>${explanation}`;
    if (typeof speakJapanese === 'function') speakJapanese("よくできました！");
  } else {
    quizScores[qId] = false;
    buttons[selectedIdx].style.background = '#FEE2E2';
    buttons[selectedIdx].style.borderColor = '#DC2626';
    if (buttons[correctIdx]) {
      buttons[correctIdx].style.background = '#D1FAE5';
      buttons[correctIdx].style.borderColor = '#059669';
    }
    fb.style.background = '#FEE2E2';
    fb.style.color = '#991B1B';
    fb.innerHTML = `🌸 <b>大丈夫ですよ！（別挫折喔！）</b><br>${explanation}`;
  }
  updateQuizSummary();
}

function updateQuizSummary() {
  const totalQuestions = document.querySelectorAll('.quiz-question-block').length;
  const answeredCount = Object.keys(quizScores).length;

  if (answeredCount >= totalQuestions && totalQuestions > 0) {
    const correctCount = Object.values(quizScores).filter(Boolean).length;
    const summaryBox = document.getElementById('quiz-score-summary');
    if (summaryBox) {
      summaryBox.classList.add('show');
      const scoreNum = summaryBox.querySelector('.quiz-score-number');
      const scoreMsg = summaryBox.querySelector('.quiz-score-msg');
      const score = Math.round((correctCount / totalQuestions) * 100);
      
      if (scoreNum) scoreNum.textContent = `${score} 分`;
      if (scoreMsg) {
        if (score === 100) scoreMsg.innerHTML = '🌟 滿分！太棒了，你完全掌握了這個單元！';
        else if (score >= 60) scoreMsg.innerHTML = '🌸 及格囉！繼續保持，複習錯題會更進步！';
        else scoreMsg.innerHTML = '💪 再接再厲！再讀一次短文與動詞寶庫試試看吧！';
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', upgradeLegacyQuizMarkup);
