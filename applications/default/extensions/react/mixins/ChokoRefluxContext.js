var React = require("react/addons");

var RefluxMixin = require("./ChokoReflux.js");

var ChokoRefluxContextMixin = {
  "propTypes": {
    "reflux": React.PropTypes.object.isRequired,
  },

  "childContextTypes": RefluxMixin.contextTypes,

  "getChildContext": function () {
    return {
      "chokoReflux": this.props.reflux,
    }
  },
};

module.exports = ChokoRefluxContextMixin;