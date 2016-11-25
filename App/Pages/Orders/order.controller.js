(function() {
    angular.module('App')
        .controller('OrderController', orderController);

    var timelist = [];

    for (let i = 0; i < 48; i++) {
        let minutes = ((i % 2) * 30).toString().padStart(2, '0');
        let hour = Math.floor(i / 2).toString().padStart(2, '0');
        timelist.push({title: hour + ':' + minutes, minutes: i * 30});
    }

    function /*@ngInject*/ orderController($q, $scope, $state, $http, $stateParams, Orders, Auth, Users, TempFileStorage) {
        $scope.orders = Orders;
        $scope.timelist = timelist;
        $scope.addrSearch = {};
        $scope.currentNavItem = 'details';

        const addressParts = ['vejnavne', 'adgangsadresser', 'adresser'];
        let partIndex = 0;
        let materials = [];
        let currentUser = Auth.$getAuth();

        function getMaterials() {
            $scope.orders.forEach(function(order) {
                order.materials.forEach(function(material) {
                    if (materials.indexOf(material.name) === -1) {
                        materials.push(material.name);
                    }
                });
            });
        }

        $scope.materialSearch = function(query) {
            var results = query ? materials.filter(createFilterFor(query)) : materials;
            return results;
        };

        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);

            return function filterFn(material) {
                return (material.indexOf(lowercaseQuery) === 0);
            };
        }

        $scope.selectAddress = function() {
            partIndex = partIndex == addressParts.length - 1 ? 0 : partIndex + 1;

            if ($scope.addrSearch.selectedItem.adresse) {
                $scope.orders.address = $scope.addrSearch.selectedItem.text;
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
                    getMaterials();
                    $scope.order = Orders.$getRecord($stateParams.id); // record with $id === "foo" or null;

                    if ($scope.order.startdate) {
                        $scope.order.startdate = new Date($scope.order.startdate);
                    }
                    if ($scope.order.enddate) {
                        $scope.order.enddate = new Date($scope.order.enddate);
                    }

                });

        } else {
            $scope.order = {};
        }

        $scope.saveOrder = function() {
            // prepare data
            if ($scope.order.startdate && typeof $scope.order.startdate !== 'string') {
                $scope.order.startdate = $scope.order.startdate.toString();
            }
            if ($scope.order.enddate && typeof $scope.order.enddate !== 'string') {
                $scope.order.enddate = $scope.order.enddate.toString();
            }

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
                $state.go('^.order', {id: $scope.order.$id});
            }
        };

        $scope.deleteOrder = function() {
            Orders.$remove($scope.order);
            $state.go('^.list');
        };

        $scope.newmaterial = {
            name: '',
            amount: 0
        };

        $scope.addMaterial = function() {
            $scope.newmaterial.name = $scope.newmaterial.name || $scope.newmaterial.materialSearchText;
            delete $scope.newmaterial.materialSearchText;

            if (!$scope.newmaterial.name || $scope.newmaterial.amount <= 0) {
                return;
            }

            if (!$scope.order.materials) {
                $scope.order.materials = [];
            }

            $scope.order.materials.push($scope.newmaterial);
            Orders.$save($scope.order).then(function() {
                $scope.newmaterial = {};
            });
        };

        $scope.deleteMaterial = function(index) {
            $scope.order.materials.splice(index, 1);
            Orders.$save($scope.order);
        };

        $scope.newtimereg = {
            date: new Date(),
            time: 60,
            description: ''

        };

        $scope.addTimereg = function() {

            if ($scope.newtimereg.time <= 0) {
                return;
            }

            $scope.newtimereg.user = currentUser.uid;

            if (!$scope.order.timeregistrations) {
                $scope.order.timeregistrations = [];
            }

            if ($scope.newtimereg.date && typeof $scope.newtimereg.date !== 'string') {
                $scope.newtimereg.date = $scope.newtimereg.date.toString();
            }

            $scope.order.timeregistrations.push($scope.newtimereg);
            Orders.$save($scope.order).then(function() {
                $scope.newtimereg = {
                    date: new Date(),
                    time: 0,
                    description: ''
                };
            });
        };

        $scope.deleteTimereg = function(index) {
            $scope.order.timeregistrations.splice(index, 1);
            Orders.$save($scope.order);
        };

        $scope.getUsername = function(uid) {
            let user = Users.find(user => user.uid === uid);

            return user ? user.name : '----';
        }

        $scope.onFileUploaded = function(thumbnaildata, file){
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


    }

})();
