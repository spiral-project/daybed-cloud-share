"use strict";

var Fluxxor = require("fluxxor");

var constants = {
  SET_FILES: "SET_FILES",
  SET_CREDENTIALS: "SET_CREDENTIALS"
};


var FilesStore = Fluxxor.createStore({
  initialize: function() {
    this.files = [];
    this.privateKey = localStorage.getItem('cloud-share:privateKey');
    this.publicKey =  localStorage.getItem('cloud-share:publicKey');
    this.hawkSessionToken = localStorage.getItem('cloud-share:hawkSessionToken')

    // XXX. Make this evolve, it's a pain.
    this.bindActions(
      constants.SET_FILES, this.setFiles,
      constants.SET_CREDENTIALS, this.setCredentials
    );
  },

  setFiles: function(records) {
    this.files = records;
    this.emit("change");
  },

  getState: function() {
    return {
      hawkId: this.hawkId,
      files: this.files,
      publicKey: this.publicKey,
      privateKey: this.privateKey
    };
  },

  setCredentials: function(data) {
    localStorage.setItem('cloud-share:publicKey', data.keypair.publicKey);
    localStorage.setItem('cloud-share:privateKey', data.keypair.privateKey);
    localStorage.setItem('cloud-share:hawkSessionToken', data.hawkSessionToken);

    this.hawkId = hawkId;
    this.publicKey = publicKey;
    this.privateKey = privateKey;
    this.hawkSessionToken = hawkSessionToken;
    this.emit("change");
  }

});

var actions = {
  setFiles: function(data) {
    this.dispatch(constants.SET_FILES, data);
  },
  setCredentials: function(data) {
    this.dispatch(constants.SET_CREDENTIALS, data);
  }
};

var stores = {
  FilesStore: new FilesStore()
};

var flux = new Fluxxor.Flux(stores, actions);

module.exports = {
  flux: flux,
  actions: actions
};
