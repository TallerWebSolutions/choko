var React = require('react');

var HtmlHeadComponent = React.createClass({
  getInitialState: function() {
    return {};
  },
  getDefaultProps: function () {
    return {
      favIconSrc: 'favicon.ico',
      title: 'Change this title.',
      style: {},
    };
  },
  render: function () {
    // use Webpack's bundles for dev, but inline for production
    if (this.props.style.hasOwnProperty("src")) {
      // Pure css file.
      if (this.props.style.src.indexOf('.css') > 0) {
        var styleTag = <link rel="stylesheet" src={ this.props.style.src }></link>;
      }
      else {
        var styleTag = <script src={ this.props.style.src }></script>;
      }
    }
    else {
      // var styleTag = <script dangerouslySetInnerHTML={{ __html: this.props.style }}/>;
    }
    
    return (
      <head>
        <title>{ this.props.title }</title>

        <link rel="icon" href={ this.props.favIconSrc }/>

        <meta charSet="utf-8" />
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
    );
  }
});
module.exports = HtmlHeadComponent;