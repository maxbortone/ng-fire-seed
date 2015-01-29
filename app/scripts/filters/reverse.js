'use strict';

angular.module('ngFireSeedApp')
  .filter('reverse', function() {
    return function(items) {
      return angular.isArray(items) ? items.slice().reverse() : [];
    };
  });
