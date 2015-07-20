var lodash = require('lodash');
var ReactHook = module.exports;
var ReactApp = require('./app.server.js');
var Webpack = require("webpack");
var path = require('path');

// @TODO: Create "type" for reflux definitions for extensions to use.
var refluxDefinitions = require('./reflux/definitions.js');

var createWebpackSettings = require('./webpack/createSettings.js');

/**
 * Hook init();
 */
ReactHook.init = function (app, callback) {
  // @TODO: Make this an array getting from the entrys.
  app.settings.webpack = {
    publicDirUrl: '/bundles',
    entry: [
      {app: './app.client.js'}
    ]
  };

  // Public path to the app bundle.
  app.settings.webpack.bundleUrl = path.join(app.settings.webpack.publicDirUrl, 'app.js');

  var webpackSettings = createWebpackSettings({
    baseDir: app.settings.baseDir,
    // @TODO: Allow multiple entries.
    entry: app.settings.webpack.entry[0],
    output: {
      path: path.join(app.settings.applicationDir, 'public/bundles')
    },
    constants: {
      'CHOKO_ON_BROWSER': true
    }
  });

  var webpack = Webpack(webpackSettings);
  webpack.run(function (error, stats) {

    // console.log(stats.toJson(), 'haaaa');

    callback();
  });

};

/**
 * Hook response();
 */
ReactHook.response = function (payload, request, response, callback) {

  var self = this;

  // Get all implemented routes.
  this.application.collect('route', function (error, routes) {

    var pagePaths = [];
    lodash.each(routes, function (route) {
      if (route.router === 'page') {
        return pagePaths.push(route.path);
      }
    });

    // Execute.
    self.application.pick('route', request.route.path, function(error, current_route) {

      if (current_route.router === 'page') {
        if (request.accepts(['json', 'html']) === 'html') {

          var chokoSettings = {
            bundleUrl: self.application.settings.webpack.bundleUrl
          };

          var dehydratedState = lodash.merge(payload.data, {
            routes: pagePaths,
            application: {
              settings: chokoSettings
            }
          });

          // @TODO: It should be less verbose.
          var argsApp = {
            requestUrl:        request.url,
            dehydratedState:   dehydratedState,
            pagePaths:         pagePaths,
            refluxDefinitions: refluxDefinitions,
            chokoSettings:     chokoSettings
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
      else {
        // Bypass if isn't a page.
        callback();
      }
    });
  });
};

ReactHook.panels = function (panels, callback) {
  lodash.map(panels, function (panel) {
    if (lodash.startsWith(panel.name, 'navigation-')) {
      panel.component = 'Navigation';
    }
  });
  callback();
};