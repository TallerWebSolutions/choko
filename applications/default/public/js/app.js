'use strict';

/**
 * @file Main AngularJS module for the choko application.
 */

// Declare app level module which depends on services, directives and filters.
angular.module('choko', [
    'ngRoute',
    'ngResource',
    'ngSanitize',
    'summernote',
    'restangular',
    'ngFileUpload',
    'ui.select'
  ])

  // Location/routing configuration.
  .config(['$locationProvider',
    function($locationProvider) {
      $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });
    }
  ])
  .config(['RestangularProvider',
    function(RestangularProvider) {
      RestangularProvider.setBaseUrl('/rest');

      // @todo: We need improve the caching functionality.
      // The items list not change after add an ítem, because
      // he get the items list from the caché.
      RestangularProvider.setDefaultHttpFields({
        cache: false
      });

      // Add a response intereceptor
      RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
        var extractedData;

        if (operation === 'getList') {
          var temp = [];

          Object.keys(data).forEach(function(name) {
            temp.push(data[name]);
          });

          extractedData = temp;
        } else if (operation === 'remove') {
          extractedData = data[0];
        } else {
          extractedData = data;
        }

        return extractedData;
      });
    }
  ]);
