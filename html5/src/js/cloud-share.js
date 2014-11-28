/** @jsx React.DOM */

"use strict";

var React = require("react");
var DaybedBackend = require("./backends/daybed");
var flux = require("./flux").flux;

var CloudShareApp = require("./components/CloudShareApp");

var crypto = require('./crypto.js');
var backend = new DaybedBackend(document.cloudshare.config);

React.renderComponent(
  <CloudShareApp flux={flux} backend={backend} />,
  document.getElementById('cloud-share')
);
