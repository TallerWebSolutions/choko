'use strict';

/**
 * @file Main AngularJS module for the choko application.
 */

// Define core choko dependencies.
var dependencies = [
  'ngRoute',
  'ngResource',
  'ngSanitize',
  'summernote',
  'restangular',
  'angularFileUpload',
  'ui.select'
];

// Declare main choko module.
angular.module('choko', dependencies)

  // Define current choko version.
  // @todo: we should read package.json and make available not only a version
  // value but other metadata that might be used thoughout the application.
  .value('version', '0.0.4')

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

          Object.keys(data.data).forEach(function(name) {
            temp.push(data.data[name]);
          });
          extractedData = temp;
        } else if (operation === 'put') {
          extractedData = data.data;
          extractedData.updated = true;
        } else {
          extractedData = data.data;
        }
        return extractedData;
      });

      RestangularProvider.setResponseExtractor(function(response) {
        var newResponse = response;

        // Verify if the response is an Array object
        if (angular.isArray(response)) {
          angular.forEach(newResponse, function(value, key) {
            newResponse[key].originalElement = angular.copy(value);
          });

        // Verify if the response is a String object
        } else if (angular.isString(response)) {
          newResponse = response;
        } else {
          newResponse.originalElement = angular.copy(response);
        }
        return newResponse;
      });
    }
  ]);
