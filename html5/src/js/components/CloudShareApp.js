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
    var hawkToken = localStorage.getItem("cloud-share:Hawk-Session-Token");
    this.props.backend.loadFiles(hawkToken).then(function(doc) {
      this.getFlux().actions.setInitialData(doc);
    }.bind(this));
  },

  uploadFile: function(filename, encryptedMessage, participantKey) {
    var hawkToken = localStorage.getItem("cloud-share:Hawk-Session-Token");
    var participantsKeys = {};
    participantsKeys[this.state.hawkId] = participantKey;
    this.props.backend.uploadFile(
      hawkToken, filename, encryptedMessage, participantsKeys
    ).then(this.loadFiles);
  },

  removeFile: function(fileId) {
    return function() {
      var hawkToken = localStorage.getItem("cloud-share:Hawk-Session-Token");
      this.props.backend.removeFile(hawkToken, fileId).then(this.loadFiles);
    }.bind(this);
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
            <FileDropZone upload={this.uploadFile} />
            <FilesList files={this.state.files} hawkId={this.state.hawkId}
                       removeFile={this.removeFile} />
            <Footer />
          </div>
        </div>
      </div>
      );
  }
});

module.exports = CloudShareApp;
