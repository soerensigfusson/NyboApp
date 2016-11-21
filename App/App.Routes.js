(function() {
    angular.module('App')
        .config(routeSetup)
        .run(handleRoutes);

    function /*@ngInject*/ handleRoutes($rootScope, $state) {
        $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
            // We can catch the error thrown when the $requireSignIn promise is rejected
            // and redirect the user back to the home page
            if (error === 'AUTH_REQUIRED') {
                $state.go('login');
            }
        });
    }

    function /*@ngInject*/ routeSetup($stateProvider, $urlRouterProvider) {
        //$urlRouterProvider.otherwise('/home');

        $urlRouterProvider.otherwise('/home');

        $stateProvider
            .state('home', {
                url: '/home',
                controller: 'HomeController',
                templateUrl: 'Pages/Home/home.tmpl.html',
                resolve: {
                    'currentAuth': /*@ngInject*/ function(Auth) {
                        return Auth.$requireSignIn();
                    }
                }
            })

        .state('login', {
                url: '/login',
                controller: 'LoginController',
                templateUrl: 'Pages/Login/login.tmpl.html',
                resolve: {
                    'currentAuth': /*@ngInject*/ function(Auth) {
                        return Auth.$waitForSignIn();
                    }
                }
            })
            .state('home.account', {
                url: '/account',
                controller: 'AccountController',
                templateUrl: 'Pages/Account/account.tmpl.html'
            })
            .state('home.users', {
                url: '/users',
                abstract: true,
                controller: 'UserController',
                template: '<ui-view />'
            })

        .state('home.users.list', {
                url: '/',
                templateUrl: 'Pages/Users/list.tmpl.html'
            })
            .state('home.users.add', {
                url: '/users',
                templateUrl: 'Pages/Users/add-user.tmpl.html'
            })


        .state('home.orders', {
                url: '/orders',
                abstract: true,
                controller: 'OrdersController',
                template: '<ui-view />'
            })
            .state('home.orders.list', {
                url: '/',
                templateUrl: 'Pages/Orders/orders.tmpl.html'
            })
            .state('home.orders.add', {
                url: '/add',
                controller: 'OrderController',
                templateUrl: 'Pages/Orders/add-order.tmpl.html'
            })
            .state('home.orders.edit', {
                url: '/edit/:id',
                controller: 'OrderController',
                templateUrl: 'Pages/Orders/add-order.tmpl.html',
                resolve: {
                    'currentAuth': /*@ngInject*/ function(Auth) {
                        return Auth.$waitForSignIn();
                    }
                }
            })
            .state('home.orders.order', {
                url: '/:id',
                controller: 'OrderController',
                templateUrl: 'Pages/Orders/order.tmpl.html',
                resolve: {
                    'currentAuth': /*@ngInject*/ function(Auth) {
                        return Auth.$waitForSignIn();
                    }
                }
            })
            .state('home.orders.order.details', {
                templateUrl: 'Pages/Orders/order.details.tmpl.html',
            })
            .state('home.orders.order.materials', {
                templateUrl: 'Pages/Orders/order.materials.tmpl.html',
            })
            .state('home.orders.order.time', {
                templateUrl: 'Pages/Orders/order.time.tmpl.html',
            });

    }

})();
