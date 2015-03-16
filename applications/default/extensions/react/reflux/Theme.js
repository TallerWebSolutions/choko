var Theme = {

  "actions": [
    "getTheme",
  ],

  "store": {
    "init": function () {
      this.state = {};
    },

    onGetTheme: function (url) {
      this.state = {};
      this.trigger(this.state);
    },
  },
  
};

module.exports = Theme;