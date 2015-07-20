var React = require('react');
var Router = require('react-router');
var {RouteHandler} = Router;

var connectStoresToLocalState = require('../mixins/connectStoresToLocalState.js');

var HtmlBodyComponent = React.createClass({
  mixins: [connectStoresToLocalState(['Page', 'Application'])],
  getDefaultProps: function() {
    return {
      script: {},
    };
  },
  render: function () {

    this.props.script.src = this.state.application.settings.bundleUrl;

    // Use Webpack's bundles for dev, but inline for production
    if (this.props.script.hasOwnProperty("src")) {
      var scriptTag = <script src={ this.props.script.src }></script>
    }
    else {
      var scriptTag = <script dangerouslySetInnerHTML={ this.props.script }/>
    }
    
    return (
      <div>
        <RouteHandler {...this.props} />

        {/* @TODO: Dehydrated data must be equal to the response from the rest. */}
        <script dangerouslySetInnerHTML={{
          __html: `window.__chokoState = ${ JSON.stringify( this.context.chokoReflux.dehydrate() ) };`
        }}/>

        { scriptTag }
      </div>
    );
  }
});
module.exports = HtmlBodyComponent;