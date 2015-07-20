var React = require('react');
var Router = require('react-router');
var {RouteHandler} = Router;

var ChokoRefluxContextMixin = require('../mixins/ChokoRefluxContext.js');
// var ChokoComponentContextMixin = require('../mixins/ChokoComponentsContext.js');

var connectStoresToLocalState = require('../mixins/connectStoresToLocalState.js');

var AppComponent = React.createClass({
	mixins: [
		ChokoRefluxContextMixin,
    // ChokoComponentContextMixin,
	],
  render: function () {
    return (
      <RouteHandler {...this.props} />
    );
  }
});
module.exports = AppComponent;