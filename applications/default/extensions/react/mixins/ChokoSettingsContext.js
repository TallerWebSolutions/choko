var React = require("react/addons");

var ChokoSettingsMixin = require("./ChokoSettings.js");

var ChokoSettingsContextMixin = {
  "propTypes": {
    "settings": React.PropTypes.object.isRequired,
  },

  "childContextTypes": ChokoSettingsMixin.contextTypes,

  "getChildContext": function () {
    return {
      "chokoSettings": this.props.settings,
    }
  },
};

module.exports = ChokoSettingsContextMixin;