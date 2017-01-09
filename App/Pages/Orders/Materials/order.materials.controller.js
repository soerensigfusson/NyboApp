(function() {
    angular.module('App')
        .controller('OrderMaterialsController', orderMaterialsController);


    function /*@ngInject*/ orderMaterialsController($q, $scope, $state, $http, $stateParams, Orders, Materials) {
        let materials = []

        $scope.materialSearch = function(query) {
            var results = query ? materials.filter(createFilterFor(query)) : materials;
            return results;
        };

        Materials.$loaded()
        .then(function(){
            materials = Materials.map(obj => obj.$value);
        })

        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);

            return function filterFn(material) {
                return (material.indexOf(lowercaseQuery) === 0);
            };
        }

        $scope.newmaterial = {
            name: '',
            amount: 0
        };

        console.log('test');


        $scope.addMaterial = function() {
            $scope.newmaterial.name = $scope.newmaterial.name || $scope.newmaterial.materialSearchText;
            delete $scope.newmaterial.materialSearchText;

            if (!$scope.newmaterial.name || $scope.newmaterial.amount <= 0) {
                return;
            }

            if (!$scope.order.materials) {
                $scope.order.materials = [];
            }

            if (materials.indexOf($scope.newmaterial.name)===-1) {
                materials.push($scope.newmaterial.name);
                Materials.$add($scope.newmaterial.name);
            }

            $scope.order.materials.push($scope.newmaterial);
            Orders.$save($scope.order).then(function() {
                $scope.newmaterial = {};
            });
        };

        $scope.deleteMaterial = function(index) {
            console.log(index);
            $scope.order.materials.splice(index, 1);
            Orders.$save($scope.order);
        };

    }

})();
