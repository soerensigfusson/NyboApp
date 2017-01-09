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

    function /*@ngInject*/ config($mdThemingProvider, $mdDateLocaleProvider) {
      $mdThemingProvider.theme('default')
        .primaryPalette('blue-grey');

      $mdDateLocaleProvider.formatDate = function(date) {
         return moment(date).format('DD/MM/YYYY');
      };

    }



})();
