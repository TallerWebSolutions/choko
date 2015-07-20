var React = require('react');
var lodash = require('lodash');

var connectStoresToLocalState = require('../mixins/connectStoresToLocalState.js');

var RowLayout = require('./RowLayout.jsx');

var LayoutComponent = React.createClass({
  mixins: [connectStoresToLocalState(['Layout', 'Panels'])],
  getInitialState: function() {
    return {};
  },
  render: function () {

    // var RowLayout = this.requireComponent('RowLayout');

    return (
      <div className="Layout">
        {lodash.map(this.state.layout.rows, row =>
          <RowLayout key={row.name} row={row} />
        )}
      </div>
    );
  }
});
module.exports = LayoutComponent;