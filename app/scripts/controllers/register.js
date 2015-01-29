'use strict';

/**
 * @ngdoc function
 * @name ngFireSeedApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the ngFireSeedApp
 */
angular.module('ngFireSeedApp')
  .controller('RegisterCtrl', function ($scope, utils, simpleLogin, $state) {
    $scope.createAccount = function(email, pass, confirm, name) {
      if( !pass ) {
        utils.toast('Please enter a password', 'warning');
      }
      else if( pass !== confirm ) {
        utils.toast('Passwords do not match', 'warning');
      }
      else {
        simpleLogin.createAccount(email, pass, name)
        .then(success, failed);
      }
    };


    function success() {
      utils.toast('You new account has been created successfully', 'success');
      $state.go('account');
    }

    function failed(err) {
      utils.toast(err, 'danger');
    }
  });
