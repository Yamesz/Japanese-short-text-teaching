// Shared logic for Sakura Sensei Lesson Pages

let currentSpeechRate = 1.0;

// TTS with dynamic speech rate
function speakJapanese(text) {
  if (!('speechSynthesis' in window)) {
    alert('您的瀏覽器不支援語音功能');
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ja-JP';
  utterance.rate = currentSpeechRate;

  if (typeof getPreferredJapaneseVoice === 'function') {
    const preferredVoice = getPreferredJapaneseVoice();
    if (preferredVoice) utterance.voice = preferredVoice;
  } else {
    const voices = window.speechSynthesis.getVoices();
    const jaVoice = voices.find(v => v.lang.includes('ja'));
    if (jaVoice) utterance.voice = jaVoice;
  }

  window.speechSynthesis.speak(utterance);
}

// Speed Control Buttons
function setSpeechRate(rate, btnEl) {
  currentSpeechRate = rate;
  const speedBtns = document.querySelectorAll('.speed-btn');
  speedBtns.forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  localStorage.setItem('sakura_speech_rate', rate);
}

// Conjugation Table Toggle
function toggleConjugation(id) {
  const wrapper = document.getElementById(`conjugation-${id}`);
  if (wrapper) {
    wrapper.classList.toggle('open');
  }
}

// Progress Tracking (Mark as Learned)
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
    speakJapanese('よくできました！素晴らしい！');
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

  // Restore speech rate
  const savedRate = parseFloat(localStorage.getItem('sakura_speech_rate') || '1.0');
  currentSpeechRate = savedRate;
  const speedBtns = document.querySelectorAll('.speed-btn');
  speedBtns.forEach(b => {
    if (parseFloat(b.getAttribute('data-rate')) === savedRate) {
      b.classList.add('active');
    } else {
      b.classList.remove('active');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('mark-learned-btn');
  if (btn) {
    const match = btn.getAttribute('onclick')?.match(/toggleArticleLearned\(['"]([^'"]+)['"]\)/);
    const articleId = match ? match[1] : btn.getAttribute('data-article-id');
    if (articleId) {
      initArticleLearnedState(articleId);
    }
  }
});


// Multi-Question Quiz Engine
let quizScores = {};

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
    speakJapanese("よくできました！");
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

// Toggle conjugation table visibility
function toggleConjugation(id) {
  const el = document.getElementById("conjugation-" + id);
  if (el) {
    el.classList.toggle("active");
  }
}





// === Voice Selection Logic ===
const SAKURA_MALE_KEYWORDS = ['ichiro', 'otoya', 'keita', 'daichi', 'male'];
const SAKURA_FEMALE_KEYWORDS = ['ayumi', 'kyoko', 'nanami', 'haruka', 'mei', 'sakura', 'female'];

function getJapaneseVoicesByGender() {
  const voices = window.speechSynthesis.getVoices();
  const jaVoices = voices.filter(v => v.lang.includes('ja'));
  
  const maleVoices = [];
  const femaleVoices = [];
  const unknownVoices = [];
  
  jaVoices.forEach(v => {
    const lowerName = v.name.toLowerCase();
    if (SAKURA_MALE_KEYWORDS.some(k => lowerName.includes(k))) {
      maleVoices.push(v);
    } else if (SAKURA_FEMALE_KEYWORDS.some(k => lowerName.includes(k))) {
      femaleVoices.push(v);
    } else {
      unknownVoices.push(v);
    }
  });
  
  // Combine unknown with female by default
  return {
    male: maleVoices,
    female: [...femaleVoices, ...unknownVoices]
  };
}

function getPreferredJapaneseVoice() {
  const gender = localStorage.getItem('sakura_voice_gender') || 'female';
  const voices = getJapaneseVoicesByGender();
  
  if (gender === 'male' && voices.male.length > 0) {
    return voices.male[0];
  } else if (voices.female.length > 0) {
    return voices.female[0];
  } else if (voices.male.length > 0) {
    return voices.male[0];
  }
  return null;
}

function initVoiceSelector() {
  const controlsRow = document.querySelector('.short-text-controls-row');
  if (!controlsRow) return;
  
  const oldCtrl = document.querySelector('.voice-control');
  if (oldCtrl) oldCtrl.remove();
  
  const voiceCtrl = document.createElement('div');
  voiceCtrl.className = 'voice-control';
  voiceCtrl.style.display = 'inline-flex';
  voiceCtrl.style.alignItems = 'center';
  voiceCtrl.style.gap = '0.3rem';
  voiceCtrl.style.marginRight = '1rem';
  
  const label = document.createElement('span');
  label.style.fontSize = '0.75rem';
  label.style.color = 'var(--text-muted)';
  label.style.fontWeight = 'bold';
  label.innerHTML = '🗣️ 語音：';
  
  const femaleBtn = document.createElement('button');
  femaleBtn.className = 'speed-btn';
  femaleBtn.innerHTML = '👩 女聲';
  femaleBtn.dataset.gender = 'female';
  
  const maleBtn = document.createElement('button');
  maleBtn.className = 'speed-btn';
  maleBtn.innerHTML = '👨 男聲';
  maleBtn.dataset.gender = 'male';
  
  voiceCtrl.appendChild(label);
  voiceCtrl.appendChild(femaleBtn);
  voiceCtrl.appendChild(maleBtn);
  
  const speedCtrl = controlsRow.querySelector('.speed-control');
  if (speedCtrl) {
    controlsRow.insertBefore(voiceCtrl, speedCtrl);
  } else {
    controlsRow.prepend(voiceCtrl);
  }
  
  function updateUI() {
    const gender = localStorage.getItem('sakura_voice_gender') || 'female';
    femaleBtn.classList.toggle('active', gender === 'female');
    maleBtn.classList.toggle('active', gender === 'male');
    
    const voices = getJapaneseVoicesByGender();
    if (voices.male.length === 0) {
      maleBtn.style.opacity = '0.5';
      maleBtn.title = '您的設備目前沒有安裝日文男聲語音';
    } else {
      maleBtn.style.opacity = '1';
      maleBtn.title = '';
    }
  }
  
  function setGender(g) {
    const voices = getJapaneseVoicesByGender();
    if (g === 'male' && voices.male.length === 0) {
      alert('您的設備（或瀏覽器）目前沒有安裝日文男聲語音哦！預設將使用女聲。');
      return;
    }
    localStorage.setItem('sakura_voice_gender', g);
    updateUI();
  }
  
  femaleBtn.onclick = () => setGender('female');
  maleBtn.onclick = () => setGender('male');
  
  if ('speechSynthesis' in window) {
    window.speechSynthesis.addEventListener('voiceschanged', updateUI);
  }
  updateUI();
}

document.addEventListener('DOMContentLoaded', () => {
  if ('speechSynthesis' in window) {
    initVoiceSelector();
  }
});
