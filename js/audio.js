// js/audio.js
const SAKURA_SPEECH_RATE_CONFIG_KEY = 'sakura_speech_rate_config';
const SAKURA_SPEECH_SPEED_MODE_KEY = 'sakura_speech_speed_mode';
const SAKURA_SPEECH_RATE_KEY = 'sakura_speech_rate';
const SAKURA_SPEECH_RATE_DEFAULTS = Object.freeze({ slow: 0.60, normal: 1.00 });
const SAKURA_SPEECH_RATE_MIN = 0.30;
const SAKURA_SPEECH_RATE_MAX = 1.30;
const SAKURA_SPEECH_RATE_STEP = 0.05;

const SAKURA_FEMALE_KEYWORDS = ['ayumi', 'kyoko', 'nanami', 'haruka', 'mei', 'sakura', 'female', 'woman', 'jaa', 'jac', 'jae', '女性', '女'];

function isValidSpeechRate(value) {
  const isStepAligned = Math.abs((value - SAKURA_SPEECH_RATE_MIN) / SAKURA_SPEECH_RATE_STEP - Math.round((value - SAKURA_SPEECH_RATE_MIN) / SAKURA_SPEECH_RATE_STEP)) < 0.000001;
  return Number.isFinite(value) && value >= SAKURA_SPEECH_RATE_MIN && value <= SAKURA_SPEECH_RATE_MAX && isStepAligned;
}

function getSpeechRateConfig() {
  try {
    const saved = JSON.parse(localStorage.getItem(SAKURA_SPEECH_RATE_CONFIG_KEY));
    if (saved && isValidSpeechRate(Number(saved.slow)) && isValidSpeechRate(Number(saved.normal))) {
      return { slow: Number(saved.slow), normal: Number(saved.normal) };
    }
  } catch (_) {
    // Fall back to the learning-friendly defaults when storage is unavailable or invalid.
  }
  return { ...SAKURA_SPEECH_RATE_DEFAULTS };
}

function getSpeechSpeedMode() {
  const saved = localStorage.getItem(SAKURA_SPEECH_SPEED_MODE_KEY);
  if (saved === 'slow' || saved === 'normal') return saved;
  // Respect the previous two-button choice when upgrading an existing browser profile.
  const legacyRate = Number(localStorage.getItem(SAKURA_SPEECH_RATE_KEY));
  return Number.isFinite(legacyRate) && legacyRate < 0.75 ? 'slow' : 'normal';
}

function getSpeechRateForMode(mode) {
  return getSpeechRateConfig()[mode === 'slow' ? 'slow' : 'normal'];
}

let currentSpeechRate = getSpeechRateForMode(getSpeechSpeedMode());

function syncSpeedControlButtons() {
  const mode = getSpeechSpeedMode();
  const config = getSpeechRateConfig();
  document.querySelectorAll('.speed-control .speed-btn').forEach(button => {
    const buttonMode = button.textContent.includes('慢') ? 'slow' : 'normal';
    button.dataset.rate = config[buttonMode];
    button.dataset.speedMode = buttonMode;
    button.classList.toggle('active', buttonMode === mode);
  });
}

function resolveSpeechMode(rateOrMode, button) {
  if (rateOrMode === 'slow' || rateOrMode === 'normal') return rateOrMode;
  if (button?.textContent.includes('慢')) return 'slow';
  // Existing lesson markup calls 0.5 / 1.0. Preserve those controls while mapping them to global modes.
  return Number(rateOrMode) < 0.75 ? 'slow' : 'normal';
}

function setSpeechRate(rateOrMode, btnEl) {
  const mode = resolveSpeechMode(rateOrMode, btnEl);
  currentSpeechRate = getSpeechRateForMode(mode);
  localStorage.setItem(SAKURA_SPEECH_SPEED_MODE_KEY, mode);
  localStorage.setItem(SAKURA_SPEECH_RATE_KEY, String(currentSpeechRate));
  syncSpeedControlButtons();
}

function saveSpeechRateConfig(slow, normal) {
  const next = { slow: Number(slow), normal: Number(normal) };
  if (!isValidSpeechRate(next.slow) || !isValidSpeechRate(next.normal)) {
    throw new RangeError(`語速必須介於 ${SAKURA_SPEECH_RATE_MIN.toFixed(2)} 與 ${SAKURA_SPEECH_RATE_MAX.toFixed(2)} 之間。`);
  }
  localStorage.setItem(SAKURA_SPEECH_RATE_CONFIG_KEY, JSON.stringify(next));
  currentSpeechRate = next[getSpeechSpeedMode()];
  localStorage.setItem(SAKURA_SPEECH_RATE_KEY, String(currentSpeechRate));
  syncSpeedControlButtons();
}

function getJapaneseFemaleVoice() {
  const voices = window.speechSynthesis.getVoices();
  const jaVoices = voices.filter(v => v.lang.includes('ja') || v.lang.includes('JA'));
  const femaleVoice = jaVoices.find(v => SAKURA_FEMALE_KEYWORDS.some(k => v.name.toLowerCase().includes(k)));
  return femaleVoice || jaVoices[0] || null;
}

function applyVoiceAndPitch(utterance) {
  const voice = getJapaneseFemaleVoice();
  if (voice) utterance.voice = voice;
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

document.addEventListener('DOMContentLoaded', () => {
  syncSpeedControlButtons();
  if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  }
});
