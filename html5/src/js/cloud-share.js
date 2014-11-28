/** @jsx React.DOM */

"use strict";

var React = require("react");
var DaybedBackend = require("./backends/daybed");
var flux = require("./flux").flux;
var utils = require("./utils");

var CloudShareApp = require("./components/CloudShareApp");

var crypto = require('./crypto.js');
var backend = new DaybedBackend(document.cloudshare.config);


React.renderComponent(
  <CloudShareApp flux={flux} backend={backend} />,
  document.getElementById('cloud-share')
);

if (document.location.href.contains("#/connect")) {
  if (utils.getParameterByName("code")) {
    var session = backend.getToken(
      utils.getParameterByName("code"),
      utils.getParameterByName("state"))
    .then(function(data) {
      var store = flux.store("FilesStore");
      store.setCredentials(data);
    });
  }
}
