var Daybed = require('daybed.js');

var DaybedStorage = function(config) {
  this.host = config.daybedHost;
};

var DOCUMENT_MODEL = "daybed:cloud_share:document";

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

  uploadFile: function(hawkToken, filename, encryptedMessage, participantKeys) {
    return this.bindSession(hawkToken)
      .then(function(session) {
        var keys = {};
        Object.keys(participantKeys).forEach(function(key) {
          if (key === "myHawkId") {
            keys[session.credentials.id] = participantKeys[key];
          } else {
            keys[key] = participantKeys[key];
          }
        });
        var result = {
          filename: filename,
          content: encryptedMessage,
          participantsKeys: keys
        };
        return session.saveRecord(DOCUMENT_MODEL, result);
      });
  },

  loadFiles: function(hawkToken) {
    return this.bindSession(hawkToken)
      .then(function(session){
        return session.getRecords(DOCUMENT_MODEL);
      });
  }
};

module.exports = DaybedStorage;
