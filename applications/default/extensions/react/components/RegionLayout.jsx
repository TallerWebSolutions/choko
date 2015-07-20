var React = require('react');
var lodash = require('lodash');

var connectStoresToLocalState = require('../mixins/connectStoresToLocalState.js');
// var RefluxMixin = require("../mixins/Reflux.js");

var Panel = require('./Panel.jsx');

var RegionLayoutComponent = React.createClass({
  mixins: [connectStoresToLocalState(['Panels'])],
  getDefaultProps: function () {
    return {
      "regionName": ''
    };
  },
  render: function () {
    var regionName = this.props.regionName;
    var regionExist = this.state.panels.hasOwnProperty(this.props.regionName);

    return (
      <div className="Region">
        <p className="region-name">
          { regionName }
        </p>

        {regionExist &&
          lodash.map(this.state.panels[regionName], panel =>
            <Panel key={panel.name} panel={panel} />
          )
        }
        
      </div>
    );
  }
});
module.exports = RegionLayoutComponent;