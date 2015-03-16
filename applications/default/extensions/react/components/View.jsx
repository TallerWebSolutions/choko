var React = require('react');
var Router = require('react-router');
var {RouteHandler} = Router;

var ViewComponent = React.createClass({
  getInitialState: function() {
    return {};
  },
  render: function () {
    return (
      <RouteHandler {...this.props} />
    );
  }
});
module.exports = ViewComponent;