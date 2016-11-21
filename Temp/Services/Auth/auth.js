'use strict';

(function () {
  auth.$inject = ["$firebaseAuth"];
  angular.module('App.Services.Auth', []).factory('Auth', auth);

  function /*@ngInject*/auth($firebaseAuth) {
    return $firebaseAuth();
  }
})();
//# sourceMappingURL=auth.js.map
