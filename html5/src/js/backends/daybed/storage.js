var Daybed = require('daybed.js');

var DaybedStorage = function(config) {
  this.host = config.daybedHost;
};

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

  storeFile: function(hawkToken, record) {
    return this.bindSession(hawkToken)
      .then(function(session) {
        var result = {};
        Object.keys(record).forEach(function(key) {
          result[slugify(key)] = record[key];
        });
        return session.saveRecord(formId, result);
      });
  },

  loadFiles: function(hawkToken) {
    return this.bindSession(hawkToken)
      .then(function(session){
        return session.getRecords(formId);
      });
  }
};

module.exports = DaybedStorage;
