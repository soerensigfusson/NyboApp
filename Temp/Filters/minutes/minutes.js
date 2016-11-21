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
//# sourceMappingURL=minutes.js.map
