var Routes = {

  "actions": [
    "getRoutes",
  ],

  "store": {
    "init": function () {
      this.state = {};
    },

    onGetRoutes: function (url) {
      this.state = {};
      this.trigger(this.state);
    },
  },
  
};

module.exports = Routes;