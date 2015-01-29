'use strict';

/**
 * @ngdoc service
 * @name ngFireSeedApp.utils
 * @description
 * # utils
 * Factory in the ngFireSeedApp.
 */
angular.module('ngFireSeedApp')
  .factory('utils', function ($timeout, $rootScope, $upload, fbutil) {
    // Public API here
    return {

      toast: function(msg, type) {
        var obj = {text: msg+'', type: type};
        $rootScope.toasts.unshift(obj);
        $timeout(function() {
          $rootScope.toasts.splice($rootScope.toasts.indexOf(obj), 1);
        }, 3000);
      },

      notification: function(msg, type, scope) {
        var obj = {text: msg+'', type: type};
        scope.notification = obj;
      },

      fileSelect: function(event, uid) {
        var file = event.target.files[0];
        var imageType = /image.*/;

        if (file.type.match(imageType)) {
          console.log('creating file reader');
          var reader = new FileReader();
          reader.onload = function(e) {
            var dataUrl = reader.result;
            var ref = fbutil.ref('users/' + uid + '/profile/image');

            ref.set(dataUrl, function(error) {
              if (error) {
                console.log(error);
              } else {
                console.log('Image uploaded!');
              }
            });
          };
          reader.readAsDataURL(file);
        }
      },

      upload: function(files, uid) {
        var file = files[0];
        var imageType = /image.*/;

        if (file.type.match(imageType)) {
          console.log('creating file reader');
          var reader = new FileReader();
          reader.onload = function(e) {
            var dataUrl = reader.result;
            var path = 'users/' + uid + '/profile/image';

            // ref.set(dataUrl, function(error) {
            //   if (error) {
            //     console.log(error);
            //   } else {
            //     console.log('Image uploaded!');
            //   }
            // });

            $upload.http({
              url: path,
              method: 'PUT',
              headers: {'Content-Type': file.type},
              data: dataUrl
            }).progress(function(ev) {
              console.log('progress: ' + parseInt(100.0 * ev.loaded / ev.total) + '% file : ev.config.file.name');
            }).success(function(data) {
              console.log('file ' + config.file.name + 'is uploaded successfully. Response: ' + data);
            }).error(function(err) {
              console.log(err);
            });

          };
          reader.readAsDataURL(file);
        }
      }
    };
  });
