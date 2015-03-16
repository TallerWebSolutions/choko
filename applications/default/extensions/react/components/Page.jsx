var React = require('react');
// var Router = require('react-router');
// var {RouteHandler} = Router;

var connectStoresToLocalState = require('../mixins/connectStoresToLocalState.js');

var PageComponent = React.createClass({
  mixins: [connectStoresToLocalState(['Page'])],
  getInitialState: function() {
    return {};
  },
  render: function () {
    return (
      <section className="Page">
        <h2>{this.state.page.title}</h2>
        <div className="content" dangerouslySetInnerHTML={{__html: this.state.page.content}}/>
      </section>
    );
  }
});
module.exports = PageComponent;