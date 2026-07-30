// さくら先生の日本語教室 JavaScript Logic

// 1. Feature Tab Switcher
document.addEventListener('DOMContentLoaded', () => {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const activeContent = document.getElementById(`tab-${targetTab}`);
      if (activeContent) {
        activeContent.classList.add('active');
      }
    });
  });

  // Initialize Quiz options
  initQuiz();
  
  // Initialize AI Assistant
  initAssistant();

  // Initialize Progress Tracking & Level Filter
  initProgressAndFilters();
  initSpeechRateSettings();
});

function initSpeechRateSettings() {
  const form = document.getElementById('speech-rate-settings-form');
  if (!form || typeof getSpeechRateConfig !== 'function') return;

  const slowInput = document.getElementById('speech-rate-slow');
  const normalInput = document.getElementById('speech-rate-normal');
  const status = document.getElementById('speech-rate-settings-status');
  const config = getSpeechRateConfig();
  slowInput.value = config.slow.toFixed(2);
  normalInput.value = config.normal.toFixed(2);

  form.addEventListener('submit', event => {
    event.preventDefault();
    try {
      saveSpeechRateConfig(slowInput.value, normalInput.value);
      const saved = getSpeechRateConfig();
      slowInput.value = saved.slow.toFixed(2);
      normalInput.value = saved.normal.toFixed(2);
      status.textContent = `已儲存：慢速 ${saved.slow.toFixed(2)}、普通 ${saved.normal.toFixed(2)}。`;
      status.className = 'speech-rate-settings-status is-success';
    } catch (error) {
      status.textContent = error.message;
      status.className = 'speech-rate-settings-status is-error';
    }
  });
}

// ===== Progress Tracking & Level Filter System =====
function initProgressAndFilters() {
  updateProgressUI();

  // Filter Buttons
  const filterBtns = document.querySelectorAll('.level-filter-btn');
  const cards = document.querySelectorAll('.article-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const level = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const cardLevel = card.getAttribute('data-level');
        if (level === 'all' || cardLevel === level || !cardLevel) {
          card.classList.remove('hidden-by-filter');
        } else {
          card.classList.add('hidden-by-filter');
        }
      });
    });
  });
}

function updateProgressUI() {
  const learned = JSON.parse(localStorage.getItem('sakura_learned_articles') || '[]');
  const cards = document.querySelectorAll('.article-card[data-article-id]');
  const totalArticles = cards.length || 11;

  cards.forEach(card => {
    const id = card.getAttribute('data-article-id');
    if (learned.includes(id)) {
      card.classList.add('completed');
    } else {
      card.classList.remove('completed');
    }
  });

  const validLearnedCount = cards.length > 0
    ? Array.from(cards).filter(card => learned.includes(card.getAttribute('data-article-id'))).length
    : learned.length;

  const percent = Math.min(100, Math.round((validLearnedCount / totalArticles) * 100));

  const textEl = document.getElementById('progress-text');
  const fillEl = document.getElementById('progress-fill');

  if (textEl) textEl.textContent = `已學 ${validLearnedCount} / ${totalArticles} 篇 (${percent}%)`;
  if (fillEl) fillEl.style.width = `${percent}%`;
}


// 3. Quiz System
const quizData = [
  {
    question: "「林檎」的讀音與意思是什麼？",
    options: [
      "りあご (Ria-go) - 橘子",
      "りんご (Ri-n-go) - 蘋果",
      "いちご (I-chi-go) - 草莓",
      "ぶどう (Bu-dou) - 葡萄"
    ],
    correct: 1,
    explanation: "よくできました！『りんご』就是蘋果喔！"
  },
  {
    question: "想表達「我想去日本」，應該怎麼說？",
    options: [
      "日本へ行きます",
      "日本へ行きたいです",
      "日本へ行きました",
      "日本へ行きません"
    ],
    correct: 1,
    explanation: "素晴らしい！『動詞ます形去掉ます ＋ たいです』表示想要做某事。"
  },
  {
    question: "短文『ともだちのたんじょうび』中，「あさ、プレゼントを＿＿＿。」空格應填入？",
    options: [
      "たべます (吃)",
      "かいます (買)",
      "とります (照相)",
      "あそびます (玩)"
    ],
    correct: 1,
    explanation: "正解です！早上買禮物是「あさ、プレゼントをかいます」。"
  }
];

let currentQuizIndex = 0;

function initQuiz() {
  renderQuiz(currentQuizIndex);
}

function renderQuiz(index) {
  const q = quizData[index];
  const qEl = document.getElementById('quiz-question-text');
  const optBox = document.getElementById('quiz-options-box');
  const fbBox = document.getElementById('quiz-feedback');

  if (!qEl || !optBox) return;

  qEl.textContent = `【Q${index + 1}】 ${q.question}`;
  optBox.innerHTML = '';
  fbBox.className = 'quiz-feedback';
  fbBox.style.display = 'none';

  q.options.forEach((optText, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-opt-btn';
    btn.textContent = `${['A', 'B', 'C', 'D'][i]}. ${optText}`;
    btn.onclick = () => checkAnswer(i, q.correct, q.explanation, btn);
    optBox.appendChild(btn);
  });
}

