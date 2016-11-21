(function() {

    angular.module('App', [

        'app.templates',
        'App.Services',
        'App.Components',
        'App.Filters',
        'ui.router',
        'ngMaterial',
        'ngAnimate',
        'ngSanitize',
        'ngStorage',
        'ngCordova',
        'firebase'

    ])
        .run(bootstrapper)
        .config(config);

    function /*@ngInject*/ bootstrapper($rootScope, $localStorage, $cordovaGlobalization) {

    }

    function /*@ngInject*/ config($mdThemingProvider) {
      $mdThemingProvider.theme('default')
        .primaryPalette('blue-grey');

    }



})();
