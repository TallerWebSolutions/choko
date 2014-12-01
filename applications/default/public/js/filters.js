'use strict';

/**
 * @file Choko core filters.
 */

angular.module('choko')

  .filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }])

  // Filter to get an array of keys for an object.
  .filter('keys', function() {

    /**
     * Returns the keys of a given acceptable value/object.
     * @param {object|array|function} input
     * @return {array}
     */
    function objectKeysFilter(input) {
      return ~['object', 'function'].indexOf(typeof input) ? Object.keys(input) : [];
    }

    return objectKeysFilter;
  });
