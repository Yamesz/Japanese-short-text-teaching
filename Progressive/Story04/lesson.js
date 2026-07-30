const STORY_DATA = {
  n5: {
    label:'N5', title:'とうめいな かさ', note:'N5 使用「〜ました／〜です」、基本助詞與簡單過去式，像日記一樣清楚交代事情。',
    sentences:[
      {jp:'きのう、しごとの　あとで、あめが　ふりました。',display:'きのう、<ruby>仕事<rt>しごと</rt></ruby>の　あとで、<ruby>雨<rt>あめ</rt></ruby>が　<ruby>降<rt>ふ</rt></ruby>りました。',romaji:'Kinō, shigoto no ato de, ame ga furimashita.',cn:'昨天下班後，下雨了。'},
      {jp:'わたしは　かさが　ありませんでした。',display:'わたしは　<ruby>傘<rt>かさ</rt></ruby>が　ありませんでした。',romaji:'Watashi wa kasa ga arimasen deshita.',cn:'我沒有傘。'},
      {jp:'えきの　ちかくの　コンビニへ　はいりました。',display:'<ruby>駅<rt>えき</rt></ruby>の　<ruby>近<rt>ちか</rt></ruby>くの　コンビニへ　<ruby>入<rt>はい</rt></ruby>りました。',romaji:'Eki no chikaku no konbini e hairimashita.',cn:'我走進車站附近的便利商店。'},
      {jp:'てんいんさんが　とうめいな　かさを　かしてくれました。',display:'<ruby>店員<rt>てんいん</rt></ruby>さんが　<ruby>透明<rt>とうめい</rt></ruby>な　<ruby>傘<rt>かさ</rt></ruby>を　<ruby>貸<rt>か</rt></ruby>してくれました。',romaji:'Tenin-san ga tōmei na kasa o kashite kuremashita.',cn:'店員借給我一把透明傘。'},
      {jp:'つぎの　ひ、わたしは　おかしと　かさを　もっていきました。',display:'<ruby>次<rt>つぎ</rt></ruby>の　<ruby>日<rt>ひ</rt></ruby>、わたしは　お<ruby>菓子<rt>かし</rt></ruby>と　<ruby>傘<rt>かさ</rt></ruby>を　<ruby>持<rt>も</rt></ruby>っていきました。',romaji:'Tsugi no hi, watashi wa okashi to kasa o motte ikimashita.',cn:'隔天，我帶著點心和傘去了。'},
      {jp:'それから、わたしたちは　いつも　あいさつを　します。',display:'それから、わたしたちは　いつも　あいさつを　します。',romaji:'Sorekara, watashitachi wa itsumo aisatsu o shimasu.',cn:'從那以後，我們總會互相打招呼。'}
    ],
    verbs:[
      {word:'貸す（かす）',reading:'ka-su',type:'第一類動詞',meaning:'借出',forms:['貸す','貸します','貸しました','貸して','貸さない'],examples:[['店員さんが傘を貸しました。','店員借出了傘。'],['友達に本を貸します。','我把書借給朋友。']]},
      {word:'返す（かえす）',reading:'ka-e-su',type:'第一類動詞',meaning:'歸還',forms:['返す','返します','返しました','返して','返さない'],examples:[['次の日に傘を返しました。','隔天歸還了傘。'],['図書館の本を返します。','歸還圖書館的書。']]}
    ],
    adjectives:[{word:'透明な（とうめいな）',reading:'tō-me-i-na',type:'な形容詞',meaning:'透明的',examples:[['透明な傘です。','是一把透明傘。'],['水は透明です。','水是透明的。']]}],
    nouns:[['雨（あめ）','a-me','雨'],['傘（かさ）','ka-sa','傘'],['店員（てんいん）','te-n-i-n','店員'],['お菓子（おかし）','o-ka-shi','點心']],
    particles:[
      {pattern:'助詞「へ」（方向）',usage:'格助詞，標示移動的方向。本句「コンビニへ」表示往便利商店去。',examples:[['コンビニへ入りました。','走進便利商店。'],['会社へ行きます。','去公司。']]},
      {pattern:'助詞「を」（受詞）',usage:'格助詞，標示動作直接作用的對象。本句中傘是「借出」的對象。',examples:[['傘を貸しました。','借出了傘。'],['コーヒーを買います。','買咖啡。']]}
    ],
    grammar:[
      {pattern:'動詞過去式 ～ました',usage:'表示動作已經發生、結束，是禮貌體的過去式。',examples:[['雨が降りました。','下雨了。'],['コンビニへ入りました。','走進了便利商店。']]},
      {pattern:'～てくれました',usage:'別人為我方做某事，帶有說話者感謝的心情。',examples:[['店員さんが傘を貸してくれました。','店員借傘給我。'],['友達が手伝ってくれました。','朋友幫助了我。']]}
    ]
  },
  n4: {
    label:'N4', title:'雨の日の小さな親切', note:'N4 加入「〜てくれる」、原因與條件表達，補充動作細節及主角的感受。',
    sentences:[
      {jp:'ざんぎょうが　おわって　えきに　ついたころ、きゅうに　あめが　つよくなってきました。',display:'<ruby>残業<rt>ざんぎょう</rt></ruby>が　<ruby>終<rt>お</rt></ruby>わって　<ruby>駅<rt>えき</rt></ruby>に　<ruby>着<rt>つ</rt></ruby>いたころ、<ruby>急<rt>きゅう</rt></ruby>に　<ruby>雨<rt>あめ</rt></ruby>が　<ruby>強<rt>つよ</rt></ruby>くなってきました。',romaji:'Zangyō ga owatte eki ni tsuita koro, kyū ni ame ga tsuyoku natte kimashita.',cn:'加班結束抵達車站時，雨突然變大了。'},
      {jp:'あさは　はれていたので、かさを　もってこなかったのです。',display:'<ruby>朝<rt>あさ</rt></ruby>は　<ruby>晴<rt>は</rt></ruby>れていたので、<ruby>傘<rt>かさ</rt></ruby>を　<ruby>持<rt>も</rt></ruby>ってこなかったのです。',romaji:'Asa wa harete ita node, kasa o motte konakatta no desu.',cn:'因為早上是晴天，所以我沒有帶傘。'},
      {jp:'こまって　えきまえの　コンビニに　はいると、てんいんさんが　こえを　かけてくれました。',display:'<ruby>困<rt>こま</rt></ruby>って　<ruby>駅前<rt>えきまえ</rt></ruby>の　コンビニに　<ruby>入<rt>はい</rt></ruby>ると、<ruby>店員<rt>てんいん</rt></ruby>さんが　<ruby>声<rt>こえ</rt></ruby>を　かけてくれました。',romaji:'Komatte ekimae no konbini ni hairu to, tenin-san ga koe o kakete kuremashita.',cn:'我困擾地走進車站前的便利商店，店員主動向我搭話。'},
      {jp:'よかったら　つかってくださいと、じぶんの　とうめいな　かさを　かしてくれました。',display:'「よかったら　<ruby>使<rt>つか</rt></ruby>ってください」と、<ruby>自分<rt>じぶん</rt></ruby>の　<ruby>透明<rt>とうめい</rt></ruby>な　<ruby>傘<rt>かさ</rt></ruby>を　<ruby>貸<rt>か</rt></ruby>してくれました。',romaji:'Yokattara tsukatte kudasai to, jibun no tōmei na kasa o kashite kuremashita.',cn:'店員說「不介意的話請使用」，把自己的透明傘借給了我。'},
      {jp:'つぎの　ひ、おれいに　ちいさな　おかしを　かって、かさを　かえしに　いきました。',display:'<ruby>次<rt>つぎ</rt></ruby>の　<ruby>日<rt>ひ</rt></ruby>、お<ruby>礼<rt>れい</rt></ruby>に　<ruby>小<rt>ちい</rt></ruby>さな　お<ruby>菓子<rt>かし</rt></ruby>を　<ruby>買<rt>か</rt></ruby>って、<ruby>傘<rt>かさ</rt></ruby>を　<ruby>返<rt>かえ</rt></ruby>しに　<ruby>行<rt>い</rt></ruby>きました。',romaji:'Tsugi no hi, orei ni chiisana okashi o katte, kasa o kaeshi ni ikimashita.',cn:'隔天，我買了小點心作為謝禮，去歸還傘。'},
      {jp:'それから、コーヒーを　かうたびに、わたしたちは　はなすように　なりました。',display:'それから、コーヒーを　<ruby>買<rt>か</rt></ruby>うたびに、わたしたちは　<ruby>話<rt>はな</rt></ruby>すように　なりました。',romaji:'Sorekara, kōhī o kau tabi ni, watashitachi wa hanasu yō ni narimashita.',cn:'從那以後，每當我買咖啡，我們便漸漸聊起天來。'}
    ],
    verbs:[
      {word:'声をかける（こえをかける）',reading:'ko-e-o-ka-ke-ru',type:'第二類動詞',meaning:'搭話、招呼',forms:['声をかける','声をかけます','声をかけました','声をかけて','声をかけない'],examples:[['店員さんが声をかけてくれました。','店員主動向我搭話。'],['困っている人に声をかけます。','向有困難的人搭話。']]},
      {word:'返しに行く（かえしにいく）',reading:'ka-e-shi-ni-i-ku',type:'第一類複合表達',meaning:'去歸還',forms:['返しに行く','返しに行きます','返しに行きました','返しに行って','返しに行かない'],examples:[['傘を返しに行きました。','去歸還傘了。'],['本を返しに行くつもりです。','打算去還書。']]}
    ],
    adjectives:[{word:'小さい（ちいさい）',reading:'chi-i-sa-i',type:'い形容詞',meaning:'小的',examples:[['小さなお菓子を買いました。','買了小點心。'],['小さい店ですが、人気があります。','雖然是小店，卻很受歡迎。']]}],
    nouns:[['残業（ざんぎょう）','za-n-gyō','加班'],['駅前（えきまえ）','e-ki-ma-e','車站前'],['お礼（おれい）','o-re-i','謝意、謝禮'],['親切（しんせつ）','shi-n-se-tsu','親切']],
    particles:[
      {pattern:'助詞「ので」（原因）',usage:'接續助詞，以較客觀、柔和的語氣說明原因。',examples:[['晴れていたので、傘を持ってきませんでした。','因為是晴天，所以沒帶傘。'],['雨なので、電車で行きます。','因為下雨，所以搭電車去。']]},
      {pattern:'助詞「と」（條件）',usage:'接續助詞，表示前項發生時，自然出現後項結果。',examples:[['店に入ると、店員さんがいました。','一進店裡，店員就在那裡。'],['春になると、花が咲きます。','一到春天，花就開。']]}
    ],
    grammar:[
      {pattern:'～たら（假定條件）',usage:'表示「如果……的話」，可用於建議或未來條件。',examples:[['雨が降ったら、この傘を使ってください。','如果下雨，請用這把傘。'],['時間があったら、また来ます。','如果有時間，我會再來。']]},
      {pattern:'～ようになる（狀態變化）',usage:'表示經過一段時間後，變得會做某事或形成新習慣。',examples:[['店員さんと話すようになりました。','變得會和店員聊天了。'],['毎朝コーヒーを飲むようになりました。','變得每天早上喝咖啡。']]}
    ]
  },
  n3: {
    label:'N3', title:'透明な傘がつないだもの', note:'N3 使用被動、抽象表達與假定回望，把「借傘」寫成都市裡人與人逐漸相連的故事。',
    sentences:[
      {jp:'しごとに　おわれる　まいにちの　なかで、えきまえの　コンビニは、ただ　とおりすぎる　ばしょに　すぎませんでした。',display:'<ruby>仕事<rt>しごと</rt></ruby>に　<ruby>追<rt>お</rt></ruby>われる　<ruby>毎日<rt>まいにち</rt></ruby>の　なかで、<ruby>駅前<rt>えきまえ</rt></ruby>の　コンビニは、ただ　<ruby>通<rt>とお</rt></ruby>り<ruby>過<rt>す</rt></ruby>ぎる　<ruby>場所<rt>ばしょ</rt></ruby>に　すぎませんでした。',romaji:'Shigoto ni owareru mainichi no naka de, ekimae no konbini wa, tada tōrisugiru basho ni sugimasen deshita.',cn:'在忙於工作的日子裡，車站前的便利商店只不過是匆匆經過的地方。'},
      {jp:'あのひ、よほうにも　なかった　あめに　あしどめされ、とほうに　くれていた　わたしに、てんいんの　さとうさんは　だまって　とうめいな　かさを　さしだしてくれました。',display:'あの<ruby>日<rt>ひ</rt></ruby>、<ruby>予報<rt>よほう</rt></ruby>にも　なかった　<ruby>雨<rt>あめ</rt></ruby>に　<ruby>足止<rt>あしど</rt></ruby>めされ、<ruby>途方<rt>とほう</rt></ruby>に　<ruby>暮<rt>く</rt></ruby>れていた　わたしに、<ruby>店員<rt>てんいん</rt></ruby>の　<ruby>佐藤<rt>さとう</rt></ruby>さんは　<ruby>黙<rt>だま</rt></ruby>って　<ruby>透明<rt>とうめい</rt></ruby>な　<ruby>傘<rt>かさ</rt></ruby>を　<ruby>差<rt>さ</rt></ruby>し<ruby>出<rt>だ</rt></ruby>してくれました。',romaji:'Ano hi, yohō ni mo nakatta ame ni ashidome sare, tohō ni kurete ita watashi ni, tenin no Satō-san wa damatte tōmei na kasa o sashidashite kuremashita.',cn:'那天，意料之外的雨讓我受困；店員佐藤默默向茫然的我遞出透明傘。'},
      {jp:'かえさなくても　だいじょうぶですよと　いわれたものの、よくじつ、わたしは　やきがしと　いっしょに　かさを　かえしました。',display:'「<ruby>返<rt>かえ</rt></ruby>さなくても　<ruby>大丈夫<rt>だいじょうぶ</rt></ruby>ですよ」と　<ruby>言<rt>い</rt></ruby>われたものの、<ruby>翌日<rt>よくじつ</rt></ruby>、わたしは　<ruby>焼<rt>や</rt></ruby>き<ruby>菓子<rt>がし</rt></ruby>と　いっしょに　<ruby>傘<rt>かさ</rt></ruby>を　<ruby>返<rt>かえ</rt></ruby>しました。',romaji:'Kaesanakute mo daijōbu desu yo to iwareta mono no, yokujitsu, watashi wa yakigashi to issho ni kasa o kaeshimashita.',cn:'雖然他說不還也沒關係，隔天我仍帶著小餅乾歸還了傘。'},
      {jp:'それいらい、コーヒーを　かうたびに　かわす　みじかい　あいさつが、いちにちの　おわりを　すこし　やわらかくしてくれます。',display:'それ<ruby>以来<rt>いらい</rt></ruby>、コーヒーを　<ruby>買<rt>か</rt></ruby>うたびに　<ruby>交<rt>か</rt></ruby>わす　<ruby>短<rt>みじか</rt></ruby>い　あいさつが、<ruby>一日<rt>いちにち</rt></ruby>の　<ruby>終<rt>お</rt></ruby>わりを　すこし　やわらかくしてくれます。',romaji:'Sore irai, kōhī o kau tabi ni kawasu mijikai aisatsu ga, ichinichi no owari o sukoshi yawarakaku shite kuremasu.',cn:'從那以後，每次買咖啡交換的短暫問候，都讓一天的尾聲柔和一些。'},
      {jp:'もし　あの　かさが　なければ、わたしたちは　いまも　なまえを　しらない　ままだったかもしれません。',display:'もし　あの　<ruby>傘<rt>かさ</rt></ruby>が　なければ、わたしたちは　<ruby>今<rt>いま</rt></ruby>も　<ruby>名前<rt>なまえ</rt></ruby>を　<ruby>知<rt>し</rt></ruby>らない　ままだったかもしれません。',romaji:'Moshi ano kasa ga nakereba, watashitachi wa ima mo namae o shiranai mama datta kamo shiremasen.',cn:'如果沒有那把傘，我們或許至今仍是不知道彼此姓名的陌生人。'},
      {jp:'とうめいな　かさごしに　みえた　あめの　まちは、いぜんより　すこしだけ　あたたかく　みえました。',display:'<ruby>透明<rt>とうめい</rt></ruby>な　<ruby>傘越<rt>かさご</rt></ruby>しに　<ruby>見<rt>み</rt></ruby>えた　<ruby>雨<rt>あめ</rt></ruby>の　<ruby>町<rt>まち</rt></ruby>は、<ruby>以前<rt>いぜん</rt></ruby>より　すこしだけ　あたたかく　<ruby>見<rt>み</rt></ruby>えました。',romaji:'Tōmei na kasagoshi ni mieta ame no machi wa, izen yori sukoshi dake atatakaku miemashita.',cn:'隔著透明傘看見的雨中城市，比從前多了一點溫暖。'}
    ],
    verbs:[
      {word:'追われる（おわれる）',reading:'o-wa-re-ru',type:'第一類動詞「追う」的被動態',meaning:'被追趕；忙於',forms:['追われる','追われます','追われました','追われて','追われない'],examples:[['仕事に追われる毎日です。','每天都忙於工作。'],['時間に追われています。','正被時間追著跑。']]},
      {word:'差し出す（さしだす）',reading:'sa-shi-da-su',type:'第一類動詞',meaning:'遞出、伸出',forms:['差し出す','差し出します','差し出しました','差し出して','差し出さない'],examples:[['店員さんが傘を差し出しました。','店員遞出了傘。'],['受付で書類を差し出します。','在櫃檯遞交文件。']]}
    ],
    adjectives:[{word:'あたたかい',reading:'a-ta-ta-ka-i',type:'い形容詞',meaning:'溫暖的；有人情味的',examples:[['町があたたかく見えました。','城市看起來很溫暖。'],['あたたかい言葉に救われました。','溫暖的話語拯救了我。']]}],
    nouns:[['足止め（あしどめ）','a-shi-do-me','受阻、被迫停留'],['途方（とほう）','to-hō','方向；常用於「途方に暮れる」'],['常連（じょうれん）','jō-re-n','熟客'],['つながり','tsu-na-ga-ri','連結']],
    particles:[
      {pattern:'助詞「に」（被動句施因／原因）',usage:'在被動表達裡可標示造成影響的事物。本句「雨に足止めされる」表示被雨困住。',examples:[['雨に足止めされました。','被雨困住了。'],['先生にほめられました。','受到老師稱讚。']]},
      {pattern:'助詞「より」（比較基準）',usage:'格助詞，標示比較的基準。本句表示現在看見的城市比從前更溫暖。',examples:[['以前よりあたたかく見えます。','看起來比以前溫暖。'],['電車はバスより速いです。','電車比公車快。']]}
    ],
    grammar:[
      {pattern:'～にすぎない（只不過）',usage:'限定程度或價值，表示「只不過是……」。',examples:[['ただ通り過ぎる場所にすぎませんでした。','只不過是匆匆經過的地方。'],['これは一つの例にすぎません。','這只是一個例子。']]},
      {pattern:'～ものの（雖然……但是）',usage:'書面感較強的逆接，承認前項後提出不一致的結果。',examples:[['返さなくてもいいと言われたものの、翌日返しました。','雖然被說不用還，隔天仍歸還了。'],['買ったものの、まだ使っていません。','雖然買了，卻還沒使用。']]},
      {pattern:'～なければ／～かもしれない',usage:'用假定條件回望未發生的可能，表達「若沒有……或許……」。',examples:[['傘がなければ、会わなかったかもしれません。','若沒有傘，也許就不會相識。'],['雨でなければ、気づかなかったかもしれません。','若不是下雨，也許不會注意到。']]}
    ]
  }
};

