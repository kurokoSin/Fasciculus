document.addEventListener('DOMContentLoaded', () => {
  const enc_text = document.getElementById('enc_text');
  const enc_html = document.getElementById('enc_html');
  const enc_url  = document.getElementById('enc_url');
  const enc_base64 = document.getElementById('enc_base64');
  const enc_utf16 = document.getElementById('enc_utf16');

  const dec_text = document.getElementById('dec_text');
  const dec_html = document.getElementById('dec_html');
  const dec_url  = document.getElementById('dec_url');
  const dec_base64 = document.getElementById('dec_base64');
  const dec_utf16 = document.getElementById('dec_utf16');

  const dencode = ( pat ) => {
    switch( pat ) {
      case "enc" :
        // Encode
        enc_html.value = escapeHTML(enc_text.value);
        enc_url.value = encodeURI(enc_text.value);
        base64Encode(enc_text.value).then(encoded => { enc_base64.value = encoded });
        enc_utf16.value = unicodeEncode(enc_text.value);
        break;

      case "dec" :
        // Decode
        dec_html.value = unescapeHTML(dec_text.value);
        dec_url.value = decodeURI(dec_text.value);
        base64Decode(dec_text.value).then(decoded => { dec_base64.value = decoded });
        dec_utf16.value = unicodeDecode(dec_text.value);
        break;
      
      default: console.error('no defined pattern: ' + pat); break;
    }
  }

  enc_text.addEventListener('input', () => { dencode("enc"); });
  dec_text.addEventListener('input', () => { dencode("dec"); });

  const clipboards = document.querySelectorAll('.q7-clip');
  clipboards.forEach( clip => {
    clip.addEventListener('click', () => {
      let text = document.getElementById(clip.dataset.q7Target).value;
      navigator.clipboard.writeText(text);
      setTimeout( () => {
        clip.querySelector('i').classList.add('bi-clipboard-check-fill');
      }, 1);
      setTimeout( () => {
        clip.querySelector('i').classList.remove('bi-clipboard-check-fill');
      }, 1500);
    });
  });

});
