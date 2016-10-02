var dbQuery = require('../../services/pgdbQuery');
var q = require('q');

module.exports = {
    checkSerialOrImeiNo: function(req, res) {
        if (_.keys(req.body.data).length < 1  ) {
                return res.status(200).send({
                    code: 400,
                    error: 'Invalid request.'
                });
            }
        var serialOrIMEINo = req.body.data.serialOrIMEINo;
        var query = `select * from public.validateSerialOrIMEINo('${serialOrIMEINo}')`;

        dbQuery.select(query).then(function(result) {
            if (result.length > 0) {
                if (result[0].validateserialorimeino != 'valid') {
                    data = {
                        'data': {
                            'message': result[0].validateserialorimeino,
                        }
                    }
                    return res.status(200).send(data);
                } else {
                    fetchServiceRequestData(serialOrIMEINo)
                        .then(function(data) {
                            return res.send(data);
                        });
                }
            } else {
                throw new Error('An Error Occurred, Contact Admin');
            }
        }).catch(function(error) {
            return res.status(200).send({
                error: error.toString()
            });
        })
    },
}

/* fetch data using serial / IMEI number */
var fetchServiceRequestData = function(serialOrIMEINo) {

        var deferred = q.defer();
        var query = `select * from public.getcustomerproductdetails('${serialOrIMEINo}')`;

        dbQuery.select(query).then(function(result) {
            if (result.length > 0) {
                data = {
                    'data': {
                        'message': 'valid',
                        'response': {
                            serialNo: result[0].serialNo,
                            customerName: result[0].customerName,
                            contactNo: result[0].contactNo,
                            emailId: result[0].emailId,
                            customerId: result[0].customerId,
                            alternateContactNo: result[0].alternateContactNo,
                            productId: result[0].productId,
                            productName: result[0].productName,
                            modelId: result[0].modelId,
                            modelName: result[0].modelName,
                            oemId: result[0].oemId,
                            oemName: result[0].oemName,
                            dop: result[0].dop,            
                            pincode: result[0].pincode,
                            customerTypeId: result[0].customerTypeId,
                            planName: result[0].planName,
                            planId: result[0].planId,
                            address1: result[0].address1,
                            clientId:result[0].clientId,
                            clientName:result[0].clientName,
                        }
                    }
                }
                deferred.resolve(data);
            }
        }).catch(function(error) {
            return res.status(400).send({
                code: 400,
                error: error.toString()
            });
        })
        return deferred.promise;
    }
    /*end */