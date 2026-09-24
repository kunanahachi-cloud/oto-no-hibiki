import sounds from "../data/sounds";
import kanji from "../data/kanji";

const contractedSounds = {
  きゃ: "きゃ",
  きゅ: "きゅ",
  きょ: "きょ",
  ぎゃ: "ぎゃ",
  ぎゅ: "ぎゅ",
  ぎょ: "ぎょ",
  しゃ: "しゃ",
  しゅ: "しゅ",
  しょ: "しょ",
  じゃ: "じゃ",
  じゅ: "じゅ",
  じょ: "じょ",
  ちゃ: "ちゃ",
  ちゅ: "ちゅ",
  ちょ: "ちょ",
  にゃ: "にゃ",
  にゅ: "にゅ",
  にょ: "にょ",
  ひゃ: "ひゃ",
  ひゅ: "ひゅ",
  ひょ: "ひょ",
  びゃ: "びゃ",
  びゅ: "びゅ",
  びょ: "びょ",
  ぴゃ: "ぴゃ",
  ぴゅ: "ぴゅ",
  ぴょ: "ぴょ",
  みゃ: "みゃ",
  みゅ: "みゅ",
  みょ: "みょ",
  りゃ: "りゃ",
  りゅ: "りゅ",
  りょ: "りょ",
};

function toHiragana(value = "") {
  return value
    .trim()
    .replace(/[ァ-ヶ]/g, (char) =>
      String.fromCharCode(char.charCodeAt(0) - 0x60)
    )
    .replace(/ー/g, "");
}

function splitSounds(reading = "") {
  const hiragana = toHiragana(reading);
  const result = [];

  for (let i = 0; i < hiragana.length; i += 1) {
    const pair = hiragana.slice(i, i + 2);

    if (contractedSounds[pair]) {
      result.push(pair);
      i += 1;
      continue;
    }

    result.push(hiragana[i]);
  }

  return result;
}

function getSoundData(sound) {
  return sounds[sound] || {
    keywords: ["個性", "可能性", "独自性"],
    meaning: "その人らしい感覚が育っていく響き",
  };
}

function getKanjiData(name = "") {
  return [...name].map((char) => ({
    char,
    ...(kanji[char] || {
      keywords: ["個性", "経験", "可能性"],
      meaning: "その人自身の経験によって意味が深まっていく字",
    }),
  }));
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function buildSoundDetails(soundUnits) {
  return soundUnits.map((sound) => {
    const data = getSoundData(sound);

    return {
      sound,
      keywords: data.keywords,
      meaning: data.meaning,
    };
  });
}

function buildKanjiDetails(kanjiDetails) {
  return kanjiDetails.map((item) => ({
    character: item.char,
    keywords: item.keywords,
    meaning: item.meaning,
  }));
}

function buildKeywords(soundDetails, kanjiDetails) {
  return unique([
    ...soundDetails.flatMap((item) => item.keywords),
    ...kanjiDetails.flatMap((item) => item.keywords),
  ]);
}

function buildFlow(soundDetails) {
  if (soundDetails.length === 0) {
    return "";
  }

  if (soundDetails.length === 1) {
    return `「${soundDetails[0].keywords[0]}」が、この名前の中心にある響きです。`;
  }

  const first = soundDetails[0];
  const last = soundDetails[soundDetails.length - 1];

  const middle = soundDetails
    .slice(1, -1)
    .map((item) => item.keywords[0])
    .filter(Boolean);

  if (middle.length === 0) {
    return `「${first.keywords[0]}」から「${last.keywords[0]}」へ。`;
  }

  return `「${first.keywords[0]}」から「${middle.join("」を経て「")}」を経て、「${last.keywords[0]}」へ。`;
}

function buildPersonality(soundDetails, kanjiDetails) {
  if (soundDetails.length === 0) {
    return "";
  }

  const first = soundDetails[0].keywords[0];
  const last =
    soundDetails[soundDetails.length - 1].keywords[0];

  const kanjiTheme = kanjiDetails[0]?.keywords?.[0];

  if (soundDetails.length === 1) {
    return `「${first}」を大切にしながら、自分らしい答えを育てていく人。`;
  }

  if (kanjiTheme) {
    return `「${first}」を出発点に、「${last}」へ向かって自分らしさを育てていく人。`;
  }

  return `「${first}」を重ねながら、「${last}」へ進んでいく人。`;
}

function buildStrength(soundDetails) {
  if (soundDetails.length === 0) {
    return "";
  }

  const first = soundDetails[0].keywords[0];
  const last =
    soundDetails[soundDetails.length - 1].keywords[0];

  return `「${first}」を、自分だけの「${last}」に変えていける。`;
}

function buildCaution(soundDetails) {
  if (soundDetails.length === 0) {
    return "";
  }

  const first = soundDetails[0].keywords[0];

  return `「${first}」を大切にするあまり、考えすぎて動き出しが遅くなることも。`;
}

function buildNicknameAnalysis(
  nickname,
  mainSoundDetails = []
) {
  if (!nickname) {
    return null;
  }

  const soundUnits = splitSounds(nickname);
  const soundDetails = buildSoundDetails(soundUnits);

  if (soundDetails.length === 0) {
    return null;
  }

  const first = soundDetails[0];

  const mainFirst = mainSoundDetails[0]?.keywords?.[0];
  const mainLast =
    mainSoundDetails[mainSoundDetails.length - 1]?.keywords?.[0];

  let flow;

  if (mainFirst && mainLast) {
    flow = `「${nickname}」は、「${mainFirst}」から「${mainLast}」へ向かう名前の中で、「${first.keywords[0]}」が近くに表れる呼び名。`;
  } else {
    flow = `「${nickname}」は、「${first.keywords[0]}」が自然に表れる呼び名。`;
  }

  if (nickname.includes("ー")) {
    flow += " 肩の力が抜けた、親しみのある響きです。";
  }

  return {
    nickname,
    soundDetails,
    flow,
  };
}

function analyzeName(reading, name = "", nickname = "") {
  const soundUnits = splitSounds(reading);
  const soundDetails = buildSoundDetails(soundUnits);
  const kanjiDetails = getKanjiData(name);

  return {
    reading,
    name,
    nickname,
    soundUnits,
    soundDetails,
    kanjiDetails: buildKanjiDetails(kanjiDetails),
    keywords: buildKeywords(soundDetails, kanjiDetails),
    flow: buildFlow(soundDetails),
    personality: buildPersonality(
      soundDetails,
      kanjiDetails
    ),
    strength: buildStrength(soundDetails),
    caution: buildCaution(soundDetails),
    nicknameAnalysis: buildNicknameAnalysis(
      nickname,
      soundDetails
    ),
  };
}

export {
  analyzeName,
  splitSounds,
  buildNicknameAnalysis,
};

export default analyzeName;