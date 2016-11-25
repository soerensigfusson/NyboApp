(function() {

    angular.module('App.Components.ImageLoader', ['app.templates'])
        .directive('imageLoader', imageLoaderDirective);


    function /*@ngInject*/ imageLoaderDirective($timeout) {

        var directive = {
            restrict: 'E',
            templateUrl: 'Components/ImageLoader/imageloader.tpl.html',
            link: link,
            scope: {
            	file: '='
            }
        };


        function link(scope, element, attr) {
            console.log(scope.file);
        }

        return directive;
    }

})();
