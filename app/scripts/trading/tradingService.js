(function () {
    'use strict';
    var db = new PouchDB('mydb-idb');

    /*db.allDocs().then(function (result) {
        // Promise isn't supported by all browsers; you may want to use bluebird
        return Promise.all(result.rows.map(function (row) {
            return db.remove(row.id, row.value.rev);
        }));
    }).then(function () {
        // done!
    }).catch(function (err) {
        // error!
    });*/
    db.info().then(function (info) {
        console.log('Database initialized');
    }).catch(function (err) {
        console.log('Error initializing database');
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

        function getAll(query) {
            console.log("get all with");
            console.log(query);
            var deferred = $q.defer();
            db.allDocs({include_docs: true, descending: true, attachments: true}, function (err, doc) {
                let k,
                    items = [],
                    row = doc.rows;

                for (k in row) {
                    var item = row[k].doc
                    items.push({id: item._id, make: item.make, vin: item.vin});
                }
                deferred.resolve(items);
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
            console.log("Inserting");
            console.log(trading);
            var deferred = $q.defer();
            var object = {
                _id: new Date().toISOString().slice(0, 19),
                make: trading.make,
                vin: trading.vin
            };
            db.put(object, function callback(err, result) {
                if (!err) {
                    console.log('Inserted success');
                    console.log(result);
                    deferred.resolve(result.insertId);
                }
                else {
                    console.log('Insertion error');
                    console.dir(err);
                }
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