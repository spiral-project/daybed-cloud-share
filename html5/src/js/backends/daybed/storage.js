var Daybed = require('daybed.js');

var DaybedStorage = function(config) {
  this.host = config.daybedHost;
};

var DOCUMENT_MODEL = "daybed:cloud_share:document";
var PUBLIC_KEY_MODEL = "daybed:cloud_share:pubkey_store";

DaybedStorage.prototype = {

  login: function() {
    return Daybed.fxaOAuth.login(this.host, {
      redirect_uri: document.location.href.split('#')[0] + "#/connect"
    });
  },

  getToken: function(code, state) {
    return Daybed.fxaOAuth.getToken(this.host, {code: code, state: state})
      .then(function(data) {
        return {
          secret: (data.profile.uid + data.profile.uid).substr(0, 64),
          email: data.profile.email,
          token: data.token,
          hawkId: data.credentials.id,
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
                match: {user_id: email},
              }
            }
          }
        };

        return session.searchRecords(PUBLIC_KEY_MODEL, query).then(
          function(results) {
            var hits = results.hits.hits;
            if (hits.length === 0) {
              throw new Error("No public key found for " + email);
            }
            return hits[0]._source;
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
  },

  uploadPublicKey: function(hawkToken, publicKey) {
    return this.bindSession(hawkToken).then(function(session) {
      return session.saveRecord(PUBLIC_KEY_MODEL, {
        hawk_id: session.credentials.id,
        id: session.credentials.id, // this is for retro compat with python cli.
        pub: publicKey
      }, {replace: true});
    });
  }
};

module.exports = DaybedStorage;
