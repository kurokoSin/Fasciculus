// Base64URL変換関数
function base64url(source) {
  let encoded = CryptoJS.enc.Base64.stringify(source);
  return encoded.replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
}
function parseBase64url(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  return CryptoJS.enc.Base64.parse(str);
}

// JWTデコード
function decodeJWT() {
  let parts = document.getElementById('jwt-input').value.trim().split('.');
  if (parts.length !== 3) {
    alert('フォーマットエラー');
    return;
  }
  document.getElementById('header').value = JSON.stringify(
    JSON.parse(CryptoJS.enc.Utf8.stringify(parseBase64url(parts[0]))), null, 2
  );
  document.getElementById('payload').value = JSON.stringify(
    JSON.parse(CryptoJS.enc.Utf8.stringify(parseBase64url(parts[1]))), null, 2
  );
}
// JWTエンコード
function encodeJWT() {
  try {
    const header = JSON.parse(document.getElementById('header').value);
    const payload = JSON.parse(document.getElementById('payload').value);
    const secret = document.getElementById('secret').value;
    const encodedHeader = base64url(CryptoJS.enc.Utf8.parse(JSON.stringify(header)));
    const encodedPayload = base64url(CryptoJS.enc.Utf8.parse(JSON.stringify(payload)));
    const unsignedToken = `${encodedHeader}.${encodedPayload}`;
    const signature = base64url(CryptoJS.HmacSHA256(unsignedToken, secret));
    document.getElementById('jwt-output').value = `${unsignedToken}.${signature}`;
  } catch(e) {
    alert('入力JSONエラー: ' + e.message);
  }
}