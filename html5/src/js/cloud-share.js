/** @jsx React.DOM */

"use strict";

var React = require("react");
var DaybedBackend = require("./backends/daybed");
var flux = require("./flux").flux;
var utils = require("./utils");

var CloudShareApp = require("./components/CloudShareApp");

var crypto = require('./crypto.js');
var backend = new DaybedBackend(document.cloudshare.config);

function displayApp() {
  React.renderComponent(
    <CloudShareApp flux={flux} backend={backend} />,
    document.getElementById('cloud-share')
  );
}

if (document.location.href.indexOf("#/connect") !== -1) {
  if (utils.getParameterByName("code")) {
    var session = backend.getToken(
      utils.getParameterByName("code"),
      utils.getParameterByName("state"))
    .then(function(data) {
      var store = flux.store("FilesStore");
      data.keypair = crypto.loadKeypair(data.secret + data.secret);
      backend.uploadPublicKey(data.token, data.keypair.publicKey)
        .then(function() {
          store.setCredentials(data);
          document.location.hash = "";
          displayApp();
        });
    });
  }
}

displayApp();
