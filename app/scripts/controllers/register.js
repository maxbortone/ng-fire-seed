'use strict';

/**
 * @ngdoc function
 * @name ngFireQbotApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the ngFireQbotApp
 */
angular.module('ngFireQbotApp')
  .controller('RegisterCtrl', function ($scope, simpleLogin, $state) {
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
