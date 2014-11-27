/** @jsx React.DOM */

"use strict";

var React = require("react");

var Header = React.createClass({
  render: function() {
    return (
          <div className="masthead clearfix">
            <div className="inner">
              <h3 className="masthead-brand"><a href="/">Daybed Cloud Share</a></h3>
              <nav>
                <ul className="nav masthead-nav">
                  {/*<li className="active"><a href="/">Home</a></li>*/}
                  <li><a href="http://daybed.readthedocs.org/en/latest/#why">Our values</a></li>
                  <li><a href="https://github.com/spiral-project/daybed-cloud-share">Fork me !</a></li>
                </ul>
              </nav>
            </div>
          </div>);
  }
});

module.exports = Header;
