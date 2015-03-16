var lodash = require('lodash');
var ReactHook = module.exports;
var ReactApp = require('./app.server.js');

// @TODO: Create "type" for reflux definitions for extensions to use.
var refluxDefinitions = require('./reflux/definitions.js')

/**
 * Hook response();
 */
ReactHook.response = function (payload, request, response, callback) {

  var self = this;

  // Get all implemented routes.
  this.application.collect('route', function (error, routes) {

    var pagePaths = [];
    lodash(routes).each(function (route) {
      if (route.router === 'page') {
        return pagePaths.push(route.path);
      }
    }).__wrapped__;

    // Execute.
    self.application.pick('route', request.route.path, function(error, current_route) {

      if (current_route.router === 'page') {
        if (request.accepts(['json', 'html']) === 'html') {

          var argsApp = {
            requestUrl:        request.url,
            dehydratedState:   payload.data,
            pagePaths:         pagePaths,
            refluxDefinitions: refluxDefinitions
          }

          ReactApp(argsApp, function (output) {
            // Render the output.
            response.status(payload.status.code).send(output);
          });
        }
        else {
          response.status(payload.status.code).send(payload);
        }
      }
    });
  });
};