"use strict";

(function () {

    bootstrapper.$inject = ["$rootScope", "$localStorage", "$cordovaGlobalization"];
    config.$inject = ["$mdThemingProvider"];
    angular.module('App', ['app.templates', 'App.Services', 'App.Components', 'App.Filters', 'ui.router', 'ngMaterial', 'ngAnimate', 'ngSanitize', 'ngStorage', 'ngCordova', 'firebase']).run(bootstrapper).config(config);

    function /*@ngInject*/bootstrapper($rootScope, $localStorage, $cordovaGlobalization) {}

    function /*@ngInject*/config($mdThemingProvider) {
        $mdThemingProvider.theme('default').primaryPalette('blue-grey');
    }
})();

"use strict";

(function () {
    routeSetup.$inject = ["$stateProvider", "$urlRouterProvider"];
    handleRoutes.$inject = ["$rootScope", "$state"];
    angular.module('App').config(routeSetup).run(handleRoutes);

    function /*@ngInject*/handleRoutes($rootScope, $state) {
        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            // We can catch the error thrown when the $requireSignIn promise is rejected
            // and redirect the user back to the home page
            if (error === 'AUTH_REQUIRED') {
                $state.go('login');
            }
        });
    }

    function /*@ngInject*/routeSetup($stateProvider, $urlRouterProvider) {
        //$urlRouterProvider.otherwise('/home');

        $urlRouterProvider.otherwise('/home');

        $stateProvider.state('home', {
            url: '/home',
            controller: 'HomeController',
            templateUrl: 'Pages/Home/home.tmpl.html',
            resolve: {
                'currentAuth': /*@ngInject*/["Auth", function (Auth) {
                    return Auth.$requireSignIn();
                }]
            }
        }).state('login', {
            url: '/login',
            controller: 'LoginController',
            templateUrl: 'Pages/Login/login.tmpl.html',
            resolve: {
                'currentAuth': /*@ngInject*/["Auth", function (Auth) {
                    return Auth.$waitForSignIn();
                }]
            }
        }).state('home.account', {
            url: '/account',
            controller: 'AccountController',
            templateUrl: 'Pages/Account/account.tmpl.html'
        }).state('home.users', {
            url: '/users',
            abstract: true,
            controller: 'UserController',
            template: '<ui-view />'
        }).state('home.users.list', {
            url: '/',
            templateUrl: 'Pages/Users/list.tmpl.html'
        }).state('home.users.add', {
            url: '/users',
            templateUrl: 'Pages/Users/add-user.tmpl.html'
        }).state('home.orders', {
            url: '/orders',
            abstract: true,
            controller: 'OrdersController',
            template: '<ui-view />'
        }).state('home.orders.list', {
            url: '/',
            templateUrl: 'Pages/Orders/orders.tmpl.html'
        }).state('home.orders.add', {
            url: '/add',
            controller: 'OrderController',
            templateUrl: 'Pages/Orders/add-order.tmpl.html'
        }).state('home.orders.edit', {
            url: '/edit/:id',
            controller: 'OrderController',
            templateUrl: 'Pages/Orders/add-order.tmpl.html',
            resolve: {
                'currentAuth': /*@ngInject*/["Auth", function (Auth) {
                    return Auth.$waitForSignIn();
                }]
            }
        }).state('home.orders.order', {
            url: '/:id',
            controller: 'OrderController',
            templateUrl: 'Pages/Orders/order.tmpl.html',
            resolve: {
                'currentAuth': /*@ngInject*/["Auth", function (Auth) {
                    return Auth.$waitForSignIn();
                }]
            }
        }).state('home.orders.order.details', {
            templateUrl: 'Pages/Orders/order.details.tmpl.html'
        }).state('home.orders.order.materials', {
            templateUrl: 'Pages/Orders/order.materials.tmpl.html'
        }).state('home.orders.order.time', {
            templateUrl: 'Pages/Orders/order.time.tmpl.html'
        });
    }
})();

'use strict';

(function () {
    angular.module('App.Components', ['App.Components.Uploader']);
})();

'use strict';

