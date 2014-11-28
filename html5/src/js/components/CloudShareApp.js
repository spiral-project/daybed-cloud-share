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
var utils = require("../utils");
var crypto = require("../crypto");


var CloudShareApp = React.createClass({
  mixins: [
    FluxMixin,
    StoreWatchMixin("FilesStore")
  ],

  componentDidMount: function() {
    this.loadFiles();
  },

  loadFiles: function() {
    if (this.state.hawkSessionToken) {
      this.props.backend.loadFiles(this.state.hawkSessionToken)
        .then(function(doc) {
          this.getFlux().actions.setFiles(doc.records);
        }.bind(this))
        .catch(function(err) { throw err });
    }
  },

  uploadFile: function(filename, encryptedMessage, participantKey) {
    var participantsKeys = {};
    participantsKeys[this.state.hawkId] = participantKey;
    this.props.backend.uploadFile(
      this.state.hawkSessionToken,
      filename, encryptedMessage, participantsKeys
    ).then(this.loadFiles);
  },

  removeFile: function(fileId) {
    return function() {
      this.props.backend.removeFile(this.state.hawkSessionToken, fileId)
        .then(this.loadFiles);
    }.bind(this);
  },

  shareFile: function(fileId) {
    return function() {
      var email = "";
      while (!(email === null || utils.validateEmail(email))) {
        email = prompt("Enter the email address with whom you'd like to share this document: ");
      }

      if (email === null) {
        return;
      }

      this.props.backend.getPublicKey(email).then(function(publicKeyDoc) {
        var file = this.state.files.filter(function(file) {
          return file.id === fileId;
        })[0];

        var message_key = crypto.decryptDocumentKey(
          file.participantsKeys[this.state.hawkId]['encrypted_key'],
          file.participantsKeys[this.state.hawkId]['temp_public_key'],
          this.state.privateKey);

        var newParticipantKey = crypto.encryptDocumentKey(message_key, publicKeyDoc.pub);
        file.participantsKeys[publicKeyDoc.hawk_id] = {
          'encrypted_key': newParticipantKey.encryptedKey,
          'temp_public_key': newParticipantKey.tempPublicKey
        };

        return this.props.backend.shareFile(
          this.state.hawkSessionToken,
          fileId, publicKeyDoc.hawk_id, file.participantsKeys
        ).then(function() {
            console.log(fileId + " has been shared with " + publicKeyDoc.user_id);
          });

      }.bind(this)).catch(function(err) {
        console.log(err);
        alert("No public key found for: " + email +
              ". Ask this person to connect once to Daybed Cloud Share.");
      });

    }.bind(this);
  },

  getStateFromFlux: function() {
    return this.getFlux().store("FilesStore").getState();
  },

  render: function() {
    var sharing = <div>Please login</div>;
    if (this.state.hawkSessionToken) {
      sharing = <div>
        <FileDropZone upload={this.uploadFile} />
          <FilesList files={this.state.files} hawkId={this.state.hawkId}
                     removeFile={this.removeFile} shareFile={this.shareFile} />
        </div>;
    }
    return (
      <div className="site-wrapper">
        <div className="site-wrapper-inner">
        <div className="cover-container">
            <Header backend={this.props.backend} />
            {sharing}
            <Footer />
          </div>
        </div>
      </div>
      );
  }
});

module.exports = CloudShareApp;
