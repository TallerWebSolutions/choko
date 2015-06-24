var Page = {

  "actions": [
    "getPage",
  ],

  "store": {
    "init": function () {
      this.state = {};
    },

    onGetPage: function (url) {
      this.state = {};
      this.trigger(this.state);
    },
  },
  
};

module.exports = Page;