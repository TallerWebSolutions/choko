
var Contexts = {

  "actions": [
    "getContexts",
  ],

  "store": {
    "init": function () {
      this.state = {};
    },

    onGetContexts: function (url) {
      this.state = {};
      this.trigger(this.state);
    },
  },
  
};

module.exports = Contexts;