function checkAnswer(selected, correct, explanation, btnEl) {
  const allBtns = document.querySelectorAll('.quiz-opt-btn');
  allBtns.forEach(b => b.disabled = true);

  const fbBox = document.getElementById('quiz-feedback');
  fbBox.style.display = 'block';

  if (selected === correct) {
    btnEl.classList.add('correct');
    fbBox.style.background = '#D1FAE5';
    fbBox.style.color = '#065F46';
    fbBox.innerHTML = `🌸 <b>よくできました！（做得很好！）</b><br>${explanation}`;
    speakJapanese("よくできました！素晴らしい！");
  } else {
    btnEl.classList.add('wrong');
    allBtns[correct].classList.add('correct');
    fbBox.style.background = '#FEE2E2';
    fbBox.style.color = '#991B1B';
    fbBox.innerHTML = `🌸 <b>大丈夫ですよ！（沒關係的！）</b><br>正確答案是 B 喔！加油，下次一定沒問題的。`;
  }
}

function nextQuiz() {
  currentQuizIndex = (currentQuizIndex + 1) % quizData.length;
  renderQuiz(currentQuizIndex);
}

// 4. Translation Helper Simulator
function translateText() {
  const input = document.getElementById('translate-input').value.trim();
  const resultBox = document.getElementById('translate-result');

  if (!input) {
    alert('請輸入想要翻譯的中文句子喔！');
    return;
  }

  // Pre-configured translation logic for demonstration
  let jpText = "日本へ旅行に行きたいです。";
  let romaji = "Ni-ho-n e ryo-ko-u ni i-ki-ta-i de-su.";
  let breakdown = "• 日本（にほん）：日本<br>• へ：方向助詞（往...）<br>• 旅行（りょこう）：旅行<br>• に：目的助詞（去做...）<br>• 行きたいです（いきたいです）：想要去（動詞ます形 ＋ たいです）";

  if (input.includes('生日') || input.includes('禮物')) {
    jpText = "友達の誕生日プレゼントを買います。";
    romaji = "To-mo-da-chi no ta-n-ji-yo-u-bi pu-re-ze-n-to o ka-i-ma-su.";
    breakdown = "• 友達（ともだち）：朋友<br>• の：的<br>• 誕生日（たんじょうび）：生日<br>• プレゼント：禮物<br>• を：受詞助詞<br>• 買います（かいます）：買";
  } else if (input.includes('蘋果') || input.includes('吃')) {
    jpText = "甘いりんごを食べます。";
    romaji = "A-ma-i ri-n-go o ta-be-ma-su.";
    breakdown = "• 甘い（あまい）：甜的<br>• りんご：蘋果<br>• を：受詞助詞<br>• 食べます（たべます）：吃";
  }

  resultBox.innerHTML = `
    <div style="font-size: 1.2rem; font-weight: bold; color: #E65C83; margin-bottom: 0.4rem;">
      ${jpText} 
      <button class="audio-btn" style="display:inline-flex; width:28px; height:28px; font-size:0.8rem;" onclick="speakJapanese('${jpText}')">🔊</button>
    </div>
    <div style="font-size: 0.9rem; color: #64748B; margin-bottom: 0.8rem;">羅馬字：${romaji}</div>
    <div style="font-size: 0.9rem; line-height: 1.6; background: white; padding: 0.8rem; border-radius: 8px;">
      <b>🌸 さくら先生的句型解析：</b><br>${breakdown}
    </div>
  `;
}

// 5. Floating Sakura-sensei AI Assistant
function initAssistant() {
  const toggleBtn = document.getElementById('assistant-toggle-btn');
  const windowEl = document.getElementById('assistant-window');
  const closeBtn = document.getElementById('assistant-close-btn');

  if (toggleBtn && windowEl) {
    toggleBtn.addEventListener('click', () => {
      windowEl.classList.toggle('open');
    });

    closeBtn.addEventListener('click', () => {
      windowEl.classList.remove('open');
    });
  }
}

function sendAssistantMessage() {
  const inputEl = document.getElementById('assistant-input');
  const msgBox = document.getElementById('assistant-messages');
  const text = inputEl.value.trim();

  if (!text) return;

  // Add User Message
  const userBubble = document.createElement('div');
  userBubble.className = 'chat-bubble user';
  userBubble.innerHTML = `<div class="bubble-text">${escapeHtml(text)}</div>`;
  msgBox.appendChild(userBubble);

  inputEl.value = '';
  msgBox.scrollTop = msgBox.scrollHeight;

  // Simulate Sakura Sensei response
  setTimeout(() => {
    const teacherBubble = document.createElement('div');
    teacherBubble.className = 'chat-bubble teacher';
    
    let reply = "みなさん、こんにちは！我是さくら先生🌸。這是一個非常好的問題喔！學習日文最重要的是保持好心情，毎日にほんごを楽しく勉強しましょう！您想練習什麼句型呢？";
    
    if (text.includes('你好') || text.includes('こんにちは')) {
      reply = "こんにちは！我是さくら先生🌸！很高興見到你！今天想學習單字、文法，還是看短文故事呢？よく頑張っていますね！";
    } else if (text.includes('謝謝') || text.includes('ありがとう')) {
      reply = "どういたしまして！（不客氣！）學習上有任何問題都可以隨時問さくら先生喔！正向思考最棒了✨！";
    } else if (text.includes('造句') || text.includes('練習')) {
      reply = "太棒了！練習造句是進步最快的方法！您可以試著用『〜たいです（想要做...）』造一個句子發給我，さくら先生幫您指導糾錯喔！";
    }

    teacherBubble.innerHTML = `
      <div class="bubble-avatar">🌸</div>
      <div class="bubble-text">${reply}</div>
    `;
    msgBox.appendChild(teacherBubble);
    msgBox.scrollTop = msgBox.scrollHeight;
  }, 600);
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, function(m) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[m];
  });
}
