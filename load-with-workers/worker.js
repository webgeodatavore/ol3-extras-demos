var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

// Use a lookup table to find the index.
var lookup = new Uint8Array(256);
for (var i = 0; i < chars.length; i++) {
  lookup[chars.charCodeAt(i)] = i;
}

var encode = function(arraybuffer) {
  var bytes = new Uint8Array(arraybuffer),
  i, len = bytes.length, base64 = "";

  for (i = 0; i < len; i+=3) {
    base64 += chars[bytes[i] >> 2];
    base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
    base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
    base64 += chars[bytes[i + 2] & 63];
  }

  if ((len % 3) === 2) {
    base64 = base64.substring(0, base64.length - 1) + "=";
  } else if (len % 3 === 1) {
    base64 = base64.substring(0, base64.length - 2) + "==";
  }

  return base64;
};

var decode =  function(base64) {
  var bufferLength = base64.length * 0.75,
  len = base64.length, i, p = 0,
  encoded1, encoded2, encoded3, encoded4;

  if (base64[base64.length - 1] === "=") {
    bufferLength--;
    if (base64[base64.length - 2] === "=") {
      bufferLength--;
    }
  }

  var arraybuffer = new ArrayBuffer(bufferLength),
  bytes = new Uint8Array(arraybuffer);

  for (i = 0; i < len; i+=4) {
    encoded1 = lookup[base64.charCodeAt(i)];
    encoded2 = lookup[base64.charCodeAt(i+1)];
    encoded3 = lookup[base64.charCodeAt(i+2)];
    encoded4 = lookup[base64.charCodeAt(i+3)];

    bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
    bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
    bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
  }

  return arraybuffer;
};

function b64EncodeUnicode(str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
    return String.fromCharCode('0x' + p1);
  }));
}

function b64DecodeUnicode(str) {
  return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
    return '%' + c.charCodeAt(0).toString(16);
  }).join(''));
}

self.addEventListener('message', function(e) {
  var req = new XMLHttpRequest
  req.addEventListener("progress", updateProgress, false);
  req.addEventListener("load", transferComplete, false);
  req.addEventListener("error", transferFailed, false);
  req.addEventListener("abort", transferCanceled, false);
  req.open('GET', e.data, true);
  function updateProgress (evt) {
    var percentComplete;
    if (evt.lengthComputable) {
      percentComplete = (evt.loaded / evt.total);
    } else {
      // Impossible de calculer la progression puisque la taille totale est inconnue
      percentComplete = 1;
    }
    self.postMessage({data: {}, progress: percentComplete, status: 'ongoing'});
  }
  function transferComplete(evt) {
    console.log("Le transfert est terminé.");
    var result = JSON.parse(req.responseText);
    self.postMessage({data: req.responseText, progress: 1, status: 'complete'});//, buf: transferable}, [transferable]);
  }

  function transferFailed(evt) {
    console.log("Une erreur est survenue pendant le transfert du fichier.");
  }

  function transferCanceled(evt) {
    console.log("Le transfert a été annulé par l'utilisateur.");
  }
  req.send();
}, false);
