'use strict';


/**
 * @file Choko core controllers.
 */

angular.module('choko')

.controller('ApplicationController', ['$rootScope', '$location', '$http', 'applicationState',
  function($rootScope, $location, $http, applicationState) {
    $rootScope.state = {};

    $rootScope.changeState = function() {
      var path = (!$location.path() || $location.path() == '/') ? '/home' : $location.path();

      $http.get(path)
        .success(function(data, status, headers, config) {
          if (data.data.redirect) {
            // Server returned a redirect.
            if (data.data.url) {
              return window.location.href = data.data.redirect;
            } else {
              return $location.path(data.data.redirect);
            };
          }

          // Rebuild the layout only when context changes.
          if ($rootScope.contexts instanceof Array && $rootScope.contexts.toString() == data.data.contexts.toString()) {
            // Update only panels in content region, and page information.
            // @todo: get the region the page-content panel is attached to
            // dinamically currently this is hadcoded to 'content' and will not work
            // if the page-content panel is attacehd to a different region.
            $rootScope.panels['content'] = data.data.panels['content'];
            $rootScope.page = data.data.page;
          } else {
            // Merge data from the server.
            angular.extend($rootScope, data.data);

            // Store scope as application state.
            applicationState.set($rootScope);
          }
        })
        .error(function(data, status, headers, config) {
          // Merge data from the server.
          angular.extend($rootScope.page, data.data);

          $rootScope.page.template = '/templates/error.html';

          // Store scope as application state.
          applicationState.set($rootScope);
        });
    }

    $rootScope.$watch(function() {
      return $location.path();
    }, function() {
      $rootScope.changeState();
    });
  }
])

.controller('ItemController', ['$scope',
  function($scope) {

  }
])

.controller('ViewController', ['$scope', '$location', '$http', 'Choko', 'Restangular', 'Params',
  function($scope, $location, $http, Choko, Restangular, Params) {

    // Prevente creation of service if no itemType set.
    if ($scope.view.itemType) {
      // Create a new Service for Itemtype.
      var itemTypeREST = Restangular.service($scope.view.itemType);
    }
    // Parse parameters when needed.
    if (typeof $scope.view.itemKey !== 'undefined') {
      $scope.view.itemKey = Params.parse($scope.view.itemKey, $scope);
    }

    // Parse other params.
    Object.keys($scope.view.params || {}).forEach(function(param) {
      $scope.view.params[param] = Params.parse($scope.view.params[param], $scope);
    });

    // Parse query params.
    Object.keys($scope.view.query || {}).forEach(function(param) {
      $scope.view.query[param] = Params.parse($scope.view.query[param], $scope);
    });

    // Handle 'list' type views.
    if ($scope.view.type === 'list' && $scope.view.itemType) {
      var query = {};

      if ($scope.view.query) {
        angular.extend(query, $scope.view.query);
      }

      // Expose view list promise to scope
      $scope.viewList = itemTypeREST.getList(query);
      $scope.items = {};

      $scope.viewList.then(function(response) {
        $scope.items = response;
        $scope.items.$empty = Object.keys($scope.items).filter(function(key) {
          return key.indexOf('$') != 0;
        }).length ? false : true;
      });

      if (!$scope.view.template && $scope.view.listStyle) {
        $scope.view.template = '/templates/' + $scope.view.listStyle + '.html';
      }

      if (!$scope.view.itemTemplate && $scope.view.itemDisplay) {
        Choko.get({
          type: 'display',
          key: $scope.view.itemDisplay
        }, function(display) {
          $scope.display = display;
          if (display.layout) {
            Choko.get({
              type: 'displayLayout',
              key: display.layout
            }, function(layout) {
              $scope.layout = layout;
              $scope.view.itemTemplate = '/templates/display-layout.html';
            });
          }
        });
      }
    }

    // Handle 'item' type views.
    if ($scope.view.type === 'item' && $scope.view.itemType) {

      $scope.data = {};
      $scope.view.title = '';

      // Expose view item promise to scope
      $scope.viewItem = itemTypeREST.one($scope.view.itemKey).get();

      $scope.viewItem.then(function(response) {
        $scope.data = response;
        $scope.view.title = response.title;
      }, function(response) {
        // Error.
        if ($scope.page) {
          // If it's a page, show error, otherwise fail silently.
          $scope.data = response.data;
          $scope.view.title = response.data.title;
          $scope.view.template = '/templates/error.html';
        }
      });
    }

    // Handle 'form' type views.
    if ($scope.view.type === 'form' && $scope.view.formName) {
      var typeForm = 'post';
      var itemREST = null;

      $scope.data = {};
      $scope.buildForm = function() {
        Choko.get({
          type: 'form',
          key: $scope.view.formName
        }, function(response) {
          $scope.form = response;

          if ($scope.form.mainTypeName) {
            $scope.data.type = $scope.form.shortName;
          }

          // First we look for view (page/panel) redirect, then for form redirect.
          // The submit button will first look for a property of its own and
          // fallback to this.
          $scope.form.redirect = $scope.view.redirect || $scope.form.redirect || null;

          $scope.view.template = $scope.view.template || $scope.form.template;
          $scope.view.template = $scope.view.template || '/templates/form.html';
        });
      };

      if ($scope.view.itemType && $scope.view.itemKey) {

        // Set type form to PUT.
        typeForm = 'put';

        // Load item data for editing.
        itemTypeREST.one($scope.view.itemKey)
          .get()
          .then(function(response) {
            $scope.data = response;
            $scope.buildForm();
          });
      }

      // Verify if the form is the type PUT to build the form
      if (typeForm != 'put') {
        $scope.buildForm();
      }

      $scope.submit = function(url, redirect) {

        // Add params to data if any.
        Object.keys($scope.view.params || {}).forEach(function(param) {
          $scope.data[param] = $scope.data[param] || $scope.view.params[param];
        });

        if (!itemTypeREST) {
          $scope.viewForm = Restangular.oneUrl('url', url).post('', $scope.data);
        } else {
          if (url) {
            $scope.viewForm = Restangular.oneUrl('url', url).post('', $scope.data);
          } else {
            $scope.viewForm = typeForm === 'post' ?
              itemTypeREST.post($scope.data) :
              $scope.data.put();
          }
        }

        $scope.viewForm.then(function(response) {
          $scope.data = response;

          delete $scope.errors;

          if (redirect) {
            $location.path(redirect);
          }
        }, function(response) {
          $scope.errors = response.data.data;
          $scope.status = response.status;
        });
      };
    }
  }
]);
