var nacl_factory = require("js-nacl");
var nacl = nacl_factory.instantiate();


var loadKeypair = function(key) {
  var publicKey = nacl.crypto_scalarmult_base(key);
  return {
    publicKey: publicKey,
    privateKey: key
  }
}

var generateKeypair = function() {
  return loadKeypair(nacl.random_bytes(nacl.crypto_box_SECRETKEYBYTES));
}

var encryptDocumentKey = function(key, recipientPubKey) {
  var tempKeyPair = nacl.crypto_box_keypair();
  var nonce = nacl.crypto_box_random_nonce();
  var encryptedKey = nacl.crypto_box(key, nonce, tempKeyPair.boxSk,
                                     recipientPubKey);

  return {
    encryptedKey: nonce + encryptedKey,
    tempPublicKey: tempKeyPair.boxPk
  };
}

var decryptDocumentKey = function(encryptedKeyWrapper, tempPublicKey,
                                  privateKey){
  var nonce = encryptedKeyWrapper.slice(0, nacl.crypto_box_NONCEBYTES);
  var encryptedKey = encryptedKeyWrapper.slice(
    nacl.crypto_box_NONCEBYTES,
    encryptedKeyWrapper.length
  );

  return nacl.crypto_box_open(encryptedKey, nonce, privateKey, tempPublicKey);
}

var encryptMessage = function(message) {
  var key = nacl.random_bytes(nacl.crypto_secretbox_KEYBYTES);
  var nonce = nacl.crypto_secretbox_random_nonce();

  var encrypted = nacl.crypto_secretbox(message, nonce, key);

  return {
    messageKey: key,
    encryptedMessage: nonce + encrypted
  };
}

var decryptMessage = function(encryptedMessageWrapper, encryptedKey,
                              tempPublicKey, privateKey) {
  var messageKey = decryptDocumentKey(encryptedKey, tempPublicKey, privateKey);

  var nonce = encryptedMessageWrapper.slice(
    0, nacl.crypto_secretbox_NONCEBYTES);

  var encryptedMessage = encryptedMessageWrapper.slice(
    nacl.crypto_secretbox_NONCEBYTES,
    encryptedMessageWrapper.length
  );

  return nacl.crypto_secretbox_open(encryptedMessage, nonce, messageKey);
}
