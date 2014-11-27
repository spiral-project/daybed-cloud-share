"use strict";

var Fluxxor = require("fluxxor");

var constants = {
};


var FilesStore = Fluxxor.createStore({
  initialize: function() {
    this.files = [];

    // XXX. Make this evolve, it's a pain.
    this.bindActions(
      // constants.ADD_FORM_ELEMENT, this.onAdd,
    );
  },

  setInitialData: function(payload) {
    if (payload === undefined) {
      payload = {
        files: []
      };
    }
    this.files = payload.files;
    this.emit("change");
  },

  // onAdd: function(payload) {
  //   this.record[payload.name] = payload.value;
  //   this.emit("change");
  // },

  getState: function() {
    return {
      formElements: this.elements,
      metadata: this.metadata,
      record: this.record,
      formStatus: this.formStatus
    };
  }
});

var actions = {
  // addFormElement: function(fieldType, defaultData) {
  //   this.dispatch(constants.ADD_FORM_ELEMENT, {
  //     fieldType: fieldType,
  //     defaultData: defaultData
  //   });
  // },
};

var stores = {
  FilesStore: new FilesStore()
};

var flux = new Fluxxor.Flux(stores, actions);

module.exports = {
  flux: flux,
  actions: actions
};
