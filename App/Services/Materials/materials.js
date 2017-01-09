(function() {
	angular.module('App.Services.Materials', [])
		.factory('Materials', materials);

  	function /*@ngInject*/ materials($firebaseArray) {
      var ref = firebase.database().ref().child('materials');
      return $firebaseArray(ref);
  	}

})();
