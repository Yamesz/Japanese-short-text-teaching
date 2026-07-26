const fs = require('fs');
let content = fs.readFileSync('n:\\vibe\\Projet\\短文教學\\lesson-common.js', 'utf8');

const voice_logic = \
// === Voice Selection Logic ===
function getPreferredJapaneseVoice() {
  const voices = window.speechSynthesis.getVoices();
  const jaVoices = voices.filter(v => v.lang.includes('ja'));
  
  if (jaVoices.length === 0) return null;
  
  const savedVoiceURI = localStorage.getItem('sakura_voice_uri');
  if (savedVoiceURI) {
    const savedVoice = jaVoices.find(v => v.voiceURI === savedVoiceURI);
    if (savedVoice) return savedVoice;
  }
  
  return jaVoices[0];
}

function initVoiceSelector() {
  const controlsRow = document.querySelector('.short-text-controls-row');
  if (!controlsRow) return;
  
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
  
  const select = document.createElement('select');
  select.id = 'sakura-voice-select';
  select.style.fontSize = '0.85rem';
  select.style.padding = '0.2rem 0.5rem';
  select.style.borderRadius = '20px';
  select.style.border = '1px solid var(--primary-pink)';
  select.style.backgroundColor = 'white';
  select.style.color = 'var(--text-color)';
  select.style.outline = 'none';
  select.style.cursor = 'pointer';
  
  voiceCtrl.appendChild(label);
  voiceCtrl.appendChild(select);
  
  const speedCtrl = controlsRow.querySelector('.speed-control');
  if (speedCtrl) {
    controlsRow.insertBefore(voiceCtrl, speedCtrl);
  } else {
    controlsRow.prepend(voiceCtrl);
  }
  
  function populateVoices() {
    const voices = window.speechSynthesis.getVoices();
    const jaVoices = voices.filter(v => v.lang.includes('ja'));
    
    if (jaVoices.length === 0) return;
    
    select.innerHTML = '';
    const savedVoiceURI = localStorage.getItem('sakura_voice_uri');
    
    jaVoices.forEach(voice => {
      const option = document.createElement('option');
      option.value = voice.voiceURI;
      let genderHint = '';
      const lowerName = voice.name.toLowerCase();
      if (lowerName.includes('ayumi') || lowerName.includes('kyoko') || lowerName.includes('nanami') || lowerName.includes('haruka')) genderHint = ' (女聲)';
      if (lowerName.includes('ichiro') || lowerName.includes('otoya') || lowerName.includes('keita') || lowerName.includes('daichi')) genderHint = ' (男聲)';
      
      option.textContent = voice.name + genderHint;
      if (voice.voiceURI === savedVoiceURI) {
        option.selected = true;
      }
      select.appendChild(option);
    });
    
    if (!savedVoiceURI && jaVoices.length > 0) {
      select.value = jaVoices[0].voiceURI;
      localStorage.setItem('sakura_voice_uri', jaVoices[0].voiceURI);
    }
  }
  
  populateVoices();
  if ('speechSynthesis' in window) {
    window.speechSynthesis.addEventListener('voiceschanged', populateVoices);
  }
  
  select.addEventListener('change', (e) => {
    localStorage.setItem('sakura_voice_uri', e.target.value);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if ('speechSynthesis' in window) {
    initVoiceSelector();
  }
});
\;

if (!content.includes('function initVoiceSelector')) {
  fs.writeFileSync('n:\\vibe\\Projet\\短文教學\\lesson-common.js', content + '\\n' + voice_logic, 'utf8');
}
