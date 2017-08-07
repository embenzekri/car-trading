(function () {
    'use strict';
    angular.module('app')
        .controller('tradingController', ['tradingService', '$q', '$mdDialog','$scope', TradingController]);

    function TradingController(tradingService, $q, $mdDialog, $scope) {
        var self = $scope;
        $scope.logItem = function (item) {
            console.log(item, 'was selected');
            self.newEntry = item;
        };
        self.count= 34;
        //$scope.count= 44;
        $scope.limitOptions = [5, 10, 20,30];
        $scope.itemSelected = []
        $scope.selected = [];
        $scope.limitOptions = [5, 10, 15];

        $scope.options = {
            rowSelection: true,
            multiSelect: false,
            autoSelect: false,
            decapitate: false,
            largeEditDialog: false,
            boundaryLinks: false,
            limitSelect: true,
            pageSelect: true
        };

        $scope.query = {
            order: 'name',
            limit: 5,
            page: 1
        };

        self.buyDate = new Date();
        self.sellDate = new Date();
        self.selected = [];
        self.tradings = [];
        self.selectedIndex = 0;
        self.filterText = null;
        self.selectTrading = selectTrading;
        self.deleteTrading = deleteTrading;
        self.saveTrading = saveTrading;
        self.createTrading = createTrading;
        self.filter = filterTrading;
        self.onDelete = function($event) {
            console.log($event, "delete");
        };
        console.log("conteoller initialized");
        // Load initial data
        getAllTradings();
        self.query = {
            order: 'name',
            limit: 5,
            page: 1
        };
        //----------------------
        // Internal functions 
        //----------------------

        function selectTrading(trading, index) {
            self.selected = angular.isNumber(trading) ? self.tradings[trading] : trading;
            self.selectedIndex = angular.isNumber(trading) ? trading : index;
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
            }, function () {
            });
        }

        function saveTrading($event) {
            console.log(self.newEntry);

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
                if (!isValid()) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('Erreur de validation')
                            .content('Des informations sont manquantes')
                            .ok('Ok')
                            .targetEvent($event)
                    );
                } else {
                    tradingService.create(self.selected).then(function (affectedRows) {
                        console.log(affectedRows);
                        self.tradings.push(self.selected);
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
        }

        function isValid() {
            if (self.newEntry == undefined || self.newEntry.make == undefined || self.newEntry.vin == undefined) {
                return false;
            } else {
                return true;
            }

        }

        function createTrading() {
            self.selected = {};
            self.selectedIndex = null;
        }

        function getAllTradings() {
            tradingService.getTradings().then(function (tradings) {
                self.tradings = [].concat(tradings);
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