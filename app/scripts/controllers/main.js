'use strict';

/**
 * @ngdoc function
 * @name ngFireSeedApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ngFireSeedApp
 */
angular.module('ngFireSeedApp')
  .controller('MainCtrl', function ($scope, user) {
    $scope.greeting = user ? 'Hello ' + user.uid : 'Hello stranger!';
  });
