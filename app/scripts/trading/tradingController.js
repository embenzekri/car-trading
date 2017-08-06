(function () {
    'use strict';
    angular.module('app')
        .controller('tradingController', ['tradingService', '$q', '$mdDialog','$scope', TradingController]);

    function TradingController(tradingService, $q, $mdDialog, $scope) {
        var self = $scope;
        $scope.logItem = function (item) {
            console.log(item, 'was selected');
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
            autoSelect: true,
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

        $scope.desserts = {
            "count": 9,
            "data": [
                {
                    "name": "Frozen yogurt",
                    "type": "Ice cream",
                    "calories": { "value": 159.0 },
                    "fat": { "value": 6.0 },
                    "carbs": { "value": 24.0 },
                    "protein": { "value": 4.0 },
                    "sodium": { "value": 87.0 },
                    "calcium": { "value": 14.0 },
                    "iron": { "value": 1.0 }
                }, {
                    "name": "Ice cream sandwich",
                    "type": "Ice cream",
                    "calories": { "value": 237.0 },
                    "fat": { "value": 9.0 },
                    "carbs": { "value": 37.0 },
                    "protein": { "value": 4.3 },
                    "sodium": { "value": 129.0 },
                    "calcium": { "value": 8.0 },
                    "iron": { "value": 1.0 }
                }, {
                    "name": "Eclair",
                    "type": "Pastry",
                    "calories": { "value":  262.0 },
                    "fat": { "value": 16.0 },
                    "carbs": { "value": 24.0 },
                    "protein": { "value":  6.0 },
                    "sodium": { "value": 337.0 },
                    "calcium": { "value":  6.0 },
                    "iron": { "value": 7.0 }
                }, {
                    "name": "Cupcake",
                    "type": "Pastry",
                    "calories": { "value":  305.0 },
                    "fat": { "value": 3.7 },
                    "carbs": { "value": 67.0 },
                    "protein": { "value": 4.3 },
                    "sodium": { "value": 413.0 },
                    "calcium": { "value": 3.0 },
                    "iron": { "value": 8.0 }
                }, {
                    "name": "Jelly bean",
                    "type": "Candy",
                    "calories": { "value":  375.0 },
                    "fat": { "value": 0.0 },
                    "carbs": { "value": 94.0 },
                    "protein": { "value": 0.0 },
                    "sodium": { "value": 50.0 },
                    "calcium": { "value": 0.0 },
                    "iron": { "value": 0.0 }
                }, {
                    "name": "Lollipop",
                    "type": "Candy",
                    "calories": { "value": 392.0 },
                    "fat": { "value": 0.2 },
                    "carbs": { "value": 98.0 },
                    "protein": { "value": 0.0 },
                    "sodium": { "value": 38.0 },
                    "calcium": { "value": 0.0 },
                    "iron": { "value": 2.0 }
                }, {
                    "name": "Honeycomb",
                    "type": "Other",
                    "calories": { "value": 408.0 },
                    "fat": { "value": 3.2 },
                    "carbs": { "value": 87.0 },
                    "protein": { "value": 6.5 },
                    "sodium": { "value": 562.0 },
                    "calcium": { "value": 0.0 },
                    "iron": { "value": 45.0 }
                }, {
                    "name": "Donut",
                    "type": "Pastry",
                    "calories": { "value": 452.0 },
                    "fat": { "value": 25.0 },
                    "carbs": { "value": 51.0 },
                    "protein": { "value": 4.9 },
                    "sodium": { "value": 326.0 },
                    "calcium": { "value": 2.0 },
                    "iron": { "value": 22.0 }
                }, {
                    "name": "KitKat",
                    "type": "Candy",
                    "calories": { "value": 518.0 },
                    "fat": { "value": 26.0 },
                    "carbs": { "value": 65.0 },
                    "protein": { "value": 7.0 },
                    "sodium": { "value": 54.0 },
                    "calcium": { "value": 12.0 },
                    "iron": { "value": 6.0 }
                }
            ]
        };


        self.selected = [];
        self.tradings = [];
        self.selectedIndex = 0;
        self.filterText = null;
        self.selectTrading = selectTrading;
        self.deleteTrading = deleteTrading;
        self.saveTrading = saveTrading;
        self.createTrading = createTrading;
        self.filter = filterTrading;
        self.getTradings = getTradings;
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
            if (self.selected == undefined || self.selected.make == undefined || self.selected.vin == undefined) {
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
                self.selected.push(tradings[0]);
            });
        }

        function getTradings() {
            tradingService.getTradings(self.query).then(function (tradings) {
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