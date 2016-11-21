(function() {
	angular.module('App.Services.Orders', [])
		.factory('Orders', orders);

  	function /*@ngInject*/ orders($firebaseArray) {
      var ref = firebase.database().ref().child('orders');
      return $firebaseArray(ref);
  	}

})();
