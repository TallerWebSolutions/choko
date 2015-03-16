var React = require('react');

var NavBarComponent = React.createClass({
  getInitialState: function() {
    return {};
  },
  render: function () {
    return (
      <header>
      	<h1>This is the NavBar component.</h1>
      </header>
    );
  }
});
module.exports = NavBarComponent;