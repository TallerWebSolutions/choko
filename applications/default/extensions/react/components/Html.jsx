var React = require('react');
var Router = require('react-router');
var {RouteHandler} = Router;

var connectStoresToLocalState = require('../mixins/connectStoresToLocalState.js');

var HtmlComponent = React.createClass({
  mixins: [connectStoresToLocalState(['Page'])],
  getInitialState: function() {
    return {};
  },
  getDefaultProps: function () {
    return {
      favIconSrc: "",
      title: "Change this title.",
      script: {src: ""},
      style: {src: ""},
    };
  },
  render: function () {
    // use Webpack's bundles for dev, but inline for production
    if (this.props.style.hasOwnProperty("src")) {
      var styleTag = <script src={ this.props.style.src }></script>
    }
    else {
      var styleTag = <script dangerouslySetInnerHTML={ this.props.style }/>
    }
    
    if (this.props.script.hasOwnProperty("src")) {
      var scriptTag = <script src={ this.props.script.src }></script>
    }
    else {
      var scriptTag = <script dangerouslySetInnerHTML={ this.props.script }/>
    }
    
    return (
      <html>
      <head>
        <title>{ this.state.page.title }</title>

        <link rel="icon" href={ this.props.favIconSrc }/>

        {/* This is the magic viewport.  Don't touch it!  
          * It opts us in to Chrome's GPU accelerated fast-path:
          * https://www.youtube.com/watch?v=3Bq521dIjCM&feature=youtu.be&t=23m50s 
          */}
        <meta name="viewport" content="
          width=device-width,
          minimum-scale=1.0,
          initial-scale=1.0,
          user-scalable=yes
        "/>
                                
        { styleTag }
      </head>

      <body>
        <RouteHandler {...this.props} />
      </body>

      {/* @TODO: Dehydrated data must be equal to the response from the rest. */}
      <script dangerouslySetInnerHTML={{
        __html: `window.__chokoStoreStateByName = ${ JSON.stringify( this.context.chokoReflux.dehydrate() ) }`
      }}/>

      { scriptTag }
      </html>
    );
  }
});
module.exports = HtmlComponent;