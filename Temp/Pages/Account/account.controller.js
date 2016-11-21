"use strict";

(function () {
    accountController.$inject = ["$scope", "$state", "Auth"];
    angular.module('App').controller('AccountController', accountController);

    function /*@ngInject*/accountController($scope, $state, Auth) {
        $scope.firebaseUser = Auth.$getAuth();

        console.log($scope.firebaseUser);

        $scope.signout = function () {
            Auth.$signOut();
        };
    }
})();
//# sourceMappingURL=account.controller.js.map
