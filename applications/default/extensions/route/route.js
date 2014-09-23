var RouteController = require('./lib/route-controller');

var route = module.exports;

/**
 * The init() hook.
 */
route.init = function(application, callback) {
  var self = this;

  // Load and process all routes.
  this.application.collect('route', function(error, routes) {
    if (error) {
      return callback(error);
    }

    // Process all routes.
    self.processRoutes(routes);
    application.routes = routes;

      // The last middleware is the one that catches 404 errors.
      self.application.application.use(function(req, res, next){
        RouteController.notFound.call(self, req, res);
      });

      callback();
    });

    callback();
  });
};

/**
 * Process an array of routes.
 */
route.processRoutes = function(routes) {
  for (var path in routes) {
    this.processRoute(path, routes[path]);
  }
};

/**
 * Process a single route.
 */
route.processRoute = function(path, route) {
  // Normalize route settings. Routes can be objects, strings or functions.
  if (typeof route === 'object') {
    route.path = path;
  }
  else if (typeof route === 'function') {
    route = {
      path: path,
      callback: routeInfo,
      access: true
    };
  }
  else {
    route = {
      path: path,
      content: routeInfo,
      access: true
    };
  }
  // Create route controller instance.
  route.controller = new RouteController(this.application, route);
};
