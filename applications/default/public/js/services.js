'use strict';

/* Services */
angular.module('choko.services', [])
  // Single value service for Choko version.
  .value('version', '0.0.1')

  .factory('Choko', function($resource) {
    return $resource('/rest/:type/:key', {
      type: '@type',
      key: '@key'
    },
    {
      'get': {
        method: 'GET',
        transformResponse: function (data) {
          return angular.fromJson(data).data;
        },
        // Data is an Object, not an Array.
        isArray: false
      }
    });
  })

  // Shared server with application state.
  .factory('applicationState', function($rootScope) {
    var state = {};
    return {
      get: function() {
        return state;
      },
      set: function(newState) {
        return state = newState;
      },
    };
  })

  // Parameter Parser service that can be extend by extensions.
  .provider('Params', function () {

    // Parser functions work most like Angular filter: they are injectable
    // functions that return the actual function for parsing. This returned
    // function will be provided with the param for parsing.
    var parsers = {};

    /**
     * Register a new parameter parser.
     */
    this.addParser = function (name, parser) {
      parsers[name] = parser
    };

    // Regiter the default page param parser.
    this.addParser('pageParam', function () {
      return function (param, $scope) {
        return $scope.page && $scope.page.params && $scope.page.params[param] || null;
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
              pipes.push('pageParam');
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

            // Parse the value.
            result = injectedParsers[key].apply(injectedParsers, [result].concat(args));
          });

          return result;
        }
      };
    };
  });
