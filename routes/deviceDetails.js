    var dbQuery = require('../services/pgdbQuery');
    var q = require('q');

    // url request for devicedetails 
    module.exports = {

        getOEM: function(req, res) {
            var oemQuery = `select * from "mstOem" where "isActive" = true`;

            dbQuery.select(oemQuery).then(function(result) {
                if (result.length > 0) {
                    return res.status(200).send({
                        data: result
                    });
                } else {
                    throw new Error('Record Not Found');
                }
            }).catch(function(error) {
                return res.status(200).send({
                    error: error.toString()
                });
            })
        },

        getProductFamily: function(req, res) {
            var pfQuery = `select * from "mstProductFamily" where "isActive" = true`;

            dbQuery.select(pfQuery).then(function(result) {
                if (result.length > 0) {
                    return res.status(200).send({
                        data: result
                    });
                } else {
                    throw new Error('Record Not Found');
                }
            }).catch(function(error) {
                return res.status(200).send({
                    error: error.toString()
                });
            })
        },

        getProduct: function(req, res) {
            var pQuery = `select * from "mstProduct" where "oemId"='${req.params.id}' and "isActive" = true`;

            dbQuery.select(pQuery).then(function(result) {
                if (result.length > 0) {
                    return res.status(200).send({
                        data: result
                    });
                } else {
                    throw new Error('Record Not Found');
                }
            }).catch(function(error) {
                return res.status(200).send({
                    error: error.toString()
                });
            })
        },

        getModel: function(req, res) {
            var mQuery = `select * from "mstModel" where "productId"='${req.params.id}' and "isActive" = true`;

            dbQuery.select(mQuery).then(function(result) {
                if (result.length > 0) {
                    return res.status(200).send({
                        data: result
                    });
                } else {
                    throw new Error('Record Not Found');
                }
            }).catch(function(error) {
                return res.status(200).send({
                    error: error.toString()
                });
            })
        },

        getOS: function(req, res) {
            var osQuery = `select * from "mstOS" where "isActive" = true`;

            dbQuery.select(osQuery).then(function(result) {
                if (result.length > 0) {
                    return res.status(200).send({
                        data: result
                    });
                } else {
                    throw new Error('Record Not Found');
                }
            }).catch(function(error) {
                return res.status(200).send({
                    error: error.toString()
                });
            })
        }
    }


    //comman functions
    var selectid = function(query) {
        var deferred = q.defer();
        dbQuery.select(query).then(function(result) {
            if (result.length > 0) {
                deferred.resolve(result);
            } else {
                deferred.reject(result);
            }
        })
        return deferred.promise;
    }