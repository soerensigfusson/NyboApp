(function() {
    angular.module('App')
        .controller('OrderController', orderController);


    function /*@ngInject*/ orderController($q, $scope, $state, $http, $stateParams, Orders, Users, TempFileStorage) {
        $scope.orders = Orders;
        $scope.addrSearch = {};
        $scope.currentNavItem = 'details';

        const addressParts = ['vejnavne', 'adgangsadresser', 'adresser'];
        let partIndex = 0;

        $scope.selectAddress = function() {
            partIndex = partIndex == addressParts.length - 1 ? 0 : partIndex + 1;

            //console.log(JSON.stringify($scope.addrSearch.selectedItem));
            if ($scope.addrSearch.selectedItem && $scope.addrSearch.selectedItem.adgangsadresse) {
                console.log('save address');
                $scope.order.address = $scope.addrSearch.selectedItem.tekst;
            }
        };

        $scope.querySearch = function(txt) {
            let addressPart = addressParts[partIndex];

            var request = {
                url: 'http://dawa.aws.dk/' + addressPart + '/autocomplete',
                method: 'GET',
                params: {
                    q: txt
                }
            };

            var deferred = $q.defer();
            $http(request).then(function(response) {
                deferred.resolve(response.data);
            });
            return deferred.promise;
        };

        if ($stateParams.id) {
            Orders.$loaded()
                .then(function(x) {
                    $scope.order = Orders.$getRecord($stateParams.id); // record with $id === "foo" or null;

                    $scope.addrSearch.selectedItem = {
                        tekst: $scope.order.address
                    }
                    if ($scope.order.startdate) {
                        $scope.startdate = new Date($scope.order.startdate);
                    }
                    if ($scope.order.enddate) {
                        $scope.enddate = new Date($scope.order.enddate);
                    }
                });

        } else {
            $scope.order = {};
        }

        $scope.$watch('startdate', function() {
            if ($scope.startdate) {
                $scope.order.startdate = $scope.startdate.toISOString();
            }
        })

        $scope.$watch('enddate', function() {
            if ($scope.enddate) {
                $scope.order.enddate = $scope.enddate.toISOString();
            }
        })

        $scope.saveOrder = function() {
            if ($scope.order.files) {
                for (let id in $scope.order.files) {
                    let imageObj = $scope.order.files[id];
                    if (imageObj.status === 'pending') {
                        var ref = TempFileStorage.startUpload(id, $scope.order.$id);
                    }
                }
            }

            if ($scope.order.$id === undefined) {
                Orders.$add($scope.order);
                $state.go('^.list');
            } else {
                Orders.$save($scope.order);
                $state.go('^.order.details', {
                    id: $scope.order.$id
                });
            }
        };

        $scope.deleteOrder = function() {
            Orders.$remove($scope.order);
            $state.go('^.list');
        };


        $scope.onFileUploaded = function(thumbnaildata, file) {
            if (!$scope.order.files) {
                $scope.order.files = {};
            }

            let id = TempFileStorage.addFile(file);

            $scope.order.files[id] = {
                status: 'pending',
                progress: 0,
                name: file.name,
                thumbnail: thumbnaildata
            };
        }

        $scope.addExtraTask = function() {
            $scope.extratask = {
                details: '',
                files: [],
                materials: [],
                time: []
            };
            $state.go('^.addextra');
        }

        $scope.openExtraTask = function() {
            $state.go('home.orders.order.extra');
        }

        $scope.saveExtraTask = function() {
            if (!$scope.order.extratasks) {
                $scope.order.extratasks = [];
            }
            if (!$scope.extratask.id) {
                $scope.extratask.id = Date.now();
            }
            $scope.order.extratasks.push($scope.extratask);
            Orders.$save($scope.order);
        }

    }

})();
