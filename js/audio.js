// js/audio.js
let currentSpeechRate = 1.0;

const SAKURA_FEMALE_KEYWORDS = ['ayumi', 'kyoko', 'nanami', 'haruka', 'mei', 'sakura', 'female', 'woman', 'jaa', 'jac', 'jae', '女性', '女'];

function getJapaneseFemaleVoice() {
  const voices = window.speechSynthesis.getVoices();
  const jaVoices = voices.filter(v => v.lang.includes('ja') || v.lang.includes('JA'));
  
  let femaleVoices = [];
  let unknownVoices = [];
  
  jaVoices.forEach(v => {
    const lowerName = v.name.toLowerCase();
    if (SAKURA_FEMALE_KEYWORDS.some(k => lowerName.includes(k))) {
      femaleVoices.push(v);
    } else {
      unknownVoices.push(v);
    }
  });
  
  // Prefer explicitly matched female voices, otherwise fallback to any Japanese voice
  if (femaleVoices.length > 0) return femaleVoices[0];
  if (unknownVoices.length > 0) return unknownVoices[0];
  return jaVoices[0] || null;
}

function applyVoiceAndPitch(utterance) {
  const voice = getJapaneseFemaleVoice();
  if (voice) {
    utterance.voice = voice;
  }
  utterance.pitch = 1.0;
}

function speakJapanese(text) {
  if (!('speechSynthesis' in window)) { 
    alert('您的瀏覽器不支援語音功能'); 
    return; 
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ja-JP';
  utterance.rate = currentSpeechRate;
  applyVoiceAndPitch(utterance);
  window.speechSynthesis.speak(utterance);
}

function setSpeechRate(rate, btnEl) {
  currentSpeechRate = rate;
  const speedBtns = document.querySelectorAll('.speed-control .speed-btn');
  speedBtns.forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  localStorage.setItem('sakura_speech_rate', rate);
}

document.addEventListener('DOMContentLoaded', () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  }
});
