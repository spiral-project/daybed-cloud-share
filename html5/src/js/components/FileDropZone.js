/** @jsx React.DOM */

"use strict";

var React = require("react");
var FileDrop = require('../filedrop');
var crypto = require('../crypto');

var MAX_SIZE = 1024 * 1024;


var FileDropZone = React.createClass({
  componentDidMount: function() {
    var zone = new FileDrop('drop-zone');
    zone.event('send', this.handleDrop);
  },

  handleDrop: function(files) {
    files.each(function(file) {
      var nativeFile = file.nativeFile;
      var reader = new FileReader();
      reader.onload = function (event) {
        // Get file content
        var content = event.target.result;

        if (content.length > MAX_SIZE) {
          alert(file.name + " size is too big for this PoC.");
          return;
        }

        var encrypted = crypto.encryptMessage(content);
        var messageKey = encrypted.messageKey;
        var encryptedMessage = encrypted.encryptedMessage;

        var publicKey = localStorage.getItem("cloud-share:publicKey");
        var encrypted = crypto.encryptDocumentKey(messageKey, publicKey);

        this.props.upload(file.name, encryptedMessage, {
          'encrypted_key': encrypted.encryptedKey,
          'temp_public_key': encrypted.tempPublicKey
        });
      }.bind(this);
      reader.readAsDataURL(nativeFile);
    }.bind(this));
  },

  render: function() {
    return (<div className="inner cover" id="drop-zone">
      <h2>File Upload Drop Zone</h2>
    </div>);
  }
});

module.exports = FileDropZone;
