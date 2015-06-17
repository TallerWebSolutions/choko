var React = require('react');
var lodash = require('lodash');
// var Router = require('react-router');
// var {RouteHandler} = Router;

// var connectStoresToLocalState = require('../mixins/connectStoresToLocalState.js');

var RegionLayout = require('./RegionLayout.jsx');
var ColumnLayout = require('./ColumnLayout.jsx');

var RowLayoutComponent = React.createClass({
  getDefaultProps: function () {
    return {
      "row": {}
    };
  },
  render: function () {
    var row = this.props.row;
    return (
      <div className="RowLayout">

        {row.region &&
          <RegionLayout regionName={row.name} />
        }

        {row.hasOwnProperty('columns') &&
          lodash.map(row.columns, column =>
            <ColumnLayout column={column} />
          )
        }
        
      </div>
    );
  }
});
module.exports = RowLayoutComponent;