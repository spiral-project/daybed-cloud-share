/** @jsx React.DOM */

"use strict";

var React = require("react");

var FilesList = React.createClass({
  render: function() {
    return (<div className="inner cover" id="files-list">
      <h2 className="cover-heading">Uploaded files</h2>
      <ul className="lead">
      {
        this.props.files.map(function(file) {
          var fileContent = "data:text/plain;base64," + btoa(file.content);
          return (
            <li key={file.id}>
              <a href={fileContent} download={file.filename}><i className="fa-file fa fa-1x"></i>
              &nbsp;&nbsp; {file.filename}</a>
            </li>);
        })
      }
      </ul>
    </div>);
  }
});

module.exports = FilesList;
