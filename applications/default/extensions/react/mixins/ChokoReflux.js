var React = require("react/addons");

var RefluxMixin = {
	"contextTypes": {
    "chokoReflux": React.PropTypes.object.isRequired,
  },

  "getRefluxAction": function (actionName) {
    return this.context.chokoReflux.actions[actionName];
  },

  "getRefluxStore": function (storeName) {
    return this.context.chokoReflux.stores[storeName];
  }
};

module.exports = RefluxMixin;