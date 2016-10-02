var pg = require('pg');
var q = require('q');
var config = require('../config/db.json');
var pool = new pg.Pool(config);

/* Get data from postgresql server */
function select(qry) {
    var deferred = q.defer();
    pool.connect(function(err, client, done) {
        if (err) return deferred.reject(err);
        client.query(qry, function(err, result) {
            // console.log("db query =>", result)
            done();
            if (err) {
                return console.error('error running query', err);
            }
            return deferred.resolve(result.rows);
        });
    });
    pool.on('error', function(err, client) {
        console.error('idle client error', err.message, err.stack)
    });
    return deferred.promise;
}

/* Insert data to postgresql server */
function insert(qry) {
    var deferred = q.defer();
    pool.connect(function(err, client, done) {
        if (err) return deferred.reject(err);
        client.query(qry, function(err, result) {
            done();
            if (err) {
                return console.error('error running query', err);
            }
            return deferred.resolve(result);
        });
    });
    pool.on('error', function(err, client) {
        console.error('idle client error', err.message, err.stack)
    });
    return deferred.promise;
}

/* Export functions */
exports.select = select;
exports.insert = insert;
