'use strict';
/**
 * @ngdoc function
 * @name ngFireSeedApp.controller:ChatCtrl
 * @description
 * # ChatCtrl
 * A demo of using AngularFire to manage a synchronized list.
 */
angular.module('ngFireSeedApp')
  .controller('ChatCtrl', function ($scope, $rootScope, utils, profile, Chat) {
    $scope.profile = profile;
    $scope.uid = $rootScope.currentUser.uid;

    // synchronize a read-only, synchronized array of messages, limit to most recent 10
    Chat.getMessages().then(function(data) {
      $scope.messages = data;
    });

    // provide a method to add a message
    $scope.addMessage = function (msg, name, uid) {
      if (msg) {
        Chat.addMessage(msg, name, uid).catch(function (error) {
          utils.toast(error, 'danger');
        });
      } else {
        utils.toast('Will not send an empty message just for you!', 'warning');
      }
    };

    // provide a method to delete a message
    $scope.deleteMessage = function (index, uid, mid) {
      Chat.deleteMessage(index, uid, mid).catch(function (error) {
        utils.toast(error, 'danger');
      });
    };
  });
