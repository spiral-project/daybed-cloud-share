/** @jsx React.DOM */

"use strict";

var React = require("react");

var Header = React.createClass({
  render: function() {
    return (
      <div className="navbar navbar-default navbar-static-top" role="navigation">
      <div className="container">
        <div className="navbar-header">
          <a className="navbar-brand" href="#">Daybed Cloud Share</a>
        </div>
        <div className="navbar-collapse collapse">
          <ul className="nav navbar-nav navbar-right">
            <li><a href="http://daybed.readthedocs.org/en/latest/#why">Our values</a></li>
            <li><a href="https://github.com/spiral-project/daybed-cloud-share">Fork me !</a></li>
          </ul>
        </div>
      </div>
    </div>);
  }
});

module.exports = Header;
