'use strict';

angular.module('simpleLogin', ['firebase', 'firebase.utils'])

// a simple wrapper on simpleLogin.getUser() that rejects the promise
// if the user does not exists (i.e. makes user required)
.factory('requireUser', ['simpleLogin', '$q', function(simpleLogin, $q) {
  return function() {
    return simpleLogin.getUser().then(function (user) {
      return user ? user : $q.reject({ authRequired: true });
    });
  };
}])

.factory('simpleLogin', ['$firebaseAuth', 'fbutil', 'createProfile',
function($firebaseAuth, fbutil, createProfile) {
  var auth = $firebaseAuth(fbutil.ref());
  var listeners = [];

  function statusChange(authData) {
    fns.user = authData;
    angular.forEach(listeners, function(fn) {
      fn(fns.user);
    });
  }

  var fns = {
    user: null,

    getUser: function() {
      return auth.$waitForAuth();
    },

    /**
    * @param {string} email
    * @param {string} pass
    * @returns {*}
    */
    oauthLogin: function(provider) {
      return auth.$authWithOAuthPopup(provider, {rememberMe: true});
    },
    passwordLogin: function(email, pass) {
      return auth.$authWithPassword({
        email: email,
        password: pass
      }, {rememberMe: true});
    },

    logout: function() {
      auth.$unauth();
    },

    createAccount: function(email, pass, name) {
      return auth.$createUser({email: email, password: pass})
      .then(function() {
        // authenticate so we have permission to write to Firebase
        return fns.passwordLogin(email, pass, {rememberMe: true});
      })
      .then(function(user) {
        // store user data in Firebase after creating account
        return createProfile(user.uid, email, name).then(function () {
          return user;
        });
      });
    },

    changePassword: function(email, oldpass, newpass) {
      return auth.$changePassword({email: email, oldPassword: oldpass, newPassword: newpass});
    },

    changeEmail: function(pass, oldemail, newemail) {
      return auth.$changeEmail({oldEmail: oldemail, newEmail: newemail, password: pass});
    },

    removeUser: function(email, pass) {
      return auth.$removeUser({email: email, password: pass});
    },

    watch: function(cb, $scope) {
      fns.getUser().then(function(user) {
        cb(user);
      });
      listeners.push(cb);
      var unbind = function() {
        var i = listeners.indexOf(cb);
        if( i > -1 ) { listeners.splice(i, 1); }
      };
      if( $scope ) {
        $scope.$on('$destroy', unbind);
      }
      return unbind;
    }
  };

  auth.$onAuth(function(authData) {
    statusChange(authData);
  });

  return fns;
}])

.factory('createProfile', ['fbutil', '$q', '$timeout', function(fbutil, $q, $timeout) {
  return function(id, email, name) {
    var ref = fbutil.ref('users/' + id + '/profile'), def = $q.defer();
    ref.set({email: email, name: name||firstPartOfEmail(email)}, function(err) {
      $timeout(function() {
        if( err ) {
          def.reject(err);
        }
        else {
          def.resolve(ref);
        }
      });
    });

    function firstPartOfEmail(email) {
      return ucfirst(email.substr(0, email.indexOf('@'))||'');
    }

    function ucfirst (str) {
      // credits: http://kevin.vanzonneveld.net
      str += '';
      var f = str.charAt(0).toUpperCase();
      return f + str.substr(1);
    }

    return def.promise;
  };
}]);