const LEVEL_DATA={n5:STORY_DATA.n5.sentences,n4:STORY_DATA.n4.sentences,n3:STORY_DATA.n3.sentences};
let currentLevel='n5', player=null;
const audioButton=text=>`<button class="audio-btn" onclick="speakJapanese('${text.replace(/'/g,"\\'")}')">🔊</button>`;
const examples=items=>items.map((e,i)=>`<div class="example-box"><div class="example-jp">例句${i+1}：${e[0]} ${audioButton(e[0])}</div><div class="example-cn">（${e[1]}）</div></div>`).join('');
function renderLevel(key){const d=STORY_DATA[key];return `<div id="level-${key}" class="level-content ${key==='n5'?'active':''}"><div class="lesson-layout"><div><div class="image-viewer-card" style="position:static;text-align:left;"><div class="short-text-title-row"><h3 style="color:var(--deep-sakura);font-size:1.3rem;margin:0;">📜 日語短文 (${d.label})</h3><div class="lang-toggle-wrapper"><span class="lang-toggle-label">🌐 中日雙語</span><label class="lang-toggle"><input type="checkbox" onchange="toggleTranslation(this)"><span class="toggle-track"></span></label></div></div><div class="short-text-controls-row"><div class="speed-control"><span style="font-size:.75rem;color:var(--text-muted);font-weight:bold;">語速：</span><button class="speed-btn" data-rate="0.5" onclick="setStorySpeechRate(0.5,this)">🐢 慢速</button><button class="speed-btn" data-rate="1" onclick="setStorySpeechRate(1,this)">🏃 普通</button></div><div class="karaoke-controls"><button id="karaoke-play-btn-${key}" class="action-btn karaoke-play-btn" onclick="playFullArticleAudio()">🔊 全篇朗讀</button><button id="karaoke-stop-btn-${key}" class="action-btn karaoke-stop-btn" onclick="stopArticleAudio()" disabled>⏹ 停止</button></div></div><div class="karaoke-status idle"><span class="status-dot"></span><span class="status-text">準備就緒</span></div><div class="pause-notice">⚠️ 若暫停無效，請按「⏹ 停止」後重新播放</div><div style="background:#FFFBF7;border:2px dashed #FFB7C5;border-radius:16px;padding:1.8rem;font-family:'Zen Maru Gothic','Noto Sans JP',sans-serif;color:#2D3748;margin-top:.5rem;"><div style="font-size:1.6rem;font-weight:bold;text-align:center;color:#E65C83;margin-bottom:1.2rem;border-bottom:2px dotted #FFC0CB;padding-bottom:.8rem;">${d.title}</div>${d.sentences.map((s,i)=>`<div class="karaoke-line" data-sentence-index="${i}"><span class="karaoke-jp">${s.jp}</span><div class="karaoke-cn">${s.cn}</div></div>`).join('')}</div><div style="margin-top:1.2rem;background:var(--light-sakura);padding:1rem;border-radius:12px;font-size:.9rem;border-left:4px solid var(--primary-pink);"><b>🌸 さくら先生導讀點撥：</b><br>${d.note}</div></div></div><div><h3 class="section-title" style="margin-top:0;">📖 逐句朗讀與解析 (${d.label})</h3><div class="sentence-list">${d.sentences.map(s=>`<div class="sentence-card"><div class="sentence-jp">${s.display}</div><div class="sentence-romaji">${s.romaji}</div><div class="sentence-cn"><span>中文：${s.cn}</span>${audioButton(s.jp)}</div></div>`).join('')}</div></div></div>${renderTeaching(d,key)}</div>`;}
function renderTeaching(d,key){const verbs=d.verbs.map((v,i)=>`<div class="vocab-card" style="border-top:4px solid #4A90E2;"><div class="vocab-header"><div class="vocab-word">🏃 ${v.word}</div>${audioButton(v.word)}</div><div class="vocab-romaji">讀音：${v.reading} | ${v.type}</div><div class="vocab-meaning">意思：${v.meaning}</div><button class="conjugation-toggle" onclick="toggleConjugation('v_${key}_${i}')">📊 展開動詞活用變化表</button><div id="conjugation-v_${key}_${i}" class="conjugation-table-wrapper"><table class="conjugation-table"><tr><th>辭書形</th><th>ます形</th><th>過去式</th><th>て形</th><th>ない形</th></tr><tr>${v.forms.map(x=>`<td>${x}</td>`).join('')}</tr></table></div>${examples(v.examples)}</div>`).join('');const adjs=d.adjectives.map(a=>`<div class="vocab-card" style="border-top:4px solid #6B9080;"><div class="vocab-header"><div class="vocab-word">✨ ${a.word}</div>${audioButton(a.word)}</div><div class="vocab-romaji">讀音：${a.reading} | ${a.type}</div><div class="vocab-meaning">意思：${a.meaning}</div>${examples(a.examples)}</div>`).join('');const nouns=d.nouns.map(n=>`<div class="vocab-card" style="border-top:4px solid #8E44AD;"><div class="vocab-header"><div class="vocab-word">🌸 ${n[0]}</div>${audioButton(n[0])}</div><div class="vocab-romaji">讀音：${n[1]} | 名詞</div><div class="vocab-meaning">意思：${n[2]}</div></div>`).join('');const particles=d.particles.map(p=>`<div class="grammar-card" style="border-left:4px solid #E67E22;"><div class="grammar-pattern">🧩 ${p.pattern}</div><div class="grammar-usage"><b>功能與本句解析：</b>${p.usage}</div>${examples(p.examples)}</div>`).join('');const grammar=d.grammar.map(g=>`<div class="grammar-card"><div class="grammar-pattern">📝 ${g.pattern}</div><div class="grammar-usage"><b>用法：</b>${g.usage}</div>${examples(g.examples)}</div>`).join('');return `<div style="margin-top:3rem;"><h2 class="section-title"><i class="fa-solid fa-person-running" style="color:#4A90E2;"></i> 🏃 動詞寶庫 (${d.label})</h2><div class="card-grid">${verbs}</div></div><div style="margin-top:3rem;"><h2 class="section-title"><i class="fa-solid fa-sparkles" style="color:#6B9080;"></i> ✨ 形容詞寶庫 (${d.label})</h2><div class="card-grid">${adjs}</div></div><div style="margin-top:3rem;"><h2 class="section-title"><i class="fa-solid fa-cube" style="color:#8E44AD;"></i> 🌸 名詞與精選單字 (${d.label})</h2><div class="card-grid">${nouns}</div></div><div style="margin-top:3rem;"><h2 class="section-title"><i class="fa-solid fa-puzzle-piece" style="color:#E67E22;"></i> 🧩 助詞教室 (${d.label})</h2><div class="card-grid">${particles}</div></div><div style="margin-top:3rem;"><h2 class="section-title"><i class="fa-solid fa-pen-nib"></i> 📝 さくら先生的精選文法教室 (${d.label})</h2><div class="card-grid">${grammar}</div></div>`;}


