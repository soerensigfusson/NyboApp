'use strict';

(function () {
    users.$inject = ["$firebaseArray"];
    angular.module('App.Services.Users', []).factory('Users', users);

    function /*@ngInject*/users($firebaseArray) {
        var ref = firebase.database().ref().child('users');
        return $firebaseArray(ref);
    }
})();
//# sourceMappingURL=users.js.map
