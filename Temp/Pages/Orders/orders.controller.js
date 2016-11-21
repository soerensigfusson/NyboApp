"use strict";

(function () {
    ordersController.$inject = ["$scope", "$state", "Orders"];
    angular.module('App').controller('OrdersController', ordersController);

    function /*@ngInject*/ordersController($scope, $state, Orders) {
        $scope.orders = Orders;

        $scope.addOrder = function () {
            $state.go('^.add');
        };

        $scope.openOrder = function (order) {
            $state.go('^.order.details', { id: order.$id });
        };
    }
})();
//# sourceMappingURL=orders.controller.js.map
