var Layout = {

  "actions": [
    "getLayout",
  ],

  "store": {
    "init": function () {
      this.state = {};
    },

    onGetLayout: function (url) {
      this.state = {};
      this.trigger(this.state);
    },
  },
  
};

module.exports = Layout;