var React = require('react');
// var Router = require('react-router');
// var {RouteHandler} = Router;

var PageComponent = React.createClass({
  getInitialState: function() {
    return {};
  },
  render: function () {
    return (
      <section className="NotFoundPage">
        <h2>This page was not found.</h2>
        <div className="content" dangerouslySetInnerHTML={{__html: this.props.storeStateByName.page.content}}/>
      </secion>
    );
  }
});
module.exports = PageComponent;