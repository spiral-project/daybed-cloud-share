"use strict";

var Fluxxor = require("fluxxor");

var constants = {
  SET_FILES: "SET_FILES",
  SET_CREDENTIALS: "SET_CREDENTIALS"
};


var FilesStore = Fluxxor.createStore({
  initialize: function() {
    this.files = [];
    this.hawkId = localStorage.getItem('cloud-share:hawkId');
    this.privateKey = localStorage.getItem('cloud-share:privateKey');
    this.publicKey =  localStorage.getItem('cloud-share:publicKey');
    this.hawkSessionToken = localStorage.getItem('cloud-share:hawkSessionToken');
    this.email = localStorage.getItem('cloud-share:email');

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
      files: this.files,
      hawkId: this.hawkId,
      publicKey: this.publicKey,
      privateKey: this.privateKey,
      email: this.email,
      hawkSessionToken: this.hawkSessionToken
    };
  },

  setCredentials: function(data) {
    localStorage.setItem('cloud-share:publicKey', data.keypair.publicKey);
    localStorage.setItem('cloud-share:privateKey', data.keypair.privateKey);
    localStorage.setItem('cloud-share:hawkSessionToken', data.token);
    localStorage.setItem('cloud-share:email', data.email);
    localStorage.setItem('cloud-share:hawkId', data.hawkId);

    this.publicKey = data.keypair.publicKey;
    this.privateKey = data.keypair.privateKey;
    this.hawkSessionToken = data.token;
    this.email = data.email;
    this.hawkId = data.hawkId;

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
