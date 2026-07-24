// Lesson script for 文章1

function speakJapanese(text) {
  if (!('speechSynthesis' in window)) {
    alert('您的瀏覽器不支援語音功能');
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ja-JP';
  utterance.rate = 0.85;
  
  const voices = window.speechSynthesis.getVoices();
  const jaVoice = voices.find(v => v.lang.includes('ja'));
  if (jaVoice) utterance.voice = jaVoice;

  window.speechSynthesis.speak(utterance);
}

function playFullArticleAudio() {
  const fullText = "きょうはともだちのたんじょうびです。あさ、プレゼントをかいます。がっこうで、ともだちにわたします。ともだちはとてもよろこびます。ひる、みんなでケーキをたべます。しゃしんをとります。ごご、ゲームであそびます。ゆうがた、うちにかえります。きょうはたのしいいちにちでした。";
  speakJapanese(fullText);
}

function checkLessonAnswer(choice, correct, explanation) {
  const fb = document.getElementById('lesson-quiz-feedback');
  fb.style.display = 'block';
  if (choice === correct) {
    fb.style.background = '#D1FAE5';
    fb.style.color = '#065F46';
    fb.innerHTML = `🌸 <b>よくできました！（做得很好！）</b><br>${explanation}`;
    speakJapanese("よくできました！");
  } else {
    fb.style.background = '#FEE2E2';
    fb.style.color = '#991B1B';
    fb.innerHTML = `🌸 <b>大丈夫ですよ！（別挫折喔！）</b><br>在短文中「午後、ゲームであそびます」是用『で』來表示做某事所使用的媒介/工具喔！`;
  }
}
