/**
 * Unicode（¥uxxx形式）を文字列へアンエスケープ
 * @param {string} str エスケープされた文字列
 * @returns 文字列へアンエスケープされた文字列を返す
 */
const unicodeDecode = str => (str?.match(/\\u[0-9A-F]+/ig) ?? []).reduce((result, str) => {
	return result + String.fromCodePoint(str.replace('\\u', '0x'));
}, '');

const unicodeEncode = str => {
  let result = "";
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    let codePoint = str.codePointAt(i); // 正しいUnicodeコードポイントを取得

    if (codePoint > 0xFFFF) { // サロゲートペアが必要な文字 (BMP外)
      // サロゲートペアの計算
      const highSurrogate = String.fromCharCode(0xD800 + Math.floor((codePoint - 0x10000) / 0x400));
      const lowSurrogate = String.fromCharCode(0xDC00 + ((codePoint - 0x10000) % 0x400));
      // result += highSurrogate + lowSurrogate;
      result += "\\u" + highSurrogate.codePointAt().toString(16).padStart(4, '0') + "\\u" + lowSurrogate.codePointAt().toString(16).padStart(4, '0');
      i++; // サロゲートペアは2文字分なのでインデックスをインクリメント
    } else {
      result += "\\u" + codePoint.toString(16).padStart(4, '0');;
    }
  }
  return result;
};

