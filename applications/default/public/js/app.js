/**
 * @file Main AngularJS module for the choko application.
 */

'use strict';

// Define core choko dependencies.
var dependencies = [
  'ngRoute',
  'ngResource',
  'ngSanitize',
  'summernote',
  'restangular',
  'angularFileUpload'
];

// Declare main choko module.
angular.module('choko', dependencies)

  // Location/routing configuration.
  .config(['$locationProvider', function($locationProvider) {
    //$locationProvider.html5Mode(true);
  }])
  .config(['RestangularProvider', function(RestangularProvider) {
    RestangularProvider.setBaseUrl('/rest');

    // @todo: We need improve the caching functionality.
    // The items list not change after add an ítem, because
    // he get the items list from the caché.
    RestangularProvider.setDefaultHttpFields({cache: false});

    // Add a response intereceptor
    RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
      var extractedData;

      if (operation === 'getList') {
        var temp = [];

        Object.keys(data.data).forEach(function(name){
          temp.push(data.data[name]);
        });
        extractedData = temp;
      }
      else {
        extractedData = data.data;
      }
      return extractedData;
    });

    RestangularProvider.setResponseExtractor(function(response) {
      var newResponse = response;

      if (angular.isArray(response)) {
        angular.forEach(newResponse, function(value, key) {
          newResponse[key].originalElement = angular.copy(value);
        });
      }
      else {
        newResponse.originalElement = angular.copy(response);
      }
      return newResponse;
    });
  }]);
