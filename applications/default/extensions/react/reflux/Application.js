var lodash = require("lodash");

var Application = {

  actions: [
    '',
  ],

  store: {
    init: function () {
      this.state = {};
    },

    onTransitionToPage: function (url) {
      this.articleID = articleID;

      if (!lodash(this.state.uuid).isEmpty() && this.state.uuid != articleID) {
        this.state = {};
      }

      
      this.trigger(this.state);
    },
  },
  
};

module.exports = Application;