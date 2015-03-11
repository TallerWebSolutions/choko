var React = require('react');
var Router = require('react-router');
var {Route, DefaultRoute, NotFoundRoute, RouteHandler} = require('react-router');
// var DocumentTitle = require('react-document-title');

var ReactHook = module.exports;

/**
 * Hook response();
 */
ReactHook.response = function (payload, request, response, callback) {
  this.application.pick('route', request.route.path, function(error, route) {

    if (route.router === 'page') {
      if (request.accepts(['json', 'html']) === 'html') {

        var App = React.createClass({
          getInitialState: function() {
            return payload.data;
          },
          render: function () {
            return (
              <html>
              <head>
                <title>{ this.state.title }</title>
              </head>
              <body>
                <RouteHandler/>
              </body>
              </html>
            );
          }
        });

        var HelloMessage = React.createClass({
          render: function() {
            return <h2>Hello world!</h2>;
          }
        });

        var HiMessage = React.createClass({
          render: function() {
            return <h2>Hi there!!</h2>;
          }
        });

        var NotFound = React.createClass({
          render: function () {
            return <h2>Not found</h2>;
          }
        });

        var routes = (
          <Route path="/" handler={App}>
            <DefaultRoute handler={HelloMessage}/>
            
            <Route name="home" path="/home" handler={HelloMessage}/>
            <Route name="new" path="/sign-in" handler={HiMessage}/>
            
            <NotFoundRoute handler={NotFound}/>
          </Route>
        );

        Router.run(routes, request.url, function (Handler, state) {
          // var title  = DocumentTitle.rewind();
          var output = React.renderToString(<Handler />);
          output = "<!DOCTYPE html>" + output;

          response.status(payload.status.code).send(output);
        });
      }
      else {
        response.status(payload.status.code).send(payload);
      }
      
    }
  });
};