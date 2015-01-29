'use strict';

/**
 * @ngdoc function
 * @name ngFireSeedApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the ngFireSeedApp
 */
angular.module('ngFireSeedApp')
  .controller('HomeCtrl', function ($scope, $rootScope, $upload, utils, profile, Profile, Chat) {
    var uid = $rootScope.currentUser.uid;
    $scope.uid = uid;
    profile.$bindTo($scope, 'profile');

    Profile.getMessages(uid).then(function(data) {
      if (data.length) {
        $scope.messages = data;
      } else {
        var msg = 'You have no messages! Go talk to somebody on the chat.';
        utils.notification(msg, 'warning', $scope);
      }
    });

    $scope.deleteMessage = function (index, uid, mid) {
      Chat.deleteMessage(index, uid, mid).then(function(success) {
        angular.forEach(success, function(msg){
          utils.toast(msg, 'success');
        });
      }, function (error) {
        utils.toast(error, 'danger');
      });
    };

    $scope.fileSelect = function(event) {
      utils.fileSelect(event, uid);
    };

    $scope.upload = utils.upload;

  });
