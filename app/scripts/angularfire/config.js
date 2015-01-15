angular.module('firebase.config', [])
  .constant('FBURL', 'https://crackling-inferno-301.firebaseio.com')
  .constant('SIMPLE_LOGIN_PROVIDERS', ['password','facebook','google'])
  .constant('loginRedirectPath', 'login')
  .constant('homeRedirectPath', 'main');
