var Daybed = require('daybed.js');

var DaybedStorage = function(config) {
  this.host = config.daybedHost;
};

var DOCUMENT_MODEL = "daybed:cloud_share:document";
var PUBLIC_KEY_MODEL = "daybed:cloud_share:pubkey_store";

DaybedStorage.prototype = {

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
        result = session.getRecords(DOCUMENT_MODEL)
        result.hawkId = session.credentials.id;
        return result;
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
