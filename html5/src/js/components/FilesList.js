/** @jsx React.DOM */

"use strict";

var React = require("react");
var crypto = require("../crypto");

function displaySize(bytes) {
  console.log(bytes);
  if (bytes < 1024) {
    return bytes + " bytes";
  } else if (bytes < Math.pow(1024, 2)) {
    return (parseInt(bytes / 1024 * 100, 10) / 100) + " kB";
  } else {
    return (parseInt(bytes / (Math.pow(1024, 2) * 100), 10) / 100) + " MB";
  }
}

var FilesList = React.createClass({
  render: function() {
    return (<div className="inner cover" id="files-list">
      <h2 className="cover-heading">Uploaded files</h2>
      <ul className="lead">
      {
        this.props.files.map(function(file) {
          var fileContent = crypto.decryptMessage(
            file.content, file.participantsKeys[this.props.hawkId]['encrypted_key'],
            file.participantsKeys[this.props.hawkId]['temp_public_key'],
            localStorage.getItem("cloud-share:privateKey")
          );
          return (
            <li key={file.id}>
              <a href={fileContent} download={file.filename}><i className="fa-file fa fa-1x"></i>
              &nbsp;&nbsp; {file.filename + " (" + displaySize(fileContent.length) + " )"}</a>
            </li>);
        }.bind(this))
      }
      </ul>
    </div>);
  }
});

module.exports = FilesList;
