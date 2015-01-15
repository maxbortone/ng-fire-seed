'use strict';

angular.module('ngFireQbotApp')

.constant('STATES', {
  'main': {
    url: '/',
    templateUrl: 'views/main.html',
    controller: 'MainCtrl',
    resolve: {
      // forces the page to wait for this promise to resolve before controller is loaded
      // the controller can then inject `user` as a dependency. This could also be done
      // in the controller, but this makes things cleaner (controller doesn't need to worry
      // about auth status or timing of displaying its UI components)
      user: ['simpleLogin', function(simpleLogin) {
        return simpleLogin.getUser();
      }]
    }
  },
  'chat': {
    url: '/chat',
    templateUrl: 'views/chat.html',
    controller: 'ChatCtrl',
    authRequired: true
  },
  'login': {
    url: '/login',
    templateUrl: 'views/login.html',
    controller: 'LoginCtrl'
  },
  'account': {
    url: '/account',
    templateUrl: 'views/account.html',
    controller: 'AccountCtrl',
    // require user to be logged in to view this route
    // the whenAuthenticated method below will resolve the current user
    // before this controller loads and redirect if necessary
    authRequired: true
  }
})

/**
* Adds a special `whenAuthenticated` method onto $routeProvider. This special method,
* when called, invokes the requireUser() service (see simpleLogin.js).
*
* The promise either resolves to the authenticated user object and makes it available to
* dependency injection (see AuthCtrl), or rejects the promise if user is not logged in,
* forcing a redirect to the /login page
*/
.config(['$stateProvider', function($stateProvider) {
  // credits for this idea: https://groups.google.com/forum/#!msg/angular/dPr9BpIZID0/MgWVluo_Tg8J
  // unfortunately, a decorator cannot be use here because they are not applied until after
  // the .config calls resolve, so they can't be used during route configuration, so we have
  // to hack it directly onto the $routeProvider object
  $stateProvider.whenAuthenticated = function(view, state) {
    state.resolve = state.resolve || {};
    state.resolve.user = ['requireUser', function(requireUser) {
      return requireUser();
    }];
    $stateProvider.state(view, state);
  };
}])

// configure views; the authRequired parameter is used for specifying pages
// which should only be available while logged in
.config(['$stateProvider', 'STATES', '$urlRouterProvider', function($stateProvider, STATES, $urlRouterProvider) {
  angular.forEach(STATES, function(state, view) {
    if( state.authRequired ) {
      // adds a {resolve: user: {...}} promise which is rejected if
      // the user is not authenticated or fulfills with the user object
      // on success (the user object is then available to dependency injection)
      $stateProvider.whenAuthenticated(view, state);
    }
    else {
      // all other routes are added normally
      $stateProvider.state(view, state);
    }
  });
  // routes which are not in our map are redirected to /home
  $urlRouterProvider.otherwise('/');
}])

/**
* Apply some route security. Any route's resolve method can reject the promise with
* { authRequired: true } to force a redirect. This method enforces that and also watches
* for changes in auth status which might require us to navigate away from a path
* that we can no longer view.
*/
.run(['$rootScope', '$location', '$state', 'simpleLogin', 'STATES', 'loginRedirectPath', 'homeRedirectPath',
function($rootScope, $location, $state, simpleLogin, STATES, loginRedirectPath, homeRedirectPath) {
  
  // watch for login status changes and redirect if appropriate
  simpleLogin.watch(check, $rootScope);

  // some of our routes may reject resolve promises with the special {authRequired: true} error
  // this redirects to the login page whenever that is encountered
  $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
    if( angular.isObject(error) && error.authRequired ) {
      $state.go(loginRedirectPath);
    }
  });

  function check(user) {
    // used by the changeEmail functionality so the user
    // isn't redirected to the login screen while we switch
    // out the accounts (see changeEmail.js)
    if( $rootScope.authChangeInProgress ) { return; }
    if (!user && $state.current.authRequired) {
      $state.go(homeRedirectPath);
    }
  }
}
]);
