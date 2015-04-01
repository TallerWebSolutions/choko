var React = require("react/addons");

var ChokoComponentsMixin = {
  "contextTypes": {
    "chokoComponents": React.PropTypes.object.isRequired,
  },

  "requireComponent": function (componentName) {
    // From cache.
    if (componentName in this.context.chokoComponents.classes) {
      return this.context.chokoComponents.classes[componentName];
    }
    // Require from path and load it into the cache.
    else if (componentName in this.context.chokoComponents.paths) {
      // @TODO: Shame on me, this code looks dirty.
      this.context.chokoComponents.classes = this.context.chokoComponents.classes || {};
      this.context.chokoComponents.classes[componentName] = require(this.context.chokoComponents.paths[componentName]);
      return this.context.chokoComponents.classes[componentName];
    }
    else {
      throw new Error("Component doesn't exist.");
    }
  },
};

module.exports = ChokoComponentsMixin;