var React = require('react');
var lodash = require('lodash');
// var Router = require('react-router');
// var {RouteHandler} = Router;

// var connectStoresToLocalState = require('../mixins/connectStoresToLocalState.js');

var RegionLayout = require('./RegionLayout.jsx');
var RowLayout = require('./RowLayout.jsx');

var ColumnLayoutComponent = React.createClass({
  getDefaultProps: function () {
    return {
      "column": []
    };
  },
  render: function () {
    var column = this.props.column;
    return (
      <div className="ColumnLayout">
        {column.region &&
          <RegionLayout regionName={column.name} />
        }

        {column.hasOwnProperty('rows') &&
          lodash.map(column.rows, row =>
            <RowLayout row={row} />
          )
        }
        
      </div>
    );
  }
});
module.exports = ColumnLayoutComponent;