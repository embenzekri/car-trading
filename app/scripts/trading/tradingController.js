(function () {
    'use strict';
    angular.module('app')
        .controller('tradingController', ['tradingService', '$q', '$mdDialog', TradingController]);
    
    function TradingController(tradingService, $q, $mdDialog) {
        var self = this;
        
        self.selected = null;
        self.tradings = [];
        self.selectedIndex = 0;
        self.filterText = null;
        self.selectTrading = selectTrading;
        self.deleteTrading = deleteTrading;
        self.saveTrading = saveTrading;
        self.createTrading = createTrading;
        self.filter = filterTrading;
        
        // Load initial data
        getAllTradings();
        self.selected = {};
        self.selectedIndex = null;
        
        //----------------------
        // Internal functions 
        //----------------------
        
        function selectTrading(trading, index) {
            self.selected = angular.isNumber(trading) ? self.tradings[trading] : trading;
            self.selectedIndex = angular.isNumber(trading) ? trading: index;
        }
        
        function deleteTrading($event) {
            var confirm = $mdDialog.confirm()
                                   .title('Are you sure?')
                                   .content('Are you sure want to delete this trading?')
                                   .ok('Yes')
                                   .cancel('No')
                                   .targetEvent($event);
            
            
            $mdDialog.show(confirm).then(function () {
                tradingService.destroy(self.selected.trading_id).then(function (affectedRows) {
                    self.tradings.splice(self.selectedIndex, 1);
                });
            }, function () { });
        }
        
        function saveTrading($event) {
            console.log(self.selected);

            if (self.selected != null && self.selected.trading_id != null) {
                tradingService.update(self.selected).then(function (affectedRows) {
                    $mdDialog.show(
                        $mdDialog
                            .alert()
                            .clickOutsideToClose(true)
                            .title('Success')
                            .content('Data Updated Successfully!')
                            .ok('Ok')
                            .targetEvent($event)
                    );
                });
            }
            else {
                //self.selected.trading_id = new Date().getSeconds();
                tradingService.create(self.selected).then(function (affectedRows) {
                    $mdDialog.show(
                        $mdDialog
                            .alert()
                            .clickOutsideToClose(true)
                            .title('Success')
                            .content('Data Added Successfully!')
                            .ok('Ok')
                            .targetEvent($event)
                    );
                });
            }
        }
        
        function createTrading() {
            self.selected = {};
            self.selectedIndex = null;
        }
        
        function getAllTradings() {
            tradingService.getTradings().then(function (tradings) {
                self.tradings = [].concat(tradings);
                self.selected = tradings[0];
            });
        }
        
        function filterTrading() {
            if (self.filterText == null || self.filterText == "") {
                getAllTradings();
            }
            else {
                tradingService.getByName(self.filterText).then(function (tradings) {
                    self.tradings = [].concat(tradings);
                    self.selected = tradings[0];
                });
            }
        }
    }

})();