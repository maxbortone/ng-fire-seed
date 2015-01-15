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
    $scope.createMode = false;
    $scope.oauthLogin = function(provider) {
      $scope.err = null;
      simpleLogin.oauthLogin(provider).then(redirect, showError);
    };

    $scope.passwordLogin = function(email, pass) {
      $scope.err = null;
      simpleLogin.passwordLogin(email, pass).then(redirect, showError);
    };

    $scope.createAccount = function(email, pass, confirm, name) {
      $scope.err = null;
      if( !pass ) {
        $scope.err = 'Please enter a password';
      }
      else if( pass !== confirm ) {
        $scope.err = 'Passwords do not match';
      }
      else {
        simpleLogin.createAccount(email, pass, name)
          .then(redirect, showError);
      }
    };


    function redirect() {
      $state.go('account');
    }

    function showError(err) {
      $scope.err = err;
    }

  });
