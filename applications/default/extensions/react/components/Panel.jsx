var React = require('react');
var lodash = require('lodash');

var PanelComponent = React.createClass({
  getDefaultProps: function() {
    return {
      "panel": {}
    };
  },

  getPanelType: function () {
    return this.props.panel.type || 'content';
  },

  renderPanelType: function () {
    var panelType = lodash(this.getPanelType()).capitalize();

    return require('./PanelType' + panelType + '.jsx');
  },

  renderPanelItem: function () {
    return require('./PanelTypeContent.jsx');
  },

  render: function () {

    var panel = this.props.panel;
    var panelType = this.getPanelType();

    return (
      <div className={"Panel--" + panelType}>
        <h3>{ panel.title }</h3>

        {
          this.renderPanelType()
        }

      </div>
    );
  }
});
module.exports = PanelComponent;

