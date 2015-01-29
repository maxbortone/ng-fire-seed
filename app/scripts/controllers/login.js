'use strict';
/**
 * @ngdoc function
 * @name ngFireSeedApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Manages authentication to any active providers.
 */
angular.module('ngFireSeedApp')
  .controller('LoginCtrl', function ($scope, utils, simpleLogin, $state) {
    $scope.oauthLogin = function(provider) {
      simpleLogin.oauthLogin(provider).then(success, failed);
    };

    $scope.passwordLogin = function(email, pass) {
      simpleLogin.passwordLogin(email, pass).then(success, failed);
    };

    function success() {
      utils.toast('You logged in successfully', 'success');
      $state.go('home');
    }

    function failed(err) {
      utils.toast(err, 'danger');
    }

  });
