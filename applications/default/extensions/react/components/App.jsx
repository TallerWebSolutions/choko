var React = require('react');
var Router = require('react-router');
var {RouteHandler} = Router;

var ChokoRefluxContextMixin = require('../mixins/ChokoRefluxContext.js');
// var ChokoComponentContextMixin = require('../mixins/ChokoComponentsContext.js');
var ChokoSettingsContextMixin = require('../mixins/ChokoSettingsContext.js');

var AppComponent = React.createClass({
	mixins: [
		ChokoRefluxContextMixin,
    // ChokoComponentContextMixin,
		ChokoSettingsContextMixin
	],
  getInitialState: function() {
    return {};
  },
  getDefaultProps: function() {
    return {
      script: {
        src: ''
      }
    };
  },
  render: function () {

    this.props.script.src = this.props.settings.bundlesPublicPath;

    return (
      <RouteHandler {...this.props} />
    );
  }
});
module.exports = AppComponent;