
(function () {
    'use strict';
    
    var _templateBase = './scripts';
    
    angular.module('app', [
        'ngRoute',
        'ngMaterial',
        'ngAnimate',
        'md.data.table'
    ])
    .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/', {
                templateUrl: _templateBase + '/trading/trading.html' ,
                controller: 'tradingController',
                //controllerAs: '_ctrl'
            });
            $routeProvider.otherwise({ redirectTo: '/' });
        }
    ]);

})();