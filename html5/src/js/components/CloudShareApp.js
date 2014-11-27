/** @jsx React.DOM */

"use strict";

var React = require("react");
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Header = require("./Header");
var FileDropZone = require("./FileDropZone");
var FilesList = require("./FilesList");

var Footer = require("./Footer");

var CloudShareApp = React.createClass({
  mixins: [
    FluxMixin,
    StoreWatchMixin("FilesStore")
  ],

  componentDidMount: function() {
    this.loadFiles();
  },

  loadFiles: function() {
    var hawkId = localStorage.getItem("cloud-share:Hawk-Session-Token");
    this.props.backend.loadFiles(hawkId).then(function(doc) {
      this.getFlux().actions.setInitialData(doc.records);
    }.bind(this));
  },

  getStateFromFlux: function() {
    return this.getFlux().store("FilesStore").getState();
  },

  render: function() {
    return (
      <div className="site-wrapper">
        <div className="site-wrapper-inner">
        <div className="cover-container">
            <Header />

            <FileDropZone uploadFile={console.log} />

            <FilesList files={this.state.files} />

            <Footer />
          </div>
        </div>
      </div>
      );
  }
});

module.exports = CloudShareApp;
