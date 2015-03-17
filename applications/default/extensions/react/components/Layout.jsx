var React = require('react');
var lodash = require('lodash');
// var Router = require('react-router');
// var {RouteHandler} = Router;

var connectStoresToLocalState = require('../mixins/connectStoresToLocalState.js');

var RowLayout = require('./RowLayout.jsx');

var LayoutComponent = React.createClass({
  mixins: [connectStoresToLocalState(['Layout', 'Panels'])],
  getInitialState: function() {
    return {};
  },
  render: function () {
    return (
      <div className="Layout">
        {lodash.map(this.state.layout.rows, row =>
          <RowLayout row={row} />
        )}
      </div>
    );
  }
});
module.exports = LayoutComponent;