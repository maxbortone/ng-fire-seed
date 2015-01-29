'use strict';
/**
 * @ngdoc function
 * @name muck2App.controller:AccountCtrl
 * @description
 * # AccountCtrl
 * Provides rudimentary account management functions.
 */
angular.module('ngFireSeedApp')
  .controller('AccountCtrl', function ($scope, $rootScope, $state, $q, user, simpleLogin, fbutil, $timeout) {
    $scope.user = user;
    $scope.messages = [];
    var profile;
    loadProfile(user);

    $scope.logout = simpleLogin.logout;

    $scope.changePassword = function(oldPass, newPass, confirm) {
      $scope.err = null;
      if( !oldPass || !newPass ) {
        error('Please enter all fields');
      }
      else if( newPass !== confirm ) {
        error('Passwords do not match');
      }
      else {
        simpleLogin.changePassword(profile.email, oldPass, newPass)
          .then(function() {
            success('Password changed');
          }, error);
      }
    };

    $scope.changeEmail = function(pass, newEmail) {
      $scope.err = null;
      simpleLogin.changeEmail(pass, profile.email, newEmail)
        .then(function() {
          profile.email = newEmail;
          profile.$save();
          success('Email changed');
        })
        .catch(error);
    };

    $scope.deleteAccount = function(pass) {
      if (confirm('Are you sure?')) { // jshint ignore:line
        var uid = user.uid;
        simpleLogin.removeUser(profile.email, pass)
          .then(function() {
            removeProfile(uid);
          }, function(err) {
            error(err);
          });
      }
    };

    function error(err) {
      message(err, 'danger');
    }

    function success(msg) {
      message(msg, 'success');
    }

    function message(msg, type) {
      var obj = {text: msg+'', type: type};
      $scope.messages.unshift(obj);
      $timeout(function() {
        $scope.messages.splice($scope.messages.indexOf(obj), 1);
      }, 10000);
    }

    function loadProfile(user) {
      if( profile ) {
        profile.$destroy();
      }
      profile = fbutil.syncObject('users/'+user.uid + '/profile');
      profile.$bindTo($scope, 'profile');
    }

    function removeProfile(uid) {
      var d = $q.defer();
      var profileRef = fbutil.ref('users/' + uid + '/profile');
      profileRef.remove(function(err) {
        if (err) {
          d.reject(err);
        } else {
          d.resolve();
        }
      });
      return d.promise;
    }

  });
