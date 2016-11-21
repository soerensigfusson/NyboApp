(function() {
    angular.module('App')
        .controller('UserController', userController);

    function /*@ngInject*/ userController($scope, $state, Auth, Users) {
        $scope.currentUser = Auth.$getAuth().uid;

        console.log(Users);

        $scope.users = Users;

        $scope.user = {};

        $scope.addUser = function() {
            $state.go('^.add');
        };

        $scope.createUser = function() {
            $scope.message = null;
            $scope.error = null;

            // Create a new user
            Auth.$createUserWithEmailAndPassword($scope.user.email, $scope.user.password)
              .then(function(firebaseUser) {
                $scope.message = "User created with uid: " + firebaseUser.uid;
                var userObj = {
                    name: $scope.user.name,
                    email: $scope.user.email,
                    uid: firebaseUser.uid
                }

                Users.$add(userObj);
                $scope.user = {};

                firebaseUser.updateProfile({displayName: $scope.user.name});

                $state.go('^.list');

              }).catch(function(error) {
                $scope.error = error;
              });
          };

        $scope.delete = function(user){
          
        };
    }

})();
