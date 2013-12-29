/*
 * The User extension.
 */

var crypto = require('crypto');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var async = require('async');
var utils = require('prana').utils;

var user = module.exports;

/**
 * The init() hook.
 */
user.init = function(application, callback) {
  // Initialize passport.
  application.application.use(passport.initialize());
  application.application.use(passport.session());

  // Set up passport local strategy.
  passport.use(new LocalStrategy(
    function(username, password, callback) {
      var User = application.type('user');
      User.login({username: username, password: password}, function (error, user) {
        if (error) {
          return callback(error);
        }
        if (!user) {
          // User and/or password is invalid.
          return callback(null, false);
        }

        // Start from an empty container and merge in user data.
        var cleanedUpUser = {
          roles: []
        };
        utils.extend(cleanedUpUser, user);

        // Remove sensitive data from response.
        delete cleanedUpUser.salt;
        delete cleanedUpUser.password;

        // Add authenticated role.
        cleanedUpUser.roles.push('authenticated');

        return callback(null, cleanedUpUser);
      });
    }
  ));

  passport.serializeUser(function(user, callback) {
    callback(null, user);
  });

  passport.deserializeUser(function(user, callback) {
    callback(null, user);
  });


  // Add access check method to application object.
  var self = this;
  application.access = function(request, permission, callback) {
    self.access(request, permission, callback);
  };

  // Call init() callback.
  callback();
};

/**
 * The permission() hook.
 */
user.permission = function(permissions, callback) {
  var newPermissions = {};

  newPermissions['manage-users'] = {
    title: 'Manage users',
    description: 'List, create and edit users and manage permissions.'
  };

  callback(null, newPermissions);
};

/**
 * The type() hook.
 */
user.type = function(types, callback) {
  var application = this.application;
  var newTypes = {};

  newTypes['user'] = {
    title: 'User',
    description: 'Application users.',
    storage: 'database',
    keyProperty: 'username',
    fields: {
      username: {
        title: 'Username',
        type: 'text',
        required: true
      },
      email: {
        title: 'Email',
        type: 'email',
        required: true
      },
      password: {
        title: 'Password',
        type: 'password',
        required: true
      },
      salt: {
        title: 'Salt',
        type: 'text',
        internal: true
      },
      roles: {
        title: 'Roles',
        type: ['role']
      },
      active: {
        title: 'Active',
        type: 'boolean'
      }
    },
    access: {
      'list': 'manage-users',
      'load': 'manage-users',
      'add': 'manage-users',
      'edit': 'manage-users',
      'delete': 'manage-users'
    },
    methods: {
      logout: function() {

      }
    },
    statics: {
      login: function(data, callback) {
        var User = this;
        this.load(data.username, function(error, user) {
          if (error) {
            return callback(error);
          }
          if (user) {
            User.hash(data.password, new Buffer(user.salt, 'base64'), function(error, password) {
              if (error) {
                return callback(error);
              }

              if (user.password == password.toString('base64')) {
                // Password matches.
                callback(null, user);
              }
              else {
                // Wrong password.
                callback(null, false);
              }
            });
          }
          else {
            // User not found.
            callback(null, false);
          }
        });
      },
      hash: function(password, salt, callback) {
        // Generate a 512 bits hash with PBKDF2 algorithm.
        crypto.pbkdf2(password, salt, 10000, 512, function(error, key) {
          if (error) {
            return callback(error);
          }

          callback(null, key);
        });
      },
      salt: function() {
        // Generate a 256 bits random binary salt.
        return crypto.randomBytes(256);
      }
    }
  };

  newTypes['role'] = {
    title: 'Role',
    description: 'User roles.',
    fields: {
      name: {
        title: 'Name',
        type: 'text',
        required: true
      },
      title: {
        title: 'Title',
        type: 'text',
        required: true
      },
      description: {
        title: 'Description',
        type: 'text'
      }
    },
    access: {
      'list': 'manage-users',
      'load': 'manage-users',
      'add': 'manage-users',
      'edit': 'manage-users',
      'delete': 'manage-users'
    }
  };

  newTypes['permission'] = {
    title: 'Permission',
    description: 'Permission.',
    fields: {
      name: {
        title: 'Name',
        type: 'text'
      },
      title: {
        title: 'Title',
        type: 'text'
      },
      description: {
        title: 'Description',
        type: 'text'
      }
    },
    access: {
      'list': 'manage-users',
      'load': 'manage-users',
      'add': false,
      'edit': false,
      'delete': false
    }
  };

  callback(null, newTypes);
};

/**
 * The preSave() hook.
 */
user.preSave = function(type, data, callback) {
  if (type.name != 'user') {
    // Return early on types that are not the user type.
    return callback(null, data);
  }

  var User = this.application.type('user');

  // Generate a salt and hash the password.
  var salt = User.salt();
  User.hash(data.password, salt, function(error, password) {
    if (error) {
      return callback(error);
    }

    // Replace password with hashed one.
    data.password = password.toString('base64');

    // Encode and add salt to payload.
    data.salt = salt.toString('base64');

    // Remove password confirmation.
    delete data['password-confirm'];

    callback(null, data);
  });
};

/**
 * The page() hook.
 */