(function () {

    confettiDirective.$inject = ["$timeout"];
    angular.module('App.Components.Confetti', ['app.templates']).directive('confetti', confettiDirective);

    function /*@ngInject*/confettiDirective($timeout) {

        var directive = {
            restrict: 'E',
            templateUrl: 'Components/Confetti/confetti.tpl.html',
            link: link,
            scope: {
                duration: '@'
            }
        };

        function link(scope, element, attr) {

            scope.duration = scope.duration || 800;

            //@see http://jsfiddle.net/Javalsu/vxP5q/743/?utm_source=website&utm_medium=embed&utm_campaign=vxP5q

            // globals
            var canvas;
            var ctx;
            var W;
            var H;
            var mp = 100; //max particles
            var particles = [];
            var angle = 0;
            var tiltAngle = 0;
            var confettiActive = true;
            var animationComplete = true;
            var deactivationTimerHandler;
            var reactivationTimerHandler;
            var animationHandler;

            // objects

            var particleColors = {
                colorOptions: [
                //Nordea colors
                '#3AC1A3', '#FFE27C', '#FF5757', '#97CDFF', '#2C97FF', '#0000FF'],

                colorIndex: 0,
                colorIncrementer: 0,

                getColor: function getColor() {
                    if (this.colorIncrementer >= 10) {
                        this.colorIncrementer = 0;
                        this.colorIndex++;
                        if (this.colorIndex >= this.colorOptions.length) {
                            this.colorIndex = 0;
                        }
                    }
                    this.colorIncrementer++;
                    return this.colorOptions[this.colorIndex];
                }
            };

            function confettiParticle(color) {

                this.x = Math.random() * W; // x-coordinate
                this.y = Math.random() * H - H; //y-coordinate
                this.r = RandomFromTo(10, 30); //radius;
                this.d = Math.random() * mp + 10; //density;
                this.color = color;
                this.tilt = Math.floor(Math.random() * 10) - 10;
                this.tiltAngleIncremental = Math.random() * 0.07 + .05;
                this.tiltAngle = 0;

                this.draw = function () {
                    ctx.beginPath();
                    ctx.lineWidth = this.r / 2;
                    ctx.strokeStyle = this.color;
                    ctx.moveTo(this.x + this.tilt + this.r / 4, this.y);
                    ctx.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 4);
                    return ctx.stroke();
                };
            }

            function SetGlobals() {
                canvas = document.querySelectorAll('.confetti')[0];
                ctx = canvas.getContext("2d");
                W = window.innerWidth;
                H = window.innerHeight;
                canvas.width = W;
                canvas.height = H;
            }

            function InitializeConfetti() {
                particles = [];
                animationComplete = false;
                for (var i = 0; i < mp; i++) {
                    var particleColor = particleColors.getColor();
                    particles.push(new confettiParticle(particleColor));
                }
                StartConfetti();
            }

            function Draw() {
                ctx.clearRect(0, 0, W, H);
                var results = [];
                for (var i = 0; i < mp; i++) {
                    (function (j) {
                        results.push(particles[j].draw());
                    })(i);
                }
                Update();

                return results;
            }

            function RandomFromTo(from, to) {
                return Math.floor(Math.random() * (to - from + 1) + from);
            }

            function Update() {
                var remainingFlakes = 0;
                var particle;
                angle += 0.01;
                tiltAngle += 0.1;

                for (var i = 0; i < mp; i++) {
                    particle = particles[i];
                    if (animationComplete) return;

                    if (!confettiActive && particle.y < -15) {
                        particle.y = H + 100;
                        continue;
                    }

                    stepParticle(particle, i);

                    if (particle.y <= H) {
                        remainingFlakes++;
                    }
                    CheckForReposition(particle, i);
                }

                if (remainingFlakes === 0) {
                    StopConfetti();
                }
            }

            function CheckForReposition(particle, index) {
                if ((particle.x > W + 20 || particle.x < -20 || particle.y > H) && confettiActive) {
                    if (index % 5 > 0 || index % 2 == 0) //66.67% of the flakes
                        {
                            repositionParticle(particle, Math.random() * W, -10, Math.floor(Math.random() * 10) - 10);
                        } else {
                        if (Math.sin(angle) > 0) {
                            //Enter from the left
                            repositionParticle(particle, -5, Math.random() * H, Math.floor(Math.random() * 10) - 10);
                        } else {
                            //Enter from the right
                            repositionParticle(particle, W + 5, Math.random() * H, Math.floor(Math.random() * 10) - 10);
                        }
                    }
                }
            }

            function stepParticle(particle, particleIndex) {
                particle.tiltAngle += particle.tiltAngleIncremental;
                particle.y += (Math.cos(angle + particle.d) + 3 + particle.r / 2) / 2;
                particle.x += Math.sin(angle);
                particle.tilt = Math.sin(particle.tiltAngle - particleIndex / 3) * 15;
            }

            function repositionParticle(particle, xCoordinate, yCoordinate, tilt) {
                particle.x = xCoordinate;
                particle.y = yCoordinate;
                particle.tilt = tilt;
            }

            function StartConfetti() {
                W = window.innerWidth;
                H = window.innerHeight;
                canvas.width = W;
                canvas.height = H;
                (function animloop() {
                    if (animationComplete) return null;
                    animationHandler = requestAnimFrame(animloop);
                    return Draw();
                })();
            }

            function ClearTimers() {
                clearTimeout(reactivationTimerHandler);
                clearTimeout(animationHandler);
            }

            //Deactivates confetti and lets it drift out of the screen
            function DeactivateConfetti() {
                confettiActive = false;
                ClearTimers();
            }

            /**
            * Stops confetti and removes it
            */
            function StopConfetti() {
                animationComplete = true;
                if (ctx === undefined) {
                    return;
                }
                ctx.clearRect(0, 0, W, H);
            }

            window.requestAnimFrame = function () {
                return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
                    return window.setTimeout(callback, 1000 / 60);
                };
            }();

            //Kick start the party!
            angular.element(document).ready(function () {

                SetGlobals();
                InitializeConfetti();

                $timeout(function () {
                    DeactivateConfetti();
                }, scope.duration);
            });
        }

        return directive;
    }
})();

