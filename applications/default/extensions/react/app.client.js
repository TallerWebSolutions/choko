var lodash = require('lodash');
var Reflux = require('isomorphic-reflux');
var React = require('react');
var ReactRouter = require('react-router');
var {Route, DefaultRoute, NotFoundRoute, RouteHandler} = ReactRouter;
var refluxDefinitions = require('./reflux/definitions.js');
// var DocumentTitle = require('react-document-title');

// Basic components.
var AppComponent = require('./components/App.jsx');
var HtmlComponent = require('./components/Html.jsx');
var PageComponent = require('./components/Page.jsx');

var initialRenderComplete = false;

var ReactApp = function (args, callback) {

  var container = document.querySelector('html');

  if (!container) {
    return initialRenderComplete = false;
  }

  var refluxApp = new Reflux(refluxDefinitions);
  refluxApp.hydrate(__chokoState);

  var NotFound = React.createClass({
    render: function () {
      return <h2>Not found</h2>;
    }
  });

  var pagePaths = refluxApp.stores['Routes'].state;

  // Create a react route for every implemented page.
  var pageRoutes = lodash(pagePaths).map(function (path) {
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

  var Router = ReactRouter.create({
    routes: reactRoutes,
    location: ReactRouter.HistoryLocation
    // transitionContext: {
    //   services: services
    // }
  });

  var chokoSettings = refluxApp.stores['Application'].state.settings;

  Router.run(function (Handler, state) {

    React.render(<Handler reflux={refluxApp} settings={chokoSettings} />, container);
  });

  return initialRenderComplete = true;
};

if (!ReactApp()) {
  window.addEventListener(
    "DOMContentLoaded",
    ReactApp
  );
}