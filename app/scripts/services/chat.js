'use strict';

/**
 * @ngdoc service
 * @name ngFireQbotApp.chat
 * @description
 * # chat
 * Service in the ngFireQbotApp.
 */
angular.module('ngFireSeedApp')
  .service('Chat', function (fbutil, $q) {
    var self = this;
    this.messages = [];

    this.getMessages = function() {
      var list = fbutil.syncArray('messages', {limitToLast: 10}), def = $q.defer();
      list.$loaded().then(function(result) {
        self.messages = result;
        def.resolve(result);
      }, function(reason) {
        def.reject(reason);
      });

      return def.promise;
    };

    this.addMessage = function(newMessage, name, uid) {
      var def = $q.defer(), success = [];
      var sync = fbutil.sync('users/' + uid + '/messages');
      var addToChat = self.messages.$add({text: newMessage, user: name, uid: uid, sent: Firebase.ServerValue.TIMESTAMP});
      var addToUser = sync.$push({text: newMessage, sent: Firebase.ServerValue.TIMESTAMP});

      $q.all([addToChat, addToUser]).then(function(results) {
        var newKey = results[0].key();
        var oldKey = results[1].key();
        var ref = fbutil.ref('users/' + uid + '/messages');

        swapKey(oldKey, newKey, ref);
        angular.forEach(results, function(result) {
          success.push('Message ' + result.key() + ' added to ' + result.parent());
        });
        def.resolve(success);
      }, function(reason) {
        def.reject(reason);
      });

      return def.promise;
    };

    this.deleteMessage = function(index, uid, mid) {
      var def = $q.defer(), success = [];
      var sync = fbutil.sync('users/' + uid + '/messages');
      var removeFromChat = self.messages.$remove(index);
      var removeFromUser = sync.$remove(mid);

      $q.all([removeFromChat, removeFromUser]).then(function(results) {
        angular.forEach(results, function(result) {
          success.push('Message ' + result.key() + ' removed from ' + result.parent());
        });
        def.resolve(success);
      }, function(reason) {
        def.reject(reason);
      });

      return def.promise;
    };

    function swapKey (oldKey, newKey, ref) {
      var msg = {};
      ref.child(oldKey).once('value', function(snap) {
        msg = snap.val();
      });
      ref.child(oldKey).remove();
      ref.child(newKey).set(msg);
    }

  });
