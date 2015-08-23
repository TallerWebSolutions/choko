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
        var extractedData,
          convertDateStringsToDates = function (input) {
            var regexIso8601 = /^(\d{4}|\+\d{6})(?:-(\d{2})(?:-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})\.(\d{1,})(Z|([\-+])(\d{2}):(\d{2}))?)?)?)?$/;

            // Ignore things that aren't objects.
            if (typeof input !== "object") return input;

            for (var key in input) {
              if (!input.hasOwnProperty(key)) continue;

              var value = input[key];
              var match;
              // Check for string properties which look like dates.
              if (typeof value === "string" && (match = value.match(regexIso8601))) {
                var milliseconds = Date.parse(match[0])

                if (!isNaN(milliseconds)) {
                  input[key] = new Date(milliseconds);
                }
              } else if (typeof value === "object") {
                // Recurse into object
                convertDateStringsToDates(value);
              }
            }
          };

        // Automatic JSON date parsing.
        convertDateStringsToDates(data);

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
