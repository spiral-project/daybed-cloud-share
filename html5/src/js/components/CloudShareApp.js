/** @jsx React.DOM */

"use strict";

var React = require("react");

var Header = require("./Header");


var CloudShareApp = React.createClass({
  render: function() {
    return (
      <div>
        <Header />
        {this.props.activeRouteHandler()}
      </div>
      );
  }
});

module.exports = CloudShareApp;
