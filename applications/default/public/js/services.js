'use strict';

/**
 * @file Choko core services.
 */

// Append services to main choko module.
angular.module('choko')

  // Choko main REST factory.
  .factory('Choko', ['$resource', function($resource) {
    var url = '/rest/:type/:key';
    var defaultParams = {
      type: '@type',
      key: '@key'
    };
    var actions = {
      'get': {
        method: 'GET',
        transformResponse: function (data) {
          return angular.fromJson(data).data;
        },
        // Server will always return an object containing at least a 'data'
        // property to hold the actual data and a status property.
        isArray: false
      }
    }

    return $resource(url, defaultParams, actions);
  }])

  // Application state wrapper, to be shared across controllers.
  // P.s.: States are actual scope objects.
  .factory('applicationState', function() {
    var state = {};
    return {
      get: function() {
        return state;
      },
      set: function(newState) {
        return state = newState;
      }
    };
  })

  // Parameter Parser service that can be extend by extensions.
  .provider('Params', function () {

    // Parser functions work most like Angular filters: they are injectable
    // functions that return the actual function for parsing. This returned
    // function will be provided with the param for parsing.
    var parsers = {};

    /**
     * Register a new parameter parser.
     */
    this.addParser = function (name, parser) {
      parsers[name] = parser
    };

    // Register the default url param parser.
    this.addParser('url', function () {
      return function (param, $scope) {
        return $scope.page && $scope.page.params && $scope.page.params[param] || null;
      }
    });

    // Register user properties parser.
    this.addParser('user', function () {
      return function (param, $scope) {
        return $scope.user && $scope.user[param] || null;
      }
    });

    // Register item properties parser.
    this.addParser('item', function () {
      return function (param, $scope) {
        return $scope.item && $scope.item[param] || null;
      }
    });

    // Factory.
    this.$get = function ($injector) {

      var injectedParsers = {};

      // Construct parsers.
      Object.keys(parsers).forEach(function (parserName) {
        injectedParsers[parserName] = $injector.invoke(parsers[parserName]);
      });

      return {

        /**
         * Parse a parameter.
         * @todo: this could make use of promises to provide asyncronous parsing.
         */
        parse: function () {

          // Parse arguments to array.
          var args = [].map.call(arguments, function (arg) {
            return arg;
          });

          // Get parsing data.
          var param = args.shift();

          // Params can be written using pipe strings.
          if (typeof param == 'string') {

            var pipes = param.split('|'),
                paramObject = {};

            // Get parameter again.
            param = pipes.shift();

            // If there is a dynamic param but no pipe action, fill with default.
            if (!pipes.length && ~param.indexOf(':')) {
              pipes.push('url');
            }
            // If there is no dynamic param nor pipes, param is already parsed.
            else if (!pipes.length) {
              return param;
            }

            // Clean param name from now on.
            if (~param.indexOf(':')) {
              param = param.replace(':', '');
            }

            // Transform into parameter object.
            pipes.forEach(function (pipe, i) {
              paramObject[pipe] = i == 0 ? param : null;
            });

            // Reset param to be the object.
            param = paramObject;
          }

          // This will hold parsers returns.
          var result = null;

          // Execute parsers in order.
          Object.keys(param).forEach(function (key) {
            if (!result) {
              result = param[key];
            }

            // Handle error.
            if (!injectedParsers[key]) {
              throw new Error('Undefined parameter parser "' + key + '".')
            }

            // Parse the value.
            result = injectedParsers[key].apply(injectedParsers, [result].concat(args));
          });

          return result;
        }
      };
    };
  });
