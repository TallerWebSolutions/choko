var React = require('react');
// var Router = require('react-router');
// var {RouteHandler} = Router;

var connectStoresToLocalState = require('../mixins/connectStoresToLocalState.js');

var Layout = require('./Layout.jsx');

var PageComponent = React.createClass({
  mixins: [connectStoresToLocalState(['Page'])],
  getInitialState: function() {
    return {};
  },
  render: function () {
    return (
      <section className="Page">
        <Layout />
      </section>
    );
  }
});
module.exports = PageComponent;