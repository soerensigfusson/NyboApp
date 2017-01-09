(function() {
	angular.module('App.Services.Timeregistrations', [])
		.factory('Timeregistrations', orders);

  	function /*@ngInject*/ orders($firebaseArray) {
      var ref = firebase.database().ref().child('timeregs');
      return $firebaseArray(ref);
  	}

})();
