var React = require("react/addons");

var RefluxMixin = require("./Reflux.js");

var RefluxContextMixin = {
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

module.exports = RefluxContextMixin;