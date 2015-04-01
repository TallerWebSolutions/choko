var React = require("react/addons");

var ChokoComponentsMixin = require("./ChokoComponents.js");

var ChokoComponentsContextMixin = {
  "propTypes": {
    "chokoComponents": React.PropTypes.object.isRequired,
  },

  "childContextTypes": RefluxMixin.contextTypes,

  "getChildContext": function () {
    return {
      "chokoComponents": this.props.chokoComponents,
    }
  },
};

module.exports = ChokoComponentsContextMixin;