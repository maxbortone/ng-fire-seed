'use strict';
/**
 * @ngdoc function
 * @name ngFireQbotApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Manages authentication to any active providers.
 */
angular.module('ngFireQbotApp')
  .controller('LoginCtrl', function ($scope, simpleLogin, $state) {
    $scope.oauthLogin = function(provider) {
      $scope.err = null;
      simpleLogin.oauthLogin(provider).then(success, failed);
    };

    $scope.passwordLogin = function(email, pass) {
      $scope.err = null;
      simpleLogin.passwordLogin(email, pass).then(success, failed);
    };

    function success() {
      $state.go('account');
    }

    function failed(err) {
      $scope.err = err;
    }

  });
