"use strict";

(function () {
    HomeController.$inject = ["$scope", "$state", "Auth", "$mdSidenav", "Users"];
    angular.module('App').controller('HomeController', HomeController);

    function /*@ngInject*/HomeController($scope, $state, Auth, $mdSidenav, Users) {
        $scope.firebaseUser = Auth.$getAuth();

        Users.$loaded().then(function (x) {
            var user = Users.find(function (user) {
                return user.uid === $scope.firebaseUser.uid;
            });
            $scope.username = user.name;
        });

        $scope.toggleNavigation = function () {
            $mdSidenav('left').toggle();
        };

        $scope.signout = function () {
            Auth.$signOut().then(function () {
                $state.go('login');
            });
        };
    }
})();
//# sourceMappingURL=home.controller.js.map
