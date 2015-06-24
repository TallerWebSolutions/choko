var lodash = require('lodash');
var Reflux = require('isomorphic-reflux');
var React = require('react');
var Router = require('react-router');
var {Route, DefaultRoute, NotFoundRoute, RouteHandler} = Router;
// var DocumentTitle = require('react-document-title');

// Basic components.
var AppComponent = require('./components/App.jsx');
var HtmlComponent = require('./components/Html.jsx');
var PageComponent = require('./components/Page.jsx');

// @TODO: Move things for server/client specific to the
//        files app.client.js or app.server.js. 
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

  // Create a react route for every implemented page.
  var pageRoutes = lodash.map(pagePaths, path => {
    return <Route path={path} handler={PageComponent} />
  });

  var reactRoutes = (
    <Route path="/" handler={AppComponent}>
      <Route handler={HtmlComponent}>

        { pageRoutes }

        <NotFoundRoute handler={NotFound}/>
      </Route>
    </Route>
  );

  Router.run(reactRoutes, requestUrl, function (Handler, state) {
    // var title  = DocumentTitle.rewind();

    var output = React.renderToString(<Handler reflux={refluxApp} settings={chokoSettings} />);
    output = "<!DOCTYPE html>" + output;

    callback(output);
  });
};