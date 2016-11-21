(function() {
    angular.module('App')
        .controller('AccountController', accountController);

    function /*@ngInject*/ accountController($scope, $state, Auth) {
        $scope.firebaseUser = Auth.$getAuth();

        console.log($scope.firebaseUser);

        $scope.signout = function() {
            Auth.$signOut();
        }
    }

})();
