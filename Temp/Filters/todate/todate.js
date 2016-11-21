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
//# sourceMappingURL=todate.js.map
