var React = require('react');
var Router = require('react-router');
var {RouteHandler} = Router;

var ChokoRefluxContextMixin = require('../mixins/ChokoRefluxContext.js');
var ChokoComponentContextMixin = require('../mixins/ChokoComponentsContext.js');

var AppComponent = React.createClass({
	mixins: [
		ChokoRefluxContextMixin,
		ChokoComponentContextMixin
	],
  getInitialState: function() {
    return {};
  },
  render: function () {
    return (
      <RouteHandler />
    );
  }
});
module.exports = AppComponent;