(function () {
    'use strict';

    var _templateBase = './scripts';

    angular.module('app', [
        'ngRoute',
        'ngMaterial',
        'ngAnimate',
        'md.data.table',
        'ngMdIcons'
    ])
        .config(['$routeProvider', '$mdIconProvider', function ($routeProvider, $mdIconProvider) {
            $routeProvider.when('/', {
                templateUrl: _templateBase + '/trading/trading.html',
                controller: 'tradingController',
                //controllerAs: '_ctrl'
            });
            $routeProvider.otherwise({redirectTo: '/'});
            $mdIconProvider
                .icon('communication', './assets/img/svg/ic_delete_black_24px.svg', 24);

        }
        ]);

})();