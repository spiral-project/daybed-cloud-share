var nacl_factory = require("js-nacl");
var nacl = nacl_factory.instantiate();


var loadKeypair = function(key) {
  var publicKey = nacl.crypto_scalarmult_base(key);
  return {
    publicKey: nacl.to_hex(publicKey),
    privateKey: nacl.to_hex(key)
  }
}

var generateKeypair = function() {
  return loadKeypair(nacl.random_bytes(nacl.crypto_box_SECRETKEYBYTES));
}

var encryptDocumentKey = function(key, recipientPubKey) {
  recipientPubKey = nacl.from_hex(recipientPubKey);
  key = nacl.from_hex(key);

  var tempKeyPair = nacl.crypto_box_keypair();
  var nonce = nacl.crypto_box_random_nonce();
  var encryptedKey = nacl.crypto_box(key, nonce, recipientPubKey, tempKeyPair.boxSk);

  return {
    encryptedKey: nacl.to_hex(nonce) + nacl.to_hex(encryptedKey),
    tempPublicKey: nacl.to_hex(tempKeyPair.boxPk)
  };
}

var decryptDocumentKey = function(encryptedKeyWrapper, tempPublicKey,
                                  privateKey){
  encryptedKeyWrapper = nacl.from_hex(encryptedKeyWrapper);
  var nonce = encryptedKeyWrapper.subarray(0, nacl.crypto_box_NONCEBYTES);
  var encryptedKey = encryptedKeyWrapper.subarray(nacl.crypto_box_NONCEBYTES)
  var tempPublicKey = nacl.from_hex(tempPublicKey);
  var privateKey = nacl.from_hex(privateKey);

  try {
    return nacl.crypto_box_open(encryptedKey, nonce, tempPublicKey, privateKey);
  } catch (e) {
    console.log(e);
  }
}

var encryptMessage = function(message) {
  var key = nacl.random_bytes(nacl.crypto_secretbox_KEYBYTES);
  var nonce = nacl.crypto_secretbox_random_nonce();
  var message = nacl.encode_utf8(message);

  var encrypted = nacl.crypto_secretbox(message, nonce, key);

  return {
    messageKey: nacl.to_hex(key),
    encryptedMessage: nacl.to_hex(nonce) + nacl.to_hex(encrypted)
  };
}

var decryptMessage = function(encryptedMessageWrapper, encryptedKey,
                              tempPublicKey, privateKey) {
  var messageKey = decryptDocumentKey(encryptedKey, tempPublicKey, privateKey);

  var encryptedMessageWrapper = nacl.from_hex(encryptedMessageWrapper);
  var nonce = encryptedMessageWrapper.subarray(0, nacl.crypto_secretbox_NONCEBYTES);
  var encryptedMessage = encryptedMessageWrapper.subarray(nacl.crypto_secretbox_NONCEBYTES)

  return nacl.decode_utf8(nacl.crypto_secretbox_open(encryptedMessage, nonce, messageKey));
}

var test = function() {
  // Exercice the APIs
  // 1. Encrypt the document with the document key.

  var encrypted = crypto.encryptMessage("My super message");
  var messageKey = encrypted.messageKey;
  var encryptedMessage = encrypted.encryptedMessage;

  var recipientKeypair = crypto.generateKeypair();

  // 2. Encrypt the document key with the user key.
  var encrypted = crypto.encryptDocumentKey(messageKey, recipientKeypair.publicKey);
  var encryptedKey = encrypted.encryptedKey;
  var tempPublicKey = encrypted.tempPublicKey;

  // 3. Decrypt.
  var message = crypto.decryptMessage(
    encryptedMessage, encryptedKey, tempPublicKey, recipientKeypair.privateKey);

  message === "My super message"
  console.log("decrypted", message);
}

module.exports = {
  loadKeypair: loadKeypair,
  generateKeypair: generateKeypair,
  encryptDocumentKey: encryptDocumentKey,
  decryptDocumentKey: decryptDocumentKey,
  encryptMessage: encryptMessage,
  decryptMessage: decryptMessage,
}
