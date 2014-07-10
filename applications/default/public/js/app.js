/**
 * @file Main AngularJS module for the choko application.
 */

'use strict';

<<<<<<< HEAD
// Define core choko dependencies.
var dependencies = [
  'ngRoute',
  'ngResource',
  'ngSanitize',
  'summernote',
  'angularFileUpload'
];

// Declare main choko module.
angular.module('choko', dependencies)

  // Define current choko version.
  // @todo: we should read package.json and make available not only a version
  // value but other metadata that might be used thoughout the application.
  .value('version', '0.0.4')

  // Location/routing configuration.
  .config(['$locationProvider', '$httpProvider', function($locationProvider, $httpProvider) {

    // Use HTML5 mode to remove "#" symbols from angular-routed pages.
    // $locationProvider.html5Mode(true);

    // @todo: This line cause problems with contexts.
    /*
    $httpProvider.interceptors.push(function (applicationState) {
      return {
        request: function (config) {
          return angular.extend(config, {
            params: {
              contexts: applicationState.get().contexts || []
            }
          });
        }
      }
    })
    */

  }]);
=======
// Declare app level module which depends on services, directives and filters.
angular.module('choko', ['ngRoute', 'ngResource', 'ngSanitize', 'summernote', 'angularFileUpload', 'choko.services', 'choko.directives', 'choko.filters', 'choko.controllers'])
.config(['$locationProvider', function($locationProvider) {
  //$locationProvider.html5Mode(true);
}]);
>>>>>>> fs/angular-controllers
