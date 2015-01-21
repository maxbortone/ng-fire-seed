'use strict';

/**
 * @ngdoc function
 * @name ngFireQbotApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ngFireQbotApp
 */
angular.module('ngFireQbotApp')
  .controller('MainCtrl', function ($scope, user) {
    $scope.currentUser = user;
  });
