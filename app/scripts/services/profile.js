'use strict';

/**
 * @ngdoc service
 * @name ngFireQbotApp.profile
 * @description
 * # profile
 * Service in the ngFireQbotApp.
 */
angular.module('ngFireSeedApp')
  .service('Profile', function (fbutil, $q) {
    var self = this;
    // TODO: should maybe persist data in a cookie
    this.profile = {};

    this.setProfile = function(id) {
      var ref = fbutil.syncObject('users/' + id + '/profile'), def = $q.defer();
      ref.$loaded().then(function(result) {
        self.profile = result;
        def.resolve(self.profile);
      }, function(reason) {
        def.reject(reason);
      });

      return def.promise;
    };

    // TODO: should actually unbind/destroy local obj and listeners
    this.clearProfile = function() {
      self.profile = null;
    };

    this.getProfile = function() {
      return self.profile ? self.profile : null;
    };

    this.getMessages = function(id) {
      var list = fbutil.syncArray('users/' + id + '/messages'), def = $q.defer();
      list.$loaded().then(function(result) {
        def.resolve(result);
      }, function(reason) {
        def.reject(reason);
      });

      return def.promise;
    };

  });
