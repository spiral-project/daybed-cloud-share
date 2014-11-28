/** @jsx React.DOM */

"use strict";

var React = require("react");
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Header = React.createClass({
  mixins: [
    FluxMixin,
    StoreWatchMixin("FilesStore")
  ],

  getStateFromFlux: function() {
    return this.getFlux().store("FilesStore").getState();
  },

  login: function() {
    this.props.backend.login().catch(function(err) {
        console.log(err);
      });
  },

  render: function() {
    var loggedWith = "Login";
    if (this.state.email) {
        loggedWith = this.state.email;
    }
    return (
          <div className="masthead clearfix">
            <div className="inner">
              <h3 className="masthead-brand"><a href="/">Daybed Cloud Share</a></h3>
              <nav>
                <ul className="nav masthead-nav">
                  <li><a href="#" onClick={this.login}>{loggedWith}</a></li>
                  <li><a href="http://daybed.readthedocs.org/en/latest/#why">Our values</a></li>
                  <li><a href="https://github.com/spiral-project/daybed-cloud-share">Fork me !</a></li>
                </ul>
              </nav>
            </div>
          </div>);
  }
});

module.exports = Header;
