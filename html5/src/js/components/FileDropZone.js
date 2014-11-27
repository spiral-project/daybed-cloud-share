/** @jsx React.DOM */

"use strict";

var React = require("react");

var FileDropZone = React.createClass({
  render: function() {
    return (<div className="inner cover" id="drop-zone">
      <h2>File Upload Drop Zone</h2>
    </div>);
  }
});

module.exports = FileDropZone;
