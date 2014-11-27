"use strict";

var Fluxxor = require("fluxxor");

var constants = {
  SET_INITIAL_DATA: "SET_INITIAL_DATA"
};


var FilesStore = Fluxxor.createStore({
  initialize: function() {
    this.files = [];

    // XXX. Make this evolve, it's a pain.
    this.bindActions(
      constants.SET_INITIAL_DATA, this.setInitialData
    );
  },

  setInitialData: function(payload) {
    if (payload === undefined) {
      payload = [];
    }
    this.files = payload;
    this.emit("change");
  },

  getState: function() {
    return {
      files: this.files
    };
  }
});

var actions = {
  setInitialData: function(data) {
    this.dispatch(constants.SET_INITIAL_DATA, data);
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
