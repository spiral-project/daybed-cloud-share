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

function validateEmail(email) {
    var re = /^[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
    return re.test(email);
}

module.exports = {
  getParameterByName: getParameterByName,
  validateEmail: validateEmail
};
