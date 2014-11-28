"use strict";

/**
 * Get from the querystring the name of the given parameter.
 **/
function getParameterByName(name) {
  console.log("getparameter", name);
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  var results = regex.exec(window.location.hash);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

module.exports = {
  getParameterByName: getParameterByName
};
