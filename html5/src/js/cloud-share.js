/** @jsx React.DOM */

"use strict";

var React = require("react");
var DaybedBackend = require("./backends/daybed");
var flux = require("./flux").flux;

var Router = require("react-router");
var Routes = Router.Routes;
var Route = Router.Route;

var backend = new DaybedBackend(document.cloudshare.config);

// var routes = (
//   <Routes>
//     <Route handler={FormBuilderApp}>
//       <Route name="createForm"
//              path="/"
//              handler={FormEditor} flux={flux} backend={backend} />
//       <Route name="editForm"
//              path="/edit/:formId/:hawkToken"
//              handler={FormEditor} flux={flux} backend={backend} />
//       <Route name="reportForm"
//              path="/report/:formId/:hawkToken"
//              handler={FormReport} flux={flux} backend={backend} />
//       <Route name="reportReaderForm"
//              path="/report/:formId"
//              handler={FormReport} flux={flux} backend={backend} />
//       <Route name="viewForm"
//              path="/show/:formId"
//              handler={FormViewer} flux={flux} backend={backend} />
//     </Route>
//   </Routes>);
// 
// React.renderComponent(routes, document.getElementById('formbuilder'));
