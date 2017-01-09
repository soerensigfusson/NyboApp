(function() {
    angular.module('App')
        .controller('OrderTimeregController', orderController);

    var timelist = [];

    for (let i = 0; i < 48; i++) {
        let minutes = ((i % 2) * 30).toString().padStart(2, '0');
        let hour = Math.floor(i / 2).toString().padStart(2, '0');
        timelist.push({
            title: hour + ':' + minutes,
            minutes: i * 30
        });
    }

    function /*@ngInject*/ orderController($q, $scope, $state, $http, $stateParams, Orders, Auth, Users, Timeregistrations) {
        $scope.timelist = timelist;
        $scope.users = Users;

        let currentUser = Auth.$getAuth();

        $scope.orderid = $stateParams.id;

        $scope.timeregistrations = Timeregistrations;

        Timeregistrations.$loaded()
            .then(function(x) {

            });

        $scope.date = new Date();

        $scope.newtimereg = {
            date: $scope.date.toString(),
            time: 60,
            description: '',
            user: currentUser.uid,
            order: $scope.orderid
        };


        $scope.$watch('date', function() {
            if ($scope.date) {
                $scope.newtimereg.date = $scope.date.toISOString();
            }
        });


        $scope.addTimereg = function() {
            if ($scope.newtimereg.time <= 0) {
                return;
            }

            Timeregistrations.$add($scope.newtimereg)
                .then(function() {
                    $scope.newtimereg = {
                        date: $scope.date.toISOString(),
                        time: 60,
                        description: '',
                        user: currentUser.uid,
                        order: $scope.orderid
                    };
                })
        };

        $scope.deleteTimereg = function(timereg) {
          Timeregistrations.$remove(timereg);
        };

    }

})();
