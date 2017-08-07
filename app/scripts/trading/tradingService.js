(function () {
    'use strict';
    var db = new PouchDB('mydb-idb');

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

        function nextId() {
            var deferred = $q.defer();

            db.get("autoincrement", {}, function callback(err, result) {
                if (!err) {
                    updateId(result, deferred)
                    return result.value + 1;
                }
                else {
                    insertNewId();
                    deferred.resolve(1);
                }
            });

            return deferred.promise;
        }

        function updateId(object, deferred) {
            object.value += 1;
            db.put(object, function callback(err, result) {
                if (!err) {
                    console.log(result, 'Id Updated success');
                    deferred.resolve(object.value);
                }
                else {
                    console.log('id updated error');
                }
            });
        }

        function insertNewId() {
            var object = {
                type: 'autoincrement',
                _id: 'autoincrement',
                value: 1
            };
            db.put(object, function callback(err, result) {
                if (!err) {
                    console.log(result, 'Inserted success new id');
                }
                else {
                    console.log('id insertion error');
                }
            });
        }

        function createTrading(trading) {
            console.log("Inserting");
            console.log(trading);
            nextId().then(function (id) {
                console.log(id, "new id retrieved");
                var deferred = $q.defer();
                var object = {
                    type: 'trading',
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