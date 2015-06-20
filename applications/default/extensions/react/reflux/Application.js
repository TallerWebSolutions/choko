var lodash = require("lodash");

var Application = {

  actions: [
    'getSettings',
  ],

  store: {
    init: function () {
      this.state = {};
    },

    onGetSettings: function () {
      this.state = {};
      this.trigger(this.state);
    }
  }
};

module.exports = Application;