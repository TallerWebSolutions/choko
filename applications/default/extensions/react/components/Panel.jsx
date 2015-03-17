var React = require('react');

var PanelComponent = React.createClass({
  getDefaultProps: function() {
    return {
    	"panel": {}
    };
  },
  render: function () {

  	var panel = this.props.panel;

    return (
      <div className="Panel">
      	<h3>{ panel.title }</h3>

      	{panel.content && 
      		<div
      			className="Panel--content"
      			dangerouslySetInnerHTML={{__html: panel.content}}
      		/>
      	}
      </div>
    );
  }
});
module.exports = PanelComponent;