user.page = function(pages, callback) {
  var newPages = {};

  newPages['user'] = {
    path: '/user/:name',
    title: 'User page',
    access: 'manage users',
    content: '<p class="lead">User page content.</p>'
  };

  newPages['sign-in'] = {
    path: '/sign-in',
    title: 'Sign in',
    description: 'Sign in to continue.',
    access: 'sign in',
    type: 'form',
    formName: 'sign-in',
    class: ['col-md-4', 'col-md-offset-4', 'well']
  };

  newPages['create-account'] = {
    path: '/create-account',
    title: 'Create an account',
    description: 'Create your account.',
    access: 'create account',
    type: 'form',
    formName: 'create-account',
    class: ['col-md-6', 'col-md-offset-3', 'well']
  };

  callback(null, newPages);
};

/**
 * The route() hook.
 */
user.route = function(routes, callback) {
  var newRoutes = {};
  var application = this.application;

  // We create routes to form submits until we figure out what approach to use
  // for handling form submits.
  newRoutes['/create-account-submit'] = {
    //access: 'create account',
    access: true,
    callback: function(request, response, callback) {
      var data = request.body;

      var User = application.type('user');

      User.load(data.username, function(error, user) {
        if (error) {
          return callback(error);
        }
        if (user) {
          return callback(null, ['This username is not available, please choose another one.'], 409);
        }
        if (data.password != data['password-confirm']) {
          return callback(null, ['Passwords must match.'], 400);
        }

        // Create new user resource and save it.
        var user = new User(data);
        user.validateAndSave(function(error, user, errors) {
          if (error) {
            return callback(error);
          }

          if (errors && errors.length > 0) {
            // Validation errors.
            return callback(null, errors, 400);
          }

          callback(null, user, 201);
        });

      });

    }
  };

  newRoutes['/sign-in-submit'] = {
    access: true,
    callback: function(request, response, callback) {
      // Check if there are both an username and a password.
      // @todo in the long run we may need a way to validate forms that aren't
      // directly related to a type.
      if (!request.body.username || !request.body.password) {
        return callback(null, ['Please provide an username and a password.'], 400);
      }
      passport.authenticate('local', function(error, user) {
        if (error) {
          return callback(error);
        }

        if (!user) {
          return callback(null, ['Invalid username or password.'], 401);
        }

        // Log user in.
        request.login(user, function(error) {
          if (error) {
            return callback(error);
          }
          callback(null, user);
        });

      })(request, response, callback);
    }
  };

  newRoutes['/sign-out'] = {
    access: true,
    callback: function(request, response, callback) {
      // Log user out.
      request.logout();
      callback(null, true);
    }
  };

  callback(null, newRoutes);
};

/**
 * The role() hook.
 */
user.role = function(routes, callback) {
  var newRoles = {};

  // The 'anonymous' role is a magic role that's set to every user that's not
  // logged in.
  newRoles['anonymous'] = {
    title: 'Anonymous',
    description: 'Anonymous, unauthenticated user.'
  };

  // The 'authenticated' role is a magic role that's set to every authenticated
  // user.
  newRoles['authenticated'] = {
    title: 'Authenticated',
    description: 'Authenticated, signed in user.'
  };

  // The 'administrator' role is a magic default role that's used to grant
  // administration powers to users.
  newRoles['administrator'] = {
    title: 'Administrators, or super users.'
  };

  callback(null, newRoles);
};

/**
 * The panel() hook.
 */
user.panel = function(panels, callback) {
  var newPanels = {};

  newPanels['sign-in'] = {
    title: 'Sign in',
    bare: true,
    template: 'templates/sign-in.html'
  };
  newPanels['sign-out'] = {
    title: 'Sign out',
    bare: true,
    template: 'templates/sign-out.html'
  };

  callback(null, newPanels);
};

/**
 * The condition() hook.
 */
user.condition = function(conditions, callback) {
  var newConditions = {};

  newConditions['anonymous'] = {
    title: 'Anonymous user',
    arguments: {
      operator: {
        title: 'Operator',
        type: 'String'
      },
      value: {
        title: 'Value',
        type: 'String'
      }
    },
    check: function(request, value, callback) {
      callback(!request.user == value);
    }
  };

  callback(null, newConditions);
};

/**
 * Do access check against current user.
 */
user.access = function(request, permission, callback) {
  // Permission can be a bollean to disable certain operations or allow access
  // to all users.
  if (typeof permission === 'boolean') {
    return callback(null, permission);
  }

  // If user is administrator bypass access check.
  if (request.user && request.user.roles.indexOf('administrator') !== -1) {
    return callback(null, true);
  }

  // Create a mock user for anonymous access.
  var user = request.user || {
    username: 'anonymous',
    roles: ['anonymous']
  };

  var application = this.application;
  async.detect(user.roles, function(roleName, next) {
    application.load('role', roleName, function(error, role) {
      role.permissions = role.permissions || [];
      next(!error && role && role.permissions.indexOf(permission) !== -1);
    });
  }, function(result) {
    // @todo Add cache. Sort user roles, glue them together and use as cache id.
    // async.detect() returns roleName or undefined when nothing was detected,
    // so we need to convert it to boolean in some way.
    callback(null, (result === true));
  });
};
