"use strict";

(function () {
    loginController.$inject = ["$scope", "$state", "Auth"];
    angular.module('App').controller('LoginController', loginController);

    function /*@ngInject*/loginController($scope, $state, Auth) {
        console.log(Auth);
        $scope.createUser = function () {
            $scope.message = null;
            $scope.error = null;

            // Create a new user
            Auth.$createUserWithEmailAndPassword($scope.email, $scope.password).then(function (firebaseUser) {
                $scope.message = "User created with uid: " + firebaseUser.uid;
            }).catch(function (error) {
                $scope.error = error;
            });
        };
        $scope.login = function () {
            $scope.message = null;
            $scope.error = null;

            // Create a new user
            Auth.$signInWithEmailAndPassword($scope.email, $scope.password).then(function (firebaseUser) {
                $state.go('home');
            }).catch(function (error) {
                $scope.error = error;
            });
        };
    }
})();
//# sourceMappingURL=login.controller.js.map
