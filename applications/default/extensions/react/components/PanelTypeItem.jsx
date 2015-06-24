var React = require('react');

var PanelTypeItemComponent = React.createClass({
  getDefaultProps: function() {
    return {
      "item": ''
    };
  },
  render: function () {
    var content = this.props.content;

    return (
      <div dangerouslySetInnerHTML={{__html: content}} />
    );
  }
});
module.exports = PanelTypeItemComponent;

