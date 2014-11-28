/** @jsx React.DOM */

"use strict";

var React = require("react");
var FileDrop = require('../filedrop');

var FileDropZone = React.createClass({
  componentDidMount: function() {
    var zone = new FileDrop('drop-zone');
    zone.event('send', this.handleDrop);
  },

  handleDrop: function(files) {
    files.each(function(file) {
      console.log(file);
    }.bind(this));
  },

  render: function() {
    return (<div className="inner cover" id="drop-zone">
      <h2>File Upload Drop Zone</h2>
    </div>);
  }
});

module.exports = FileDropZone;
