/** @jsx React.DOM */

"use strict";

var React = require("react");

var Footer = React.createClass({
  render: function() {
    return (
          <div className="mastfoot">
            <div className="inner">
              <p>
                Inspired by <a href="https://daybed.rtfd.org/">Daybed</a> —
                &copy; <a href="https://github.com/mozilla-services">Mozilla Services</a>.
              </p>
            </div>
          </div>);
  }
});

module.exports = Footer;
