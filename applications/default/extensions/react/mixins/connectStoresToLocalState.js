var lodash = require("lodash");
var Reflux = require("reflux");

var toCamelCase = require("to-camel-case");

var RefluxMixin = require("../mixins/Reflux.js");

var connectStoresToLocalState = function (listenableNames) {
  /*  connectStoresToLocalState can be called in three ways:
   *
   *  - connectStoresToLocalState(StoreName, componentStateKeyName),
   *
   *  - connectStoresToLocalState([StoreName1, StoreName2]): componentStateKeyName will 
   *    be the lower-camel-case version of StoreName.  If you pass in a single string,
   *    it will be treated as an Array of one item (the string).
   *
   *  - connectStoresToLocalState(
   *      {
   *        "StoreName1":   "componentStateKeyName1",
   *        "StoreName2":   "componentStateKeyName2",
   *      }
   *    )
   */

  console.assert(arguments.length > 0, "connectStoresToLocalState needs to know which stores to connect.");

  if (arguments.length == 2) {
    listenableNames = lodash([arguments]).zipObject().__wrapped__;

  } else if (listenableNames.constructor === String) {
    listenableNames = [listenableNames];
  }

  if (Array.isArray(listenableNames)) {
    listenableNames = lodash(listenableNames).map(
      storeName => [storeName, toCamelCase(storeName)]
    ).zipObject().__wrapped__;
  }

  // Heavily inspired by Reflux.connect: https://github.com/spoike/refluxjs/blob/master/src/connect.js
  return Object.assign(
    {
      "getInitialState": function () {
        return lodash(listenableNames).map(
          (componentStateKeyName, storeName) => {
            return [componentStateKeyName, this.getRefluxStore(storeName).state]
          }
        ).zipObject().__wrapped__;
      },

      "componentDidMount": function () {
        lodash(listenableNames).each(
          (componentStateKeyName, storeName) => {
            this.listenTo(
              this.getRefluxStore(storeName),

              (value) =>  {
                var state = {};
                state[componentStateKeyName] = value;

                this.setState(state);
              }
            )
          }
        );
      },

      "componentWillUnmount": Reflux.ListenerMixin.componentWillUnmount
    },

    RefluxMixin,
    Reflux.ListenerMethods
  );
};

module.exports = connectStoresToLocalState;