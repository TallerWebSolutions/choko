var React = require('react');
var Router = require('react-router');
var {RouteHandler} = Router;

var RefluxContextMixin = require('../mixins/RefluxContext.js');

var AppComponent = React.createClass({
	mixins: [RefluxContextMixin],
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