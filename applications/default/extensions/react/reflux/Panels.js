var Panels = {

  "actions": [
    "getPanels",
  ],

  "store": {
    "init": function () {
      this.state = {};
    },

    onGetPanels: function (url) {
      this.state = {};
      this.trigger(this.state);
    },
  },
  
};

module.exports = Panels;