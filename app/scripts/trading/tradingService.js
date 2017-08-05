(function () {
    'use strict';
    var mysql = require('mysql');
    
    // Creates MySql database connection
    var connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "trading_manager"
    });
    
    angular.module('app')
        .service('tradingService', ['$q', TradingService]);
    
    function TradingService($q) {
        return {
            getTradings: getAll,
            getById: getTradingById,
            create: createTrading,
            destroy: deleteTrading,
            update: updateTrading
        };
        
        function getAll() {
            var deferred = $q.defer();
            var query = "SELECT * FROM tradings";
            connection.query(query, function (err, rows) {
                if (err) deferred.reject(err);
                deferred.resolve(rows);
            });
            return deferred.promise;
        }
        
        function getTradingById(id) {
            var deferred = $q.defer();
            var query = "SELECT * FROM tradings WHERE trading_id = ?";
            connection.query(query, [id], function (err, rows) {
                if (err) deferred.reject(err);
                deferred.resolve(rows);
            });
            return deferred.promise;
        }
        
        function getTradingByName(name) {
            var deferred = $q.defer();
            var query = "SELECT * FROM tradings WHERE name LIKE  '" + name + "%'";
            connection.query(query, [name], function (err, rows) {
                console.log(err)
                if (err) deferred.reject(err);
                
                deferred.resolve(rows);
            });
            return deferred.promise;
        }
        
        function createTrading(trading) {
            var deferred = $q.defer();
            var query = "INSERT INTO tradings SET ?";
            connection.query(query, trading, function (err, res) {
                console.log(err)
                if (err) deferred.reject(err);
                console.log(res)
                deferred.resolve(res.insertId);
            });
            return deferred.promise;
        }
        
        function deleteTrading(id) {
            var deferred = $q.defer();
            var query = "DELETE FROM tradings WHERE trading_id = ?";
            connection.query(query, [id], function (err, res) {
                if (err) deferred.reject(err);
                console.log(res);
                deferred.resolve(res.affectedRows);
            });
            return deferred.promise;
        }
        
        function updateTrading(trading) {
            var deferred = $q.defer();
            var query = "UPDATE tradings SET name = ? WHERE trading_id = ?";
            connection.query(query, [trading.name, trading.trading_id], function (err, res) {
                if (err) deferred.reject(err);
                deferred.resolve(res);
            });
            return deferred.promise;
        }
    }
})();