var lodash = require('lodash');
var Reflux = require('isomorphic-reflux');
var React = require('react');
var ReactRouter = require('react-router');
var {Route, DefaultRoute, NotFoundRoute, RouteHandler} = ReactRouter;
var refluxDefinitions = require('./reflux/definitions.js');
var path = require('path');
// var DocumentTitle = require('react-document-title');

// Basic components.
var AppComponent = require('./components/App.jsx');
var HtmlBodyComponent = require('./components/HtmlBody.jsx');
var PageComponent = require('./components/Page.jsx');

var initialRenderComplete = false;

var ReactAppClient = function () {

  var container = document.getElementById('ChokoApp');

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

  var Router = ReactRouter.create({
    routes: reactRoutes,
    location: ReactRouter.HistoryLocation
    // transitionContext: {
    //   services: services
    // }
  });

  // @TODO: Load css with react.
  // var styleSheets = refluxApp.stores['Theme'].state.styles;
  // require('../../public' + styleSheets[0]);

  Router.run(function (Handler, state) {

    React.render(<Handler reflux={refluxApp} />, container);
  });

  return initialRenderComplete = true;
};

if (!ReactAppClient()) {
  window.addEventListener(
    "DOMContentLoaded",
    ReactAppClient
  );
}