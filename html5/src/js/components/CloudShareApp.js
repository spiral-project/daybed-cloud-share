/** @jsx React.DOM */

"use strict";

var React = require("react");
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Header = require("./Header");
var FileDropZone = require("./FileDropZone");
var FilesList = require("./FilesList");


var CloudShareApp = React.createClass({
  mixins: [
    FluxMixin,
    StoreWatchMixin("FilesStore")
  ],

  getStateFromFlux: function() {
    return this.getFlux().store("FilesStore").getState();
  },

  render: function() {
    return (
      <div>
        <Header />
        <FileDropZone uploadFile={console.log} />
        <FilesList />
      </div>
      );
  }
});

module.exports = CloudShareApp;
