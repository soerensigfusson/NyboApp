(function() {
	angular.module('App.Services.Auth', [])
		.factory('Auth', auth);

  	function /*@ngInject*/ auth($firebaseAuth) {
      return $firebaseAuth();
  	}

})();
