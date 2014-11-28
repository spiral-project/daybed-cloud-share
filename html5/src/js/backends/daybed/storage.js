var Daybed = require('daybed.js');

var DaybedStorage = function(config) {
  this.host = config.daybedHost;
};

var DOCUMENT_MODEL = "daybed:cloud_share:document";
var PUBLIC_KEY_MODEL = "daybed:cloud_share:pubkey_store";
var DAYBED_HOST = "http://localhost:8000";

DaybedStorage.prototype = {

  login: function() {
    return Daybed.fxaOAuth.login(DAYBED_HOST, {
      redirect_uri: document.location.href + "#/connect"
    });
  },

  getToken: function(code, state) {
    console.log("getToken", code, state);
    return Daybed.fxaOAuth.getToken(DAYBED_HOST, {code: code, state: state})
      .then(function(data) {
        return {
          keypair: crypto.generateKeypair(data.profile.uid),
          token: data.token,
          hawkId: data.hawkId
        };
      });
  },

  bindSession: function(hawkToken) {
    var credentials;
    if (hawkToken !== undefined) {
      credentials = {token: hawkToken};
    }
    return Daybed.startSession(this.host, credentials);
  },

  bindOrCreateSession: function(hawkToken) {
    return this.bindSession(hawkToken).catch(function() {
      return this.bindSession();
    }.bind(this));
  },

  uploadFile: function(hawkToken, filename, encryptedMessage, participantsKeys) {
    return this.bindSession(hawkToken)
      .then(function(session) {
        var result = {
          filename: filename,
          content: encryptedMessage,
          participantsKeys: participantsKeys
        };
        return session.saveRecord(DOCUMENT_MODEL, result);
      });
  },

  loadFiles: function(hawkToken) {
    return this.bindSession(hawkToken)
      .then(function(session){
        return session.getRecords(DOCUMENT_MODEL)
      });
  },

  removeFile: function(hawkToken, fileId) {
    return this.bindSession(hawkToken)
      .then(function(session){
        return session.deleteRecord(DOCUMENT_MODEL, fileId);
      });
  },

  getPublicKey: function(email) {
    return Daybed.startSession(this.host, {anonymous: true}).then(
      function(session) {
        var query = {
          query: {
            filtered: {
              query: {
                match: {userId: email},
              }
            }
          }
        };

        return session.searchRecord(PUBLIC_KEY_MODEL, query).then(
          function(results) {
            if (results.length === 0) {
              throw new Error("No public key found for " + email);
            }
            return results[0];
          });
      });
  },

  shareFile: function(hawkToken, fileId, participantHawkId, participantsKeys) {
    return this.bindSession(hawkToken).then(function(session) {
      var result = {
        id: fileId,
        participantsKeys: participantsKeys
      };
      return session.saveRecord(DOCUMENT_MODEL, result).then(function() {
        return session.addRecordAuthor(DOCUMENT_MODEL, fileId, participantHawkId);
      });
    });
  }
};

module.exports = DaybedStorage;