function initPlayer(){if(!player||player.level!==currentLevel){if(player)player.stop();player=new KaraokePlayer(currentLevel);}}
function playFullArticleAudio(){initPlayer();player.togglePlayPause();}
function stopArticleAudio(){if(player)player.stop();}
function toggleTranslation(box){document.querySelectorAll(`#level-${currentLevel} .karaoke-cn`).forEach((e,i)=>box.checked?setTimeout(()=>e.classList.add('show'),i*40):e.classList.remove('show'));}
function syncStoryAudioControls(){syncSpeedControlButtons();}
function setStorySpeechRate(rate,btn){setSpeechRate(rate,btn);syncStoryAudioControls();if(player)player.rate=currentSpeechRate;}
function hydrateStoryLevel(level){const root=document.getElementById(`level-${level}`);const passage=root?.querySelector('.karaoke-line')?.parentElement;const breakdown=root?.querySelector('.sentence-list');if(passage){const title=passage.firstElementChild?.outerHTML;LessonRenderer.renderPassage(passage,STORY_DATA[level].sentences);if(title)passage.insertAdjacentHTML('afterbegin',title);}if(breakdown)LessonRenderer.renderBreakdown(breakdown,STORY_DATA[level].sentences);if(root)LessonRenderer.bindSpeechButtons(root);}
function switchLevel(level){if(player)player.stop();currentLevel=level;player=new KaraokePlayer(level);document.querySelectorAll('.level-btn').forEach(b=>b.classList.toggle('active',b.dataset.level===level));document.querySelectorAll('.level-content').forEach(c=>c.classList.toggle('active',c.id===`level-${level}`));hydrateStoryLevel(level);const box=document.querySelector(`#level-${level} .lang-toggle input`);if(box)box.checked=false;toggleTranslation({checked:false});syncStoryAudioControls();}
window.addEventListener('speechRateChanged',e=>{if(!player)return;player.rate=e.detail;if(player.state==='playing'){player.isChangingSpeed=true;player.synth.cancel();setTimeout(()=>{player.isChangingSpeed=false;player._playNext();},120);}});
function submitStoryQuiz(){const answers={q1:'a',q2:'b',q3:'b'};let score=0,complete=true;Object.entries(answers).forEach(([q,a])=>{const chosen=document.querySelector(`input[name="${q}"]:checked`);if(!chosen){complete=false;return;}if(chosen.value===a)score++;});const result=document.getElementById('quiz-result');result.style.display='block';document.getElementById('quiz-score').textContent=complete?`答對 ${score}／3 題，獲得 ${score*10} 點櫻花獎勵分數！`:'還有題目沒有作答喔！';document.getElementById('quiz-message').textContent=!complete?'大丈夫ですよ！完成全部題目後再送出。':score===3?'よくできました！（做得很好！）你已看懂三種層次的差異！':'大丈夫ですよ！再讀一次對應難度，一定會更清楚。';}
document.addEventListener('DOMContentLoaded',()=>{document.getElementById('levels-root').innerHTML=['n5','n4','n3'].map(renderLevel).join('');switchLevel('n5');syncStoryAudioControls();initArticleLearnedState('progressive-04');});