'use strict';

(function () {

    uploaderDirective.$inject = ["$timeout"];
    angular.module('App.Components.Uploader', []).directive('uploader', uploaderDirective);

    function /*@ngInject*/uploaderDirective($timeout) {
        var storage = firebase.storage();

        // Create a storage reference from our storage service
        var storageRef = storage.ref();
        var imagesRef = storageRef.child('images');

        var directive = {
            restrict: 'A',
            link: link,
            scope: {
                uploader: '&'
            }
        };

        function link(scope, element, attr) {
            console.log('link');
            element[0].addEventListener('change', handleFiles.bind(this, scope.uploader), false);
        }

        function handleFiles(callback, event) {
            var fileList = event.target.files; /* now you can work with the file list */

            var _loop = function _loop() {
                file = fileList[i];

                var thumbnaildata = '';

                new Thumbnail({
                    maxWidth: 200,
                    maxHeight: 200,
                    file: file,
                    onSuccess: function onSuccess(data) {
                        thumbnaildata = data;
                    }
                }).createThumbnail();

                var ref = imagesRef.child(file.name);
                ref.put(file).then(function (snapshot) {
                    callback()(snapshot, thumbnaildata, file.name, ref);
                });
            };

            for (var i = 0; i < fileList.length; i++) {
                var file;

                _loop();
            }
        }

        return directive;
    }

    function Thumbnail(options) {
        this.options = {
            file: options.file,
            maxWidth: options.maxWidth || 120,
            maxHeight: options.maxHeight || 120,
            onError: options.onError && options.onError.bind(this),
            onSuccess: options.onSuccess && options.onSuccess.bind(this)
        };
    };

    Thumbnail.prototype.detectVerticalSquash = function (elem) {
        if (elem.naturalHeight === undefined) {
            return 1;
        }
        var alpha, canvas, ctx, data, ey, ih, py, ratio, sy;
        ih = elem.naturalHeight;
        canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = ih;
        ctx = canvas.getContext('2d');
        ctx.drawImage(elem, 0, 0);
        data = ctx.getImageData(0, 0, 1, ih).data;
        sy = 0;
        ey = ih;
        py = ih;
        while (py > sy) {
            alpha = data[(py - 1) * 4 + 3];
            if (alpha === 0) {
                ey = py;
            } else {
                sy = py;
            }
            py = ey + sy >> 1;
        }
        ratio = py / ih;
        if (ratio === 0) {
            return 1;
        } else {
            return ratio;
        }
    };

    Thumbnail.prototype.createThumbnail = function () {
        if (this.options.file.type.match(/image.*/)) {
            this.createThumbnailFromImageFile();
        } else if (this.options.file.type.match(/video.*/)) {
            this.createThumbnailFromVideoFile();
        } else if (this.options.onError) {
            this.options.onError();
        }
    };

    Thumbnail.prototype.createThumbnailFromImageFile = function () {
        var fileReader = new FileReader();
        fileReader.addEventListener('load', function () {
            this.createThumbnailFromUrl(fileReader.result);
        }.bind(this));
        fileReader.readAsDataURL(this.options.file);
    };

    Thumbnail.prototype.createThumbnailFromVideoFile = function () {
        this.createVideoThumbnailFromUrl(URL.createObjectURL(this.options.file));
    };

    Thumbnail.prototype.createVideoThumbnailFromUrl = function (videoUrl) {
        var canPlay, videoElem;
        videoElem = document.createElement('video');
        videoElem.style = 'display: none';
        document.body.appendChild(videoElem);
        canPlay = videoElem.canPlayType(this.options.file.type);
        if (canPlay === 'no' || canPlay === '') {
            if (this.options.onError) {
                this.options.onError();
            }
            return;
        }
        videoElem.addEventListener('loadeddata', function () {
            if (this.options.onSuccess) {
                this.options.onSuccess(this.getThumbnailDataURL(videoElem, videoElem.videoWidth, videoElem.videoHeight));
            }
            document.body.removeChild(videoElem);
        }.bind(this), false);
        videoElem.addEventListener('error', function () {
            if (this.options.onError) {
                this.options.onError();
            }
            document.body.removeChild(videoElem);
        }.bind(this), false);
        videoElem.src = videoUrl;
    };

    Thumbnail.prototype.createThumbnailFromUrl = function (imageUrl, crossOrigin) {
        var imageElem = document.createElement('img');
        if (crossOrigin) {
            imageElem.crossOrigin = crossOrigin;
        }
        if (this.options.onSuccess) {
            imageElem.onload = function () {
                this.options.onSuccess(this.getThumbnailDataURL(imageElem, imageElem.width, imageElem.height));
            }.bind(this);
        }
        if (this.options.onError) {
            imageElem.onerror = this.options.onError;
        }
        imageElem.src = imageUrl;
    };

    Thumbnail.prototype.getResizeInformation = function (srcWidth, srcHeight) {
        var info = {
            srcX: 0,
            srcY: 0,
            srcWidth: srcWidth,
            srcHeight: srcHeight,
            trgWidth: undefined,
            trgHeight: undefined
        };
        var srcRatio = srcWidth / srcHeight;
        var optWidth = this.options.maxWidth;
        var optHeight = this.options.maxHeight;
        if (!optWidth && !optHeight) {
            optWidth = info.srcWidth;
            optHeight = info.srcHeight;
        } else if (!optWidth) {
            optWidth = srcRatio * optHeight;
        } else if (!optHeight) {
            optHeight = 1 / srcRatio * optWidth;
        }
        var trgRatio = optWidth / optHeight;
        if (srcHeight < optHeight || srcWidth < optWidth) {
            // this code fails if only one src is below opt
            info.trgHeight = info.srcHeight;
            info.trgWidth = info.srcWidth;
        } else {
            if (srcRatio > trgRatio) {
                info.srcHeight = srcHeight;
                info.srcWidth = info.srcHeight * trgRatio;
            } else {
                info.srcWidth = srcWidth;
                info.srcHeight = info.srcWidth / trgRatio;
            }
        }
        info.srcX = (srcWidth - info.srcWidth) / 2;
        info.srcY = (srcHeight - info.srcHeight) / 2;
        if (info.trgWidth === undefined) {
            info.trgWidth = optWidth;
        }
        if (info.trgHeight === undefined) {
            info.trgHeight = optHeight;
        }
        return info;
    };

    Thumbnail.prototype.getThumbnailDataURL = function (elem, elemWidth, elemHeight) {
        var vertSquashRatio = this.detectVerticalSquash(elem);
        var info = this.getResizeInformation(elemWidth, elemHeight);
        var canvas = document.createElement('canvas');
        canvas.width = info.trgWidth;
        canvas.height = info.trgHeight;
        canvas.getContext('2d').drawImage(elem, info.srcX, info.srcY, info.srcWidth, info.srcHeight, 0, 0, info.trgWidth, info.trgHeight / vertSquashRatio);
        return canvas.toDataURL('image/png');
    };
})();

