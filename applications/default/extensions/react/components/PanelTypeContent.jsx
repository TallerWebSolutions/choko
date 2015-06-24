var React = require('react');

var PanelTypeContentComponent = React.createClass({
  getDefaultProps: function() {
    return {
      "content": ''
    };
  },
  render: function () {
    var content = this.props.content;

    return (
      <div dangerouslySetInnerHTML={{__html: content}} />
    );
  }
});
module.exports = PanelTypeContentComponent;

