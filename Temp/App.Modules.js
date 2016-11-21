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
//# sourceMappingURL=App.Modules.js.map