'use strict';

(function () {
    angular.module('App.Filters', ['App.Filters.Minutes', 'App.Filters.ToDate']);
})();

'use strict';

(function () {

    angular.module('App.Filters.Minutes', []).filter('minutes', minutes);

    function /*@ngInject*/minutes() {

        return function (val) {

            if (!val) {
                return '00:00';
            }

            return Math.floor(val / 60).toString().padStart(2, '0') + ':' + (val % 60).toString().padStart(2, '0');
        };
    }

    return minutes;
})();

'use strict';

(function () {

    angular.module('App.Filters.ToDate', []).filter('todate', minutes);

    function /*@ngInject*/minutes() {

        return function (val) {

            if (!val) {
                return '';
            }

            return new Date(val);
        };
    }

    return minutes;
})();

"use strict";

(function () {
    accountController.$inject = ["$scope", "$state", "Auth"];
    angular.module('App').controller('AccountController', accountController);

    function /*@ngInject*/accountController($scope, $state, Auth) {
        $scope.firebaseUser = Auth.$getAuth();

        console.log($scope.firebaseUser);

        $scope.signout = function () {
            Auth.$signOut();
        };
    }
})();

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

"use strict";

(function () {
    orderController.$inject = ["$q", "$scope", "$state", "$http", "$stateParams", "Orders", "Auth", "Users"];
    angular.module('App').controller('OrderController', orderController);

    var timelist = [];

    for (var i = 0; i < 48; i++) {
        var minutes = (i % 2 * 30).toString().padStart(2, '0');
        var hour = Math.floor(i / 2).toString().padStart(2, '0');
        timelist.push({ title: hour + ':' + minutes, minutes: i * 30 });
    }

    function /*@ngInject*/orderController($q, $scope, $state, $http, $stateParams, Orders, Auth, Users) {
        $scope.orders = Orders;
        $scope.timelist = timelist;
        $scope.addrSearch = {};
        $scope.currentNavItem = 'details';

        var addressParts = ['vejnavne', 'adgangsadresser', 'adresser'];
        var partIndex = 0;
        var materials = [];
        var currentUser = Auth.$getAuth();

        function getMaterials() {
            $scope.orders.forEach(function (order) {
                order.materials.forEach(function (material) {
                    if (materials.indexOf(material.name) === -1) {
                        materials.push(material.name);
                    }
                });
            });
        }

        $scope.materialSearch = function (query) {
            var results = query ? materials.filter(createFilterFor(query)) : materials;
            return results;
        };

        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);

            return function filterFn(material) {
                return material.indexOf(lowercaseQuery) === 0;
            };
        }

        $scope.selectAddress = function () {
            partIndex = partIndex == addressParts.length - 1 ? 0 : partIndex + 1;

            if ($scope.addrSearch.selectedItem.adresse) {
                $scope.orders.address = $scope.addrSearch.selectedItem.text;
            }
        };

        $scope.querySearch = function (txt) {
            var addressPart = addressParts[partIndex];

            var request = {
                url: 'http://dawa.aws.dk/' + addressPart + '/autocomplete',
                method: 'GET',
                params: {
                    q: txt
                }
            };

            var deferred = $q.defer();
            $http(request).then(function (response) {
                deferred.resolve(response.data);
            });

            return deferred.promise;
        };

        if ($stateParams.id) {
            Orders.$loaded().then(function (x) {
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

        $scope.saveOrder = function () {
            // prepare data
            if ($scope.order.startdate && typeof $scope.order.startdate !== 'string') {
                $scope.order.startdate = $scope.order.startdate.toString();
            }
            if ($scope.order.enddate && typeof $scope.order.enddate !== 'string') {
                $scope.order.enddate = $scope.order.enddate.toString();
            }

            if ($scope.order.$id === undefined) {
                Orders.$add($scope.order);
                $state.go('^.list');
            } else {
                Orders.$save($scope.order);
                $state.go('^.order', { id: $scope.order.$id });
            }
        };

        $scope.deleteOrder = function () {
            Orders.$remove($scope.order);
            $state.go('^.list');
        };

        $scope.newmaterial = {
            name: '',
            amount: 0
        };

        $scope.addMaterial = function () {
            $scope.newmaterial.name = $scope.newmaterial.name || $scope.newmaterial.materialSearchText;
            delete $scope.newmaterial.materialSearchText;

            if (!$scope.newmaterial.name || $scope.newmaterial.amount <= 0) {
                return;
            }

            if (!$scope.order.materials) {
                $scope.order.materials = [];
            }

            $scope.order.materials.push($scope.newmaterial);
            Orders.$save($scope.order).then(function () {
                $scope.newmaterial = {};
            });
        };

        $scope.deleteMaterial = function (index) {
            $scope.order.materials.splice(index, 1);
            Orders.$save($scope.order);
        };

        $scope.newtimereg = {
            date: new Date(),
            time: 60,
            description: ''

        };

        $scope.addTimereg = function () {

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
            Orders.$save($scope.order).then(function () {
                $scope.newtimereg = {
                    date: new Date(),
                    time: 0,
                    description: ''
                };
            });
        };

        $scope.deleteTimereg = function (index) {
            $scope.order.timeregistrations.splice(index, 1);
            Orders.$save($scope.order);
        };

        $scope.getUsername = function (uid) {
            var user = Users.find(function (user) {
                return user.uid === uid;
            });

            return user ? user.name : '----';
        };

        $scope.onFileUploaded = function (snapshot, thumbnaildata) {
            if (!$scope.order.files) {
                $scope.order.files = [];
            }

            $scope.order.files.push({
                url: snapshot.downloadUrl,
                thumbnail: thumbnaildata
            });

            console.log(snapshot, thumbnaildata);
        };
    }
})();

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

"use strict";

(function () {
    userController.$inject = ["$scope", "$state", "Auth", "Users"];
    angular.module('App').controller('UserController', userController);

    function /*@ngInject*/userController($scope, $state, Auth, Users) {
        $scope.currentUser = Auth.$getAuth().uid;

        console.log(Users);

        $scope.users = Users;

        $scope.user = {};

        $scope.addUser = function () {
            $state.go('^.add');
        };

        $scope.createUser = function () {
            $scope.message = null;
            $scope.error = null;

            // Create a new user
            Auth.$createUserWithEmailAndPassword($scope.user.email, $scope.user.password).then(function (firebaseUser) {
                $scope.message = "User created with uid: " + firebaseUser.uid;
                var userObj = {
                    name: $scope.user.name,
                    email: $scope.user.email,
                    uid: firebaseUser.uid
                };

                Users.$add(userObj);
                $scope.user = {};

                firebaseUser.updateProfile({ displayName: $scope.user.name });

                $state.go('^.list');
            }).catch(function (error) {
                $scope.error = error;
            });
        };

        $scope.delete = function (user) {};
    }
})();

'use strict';

(function () {
  auth.$inject = ["$firebaseAuth"];
  angular.module('App.Services.Auth', []).factory('Auth', auth);

  function /*@ngInject*/auth($firebaseAuth) {
    return $firebaseAuth();
  }
})();

'use strict';

(function () {
    orders.$inject = ["$firebaseArray"];
    angular.module('App.Services.Orders', []).factory('Orders', orders);

    function /*@ngInject*/orders($firebaseArray) {
        var ref = firebase.database().ref().child('orders');
        return $firebaseArray(ref);
    }
})();

'use strict';

(function () {
    angular.module('App.Services', ['App.Services.Auth', 'App.Services.Orders', 'App.Services.Users']);
})();

'use strict';

(function () {
    users.$inject = ["$firebaseArray"];
    angular.module('App.Services.Users', []).factory('Users', users);

    function /*@ngInject*/users($firebaseArray) {
        var ref = firebase.database().ref().child('users');
        return $firebaseArray(ref);
    }
})();

//# sourceMappingURL=app.js.map