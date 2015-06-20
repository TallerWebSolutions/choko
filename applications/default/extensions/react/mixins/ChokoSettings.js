var React = require("react/addons");

var ChokoSettingsMixin = {
	"contextTypes": {
    "chokoSettings": React.PropTypes.object.isRequired,
  },

  "getChokoSettings": function () {
    return this.context.chokoSettings;
  }
};

module.exports = ChokoSettingsMixin;