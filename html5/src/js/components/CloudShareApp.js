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

function validateEmail(email) {
    var re = /^[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
    return re.test(email);
}

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

  shareFile: function(fileId) {
    return function() {
      var email = "";
      while (!(email === null || validateEmail(email))) {
        email = prompt("Enter the email address with whom you'd like to share this document: ");
      }

      if (email === null) {
        return;
      }

      this.props.backend.getPublicKey(email).then(function(publicKeyDoc) {
        var file = this.state.files.filter(function(file) {
          return file.id === fileId;
        })[0];

        var message_key = decryptDocumentKey(
          file.participantsKeys[this.state.hawkId]['encrypted_key'],
          file.participantsKeys[this.state.hawkId]['temp_public_key'],
          localStorage.getItem("cloud-share:privateKey"));

        var newParticipantKey = encryptDocumentKey(message_key, publicKeyDoc.pub);
        file.participantsKeys[publicKeyDoc.hawk_id] = {
          'encrypted_key': newParticipantKey.encryptedKey,
          'temp_public_key': newParticipantKey.tempPublicKey
        };

        var hawkToken = localStorage.getItem("cloud-share:Hawk-Session-Token");
        this.props.backend.shareFile(
          hawkToken, fileId, publicKeyDoc.hawk_id, file.participantsKeys
        ).then(function() {
            console.log(fileId + " has been shared with " + publicKeyDoc.user_id);
          });

      }).catch(function(err) {
        alert("No public key found for: " + email +
              ". Ask this person to connect once to Daybed Cloud Share.");
      });

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
                       removeFile={this.removeFile} shareFile={this.shareFile} />
            <Footer />
          </div>
        </div>
      </div>
      );
  }
});

module.exports = CloudShareApp;
