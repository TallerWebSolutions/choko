'use strict';

/**
 * @file Main AngularJS module for the Choko application.
 */

// Declare app level module which depends on services, directives and filters.
angular.module('choko', [
  'ngRoute',
  'ngResource',
  'ngSanitize',
  'summernote',
  'angularFileUpload',
  'ui.select'
])

.config(['$locationProvider', function($locationProvider) {
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
}]);
