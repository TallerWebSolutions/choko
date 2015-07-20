var fs = require('fs');
var path = require('path');
var lodash = require('lodash');
var Reflux = require('isomorphic-reflux');
var React = require('react');
var Router = require('react-router');
var {Route, DefaultRoute, NotFoundRoute, RouteHandler} = Router;
// var DocumentTitle = require('react-document-title');

// Basic components.
var AppComponent = require('./components/App.jsx');
var HtmlHeadComponent = require('./components/HtmlHead.jsx');
var HtmlBodyComponent = require('./components/HtmlBody.jsx');
var PageComponent = require('./components/Page.jsx');

module.exports = function (args, callback) {
  var {
    requestUrl,
    dehydratedState,
    pagePaths,
    refluxDefinitions,
    chokoSettings
  } = args;

  var refluxApp = new Reflux(refluxDefinitions);

  // @TODO: Dehydrate stores should be a method of the Relfux App.
  lodash.each(refluxApp.stores, (store, name) => {
    store.state = dehydratedState[name.toLowerCase()];
  });

  var NotFound = React.createClass({
    render: function () {
      return <h2>Not found</h2>;
    }
  });

  var reactRoutes = (
    <Route path="/" handler={AppComponent}>
      <Route handler={HtmlBodyComponent}>
        
        // Create a react route for every implemented page.
        {lodash.map(pagePaths, path => {
          return <Route key={path} path={path} handler={PageComponent} />
        })}

        <NotFoundRoute handler={NotFound}/>
      </Route>
    </Route>
  );

  Router.run(reactRoutes, requestUrl, function (Handler, state) {
    // var title  = DocumentTitle.rewind();

    // @TODO: Extensions could want to override the app.html file.
    // @TODO: Reduce io operations with a cache in memory of the fileString.
    fs.readFile(path.resolve(__dirname, './app.html'), 'utf8', function (error, fileString) {

      if (error) {
        return console.log(error);
      }
      
      var htmlHeadProps = {
        favIconSrc: 'favicon.ico',
        title: 'Change this title.'
        // styles: [{src: chokoSettings.bundlesPublicPath + '/styles.js'}],
      };

      // Render the app's head tag.
      var headRendered = React.renderToString(<HtmlHeadComponent {...htmlHeadProps} />);
      // Render the app, which is the content of body tag.
      var bodyRendered = React.renderToString(<Handler reflux={refluxApp} />);

      // Replace tokens with rendered data.
      var output = fileString
      .replace(/\$\{HEAD_TAGS\}/g, headRendered)
      .replace(/\$\{BODY_TAGS\}/g, bodyRendered);

      callback(output);
    });
  
  });
};