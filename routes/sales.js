var dbQuery = require('../services/pgdbQuery');
var validate = require('../services/validation.js');
var q = require('q');

module.exports = {
    ProductCategory: function(req, res) {
        var query = `SELECT "Id", "productCategoryName" FROM public."mstProductCategory"`;

        dbQuery.select(query).then(function(result) {
            if (result.length > 0) {
                return res.status(200).send({
                    data: result
                });
            } else {
                throw new Error('Product Category Not Available');
            }
        }).catch(function(error) {
            return res.status(200).send({
                error: error.toString()
            });
        })
    },

    clientInfo: function(req, res) {
        var query = ` select DISTINCT "mstClient"."Id","mstClient"."clientName" from "mstProductCategorybyClientMapping" msd
                    INNER join "mstProductCategory" on "mstProductCategory"."Id" = msd."productCategoryId"
                    INNER join "mstClient" on "mstClient"."Id" = msd."clientId"
                    where msd."productCategoryId" = '${req.body.proCatId}' and "mstClient"."Id" in (${req.body.clientsId})`;

        dbQuery.select(query).then(function(result) {
            if (result.length > 0) {
                return res.status(200).send({
                    data: result
                });
            } else {
                throw new Error('Client info Not Available');
            }
        }).catch(function(error) {
            return res.status(200).send({
                error: error.toString()
            });
        })
    },

    salePolicy: function(req, res) {
        var requestdata = req.body;
        var currentUser = req.session2.userData.details;
        if (_.keys(requestdata).length < 1) {
            return res.status(200).send({
                code: 400,
                error: 'Invalid request.'
            });
        } else {
            var policy_data = {};
            var extrafield = {};
            if (req.body.data[1].pFamilyId) {
                extrafield.pFamilyId = req.body.data[1].pFamilyId;
            } else {
                extrafield.pFamilyId = 0;
            }
            if (req.body.data[4].policyDate) {
                extrafield.policyDate = req.body.data[4].policyDate;
            } else {
                extrafield.policyDate = ' ';
            }
            if (req.body.data[4].policyId) {
                extrafield.policyId = req.body.data[4].policyId;
            } else {
                extrafield.policyId = ' ';
            }
            policy_data.firstName = req.body.data[2].firstName;
            policy_data.lastName = req.body.data[2].lastName;
            policy_data.customerContNo = req.body.data[2].contactNo;
            policy_data.customerEmail = req.body.data[2].email;
            policy_data.pincode = req.body.data[3].pinCode;
            policy_data.purchaseDate = req.body.data[1].dop;
            policy_data.selectedModel = req.body.data[1].modelId;
            policy_data.selectedProduct = req.body.data[1].productId;
            policy_data.imeiNo = req.body.data[1].imeiNo;
            policy_data.amount = req.body.data[4].amount;
            policy_data.policyDate = req.body.data[4].policyDate;
            policy_data.plan = req.body.data[4].plan;
            policy_data.paymentMode = req.body.data[4].paymentMode;
            policy_data.oemId = req.body.data[1].oemId;
            policy_data.pFamilyId = req.body.data[1].pFamilyId;
            policy_data.osId = req.body.data[1].osId;
            policy_data.productCategoryId = req.body.data[0].productCategoryId;
            policy_data.clientId = req.body.data[0].clientId;
            policy_data.filePath = req.body.data[1].filePath;

            validate.validate(policy_data, function(ismatch) {
                if (ismatch.length > 0) {
                    return res.status(200).send({
                        Error: ismatch
                    });
                } else {
                    sale(requestdata, currentUser, extrafield)
                        .then(function(data) {
                            return res.send(data);
                        })
                        .catch(function(error) {
                            res.send({
                                error: {
                                    error: error
                                },
                                status: {
                                    code: 400,
                                    message: 'Consumer Detail is not Inserted',
                                    flag: false
                                }
                            });
                        })
                        .done();
                }
            });
        }
    },

    getEWPlans: function(req, res) {
        var query = `select DISTINCT "mstPlan"."Id","mstPlan"."planName" from "mstPlan" 
            INNER join "msdModelPlanMapping" on "msdModelPlanMapping"."planId" = "mstPlan"."Id"
            where "msdModelPlanMapping"."modelId" = '${req.params.id}'`;

        dbQuery.select(query).then(function(result) {
            if (result.length > 0) {
                return res.status(200).send({
                    data: result
                });
            } else {
                throw new Error('Plan Not Available');
            }
        }).catch(function(error) {
            return res.status(200).send({
                error: error.toString()
            });
        })
    },

    getPolicyPlans: function(req, res) {
        var query = `select * from "mstPlan" where "productCategoryId"='${req.params.id}'`;

        dbQuery.select(query).then(function(result) {
            if (result.length > 0) {
                return res.status(200).send({
                    data: result
                });
            } else {
                throw new Error('Plan Not Available');
            }
        }).catch(function(error) {
            return res.status(200).send({
                error: error.toString()
            });
        })
    }
}

// Functions...
var sale = function(requestdata, currentUser, extrafield) {
    var deferred = q.defer();
    var address1 = ' ';
    address1 = "" + requestdata.data[3].dnumber + " ," + requestdata.data[3].street + "," + requestdata.data[3].address2 + "";
    if (extrafield.policyDate == ' ') {
        var query = `select * from sale_EW_invoice('${currentUser.userId}','${currentUser.stateId}','${currentUser.countryId}','${ requestdata.data[2].firstName }','${ requestdata.data[2].lastName }','${ requestdata.data[2].contactNo }','${ requestdata.data[2].email }',
    '${ address1}','${ requestdata.data[3].dnumber}','${ requestdata.data[3].street}','${ requestdata.data[3].pinCode}',
    '${ requestdata.data[1].dop}','${ requestdata.data[1].oemId }','${ extrafield.pFamilyId }','${ requestdata.data[1].osId }','${ requestdata.data[1].modelId}','${ requestdata.data[1].productId }','${ requestdata.data[1].filePath}','${ requestdata.data[1].imeiNo }',
    '${ requestdata.data[0].productCategoryId }','${ requestdata.data[0].clientId }',
    '${ requestdata.data[4].plan }','${ requestdata.data[4].paymentMode }',${ requestdata.data[4].amount });`
        dbQuery.select(query).then(function(result) {
            if (result[0].sale_ew_invoice == '[0:0]=0') {
                var data = {
                    message: "Email is already registered",
                    flag: false
                }
                deferred.resolve(data);
            } else {
                var data = {
                    status: 200,
                    message: "Extended Warrenty sold successfully",
                    customer_invoice: result[0],
                    flag: true
                }
                deferred.resolve(data);
            }
        })
        return deferred.promise;
    } else {
        var query = `select * from sale_policy_invoice('${currentUser.userId}','${currentUser.stateId}','${currentUser.countryId}','${extrafield.policyDate}','${extrafield.policyId}','${ requestdata.data[2].firstName }','${ requestdata.data[2].lastName }','${ requestdata.data[2].contactNo }','${ requestdata.data[2].email }',
    '${ address1}','${ requestdata.data[3].dnumber}','${ requestdata.data[3].street}','${ requestdata.data[3].pinCode}',
    '${ requestdata.data[1].dop}','${ requestdata.data[1].oemId }','${ extrafield.pFamilyId }','${ requestdata.data[1].osId }','${ requestdata.data[1].modelId}','${ requestdata.data[1].productId }','${requestdata.data[1].filePath}','${ requestdata.data[1].imeiNo }',
    '${ requestdata.data[0].productCategoryId }','${ requestdata.data[0].clientId }',
    '${ requestdata.data[4].plan }','${ requestdata.data[4].paymentMode }',${ requestdata.data[4].amount });`
        dbQuery.select(query).then(function(result) {
            if (result[0].sale_policy_invoice[0] == '[0:0]=0') {
                var data = {
                    message: "Email is already registered",
                    flag: false
                }
                deferred.resolve(data);
            } else {
                var data = {
                    status: 200,
                    message: "Policy sold successfully",
                    customer_invoice: result[0],
                    flag: true
                }
                deferred.resolve(data);
            }

        })
        return deferred.promise;
    }

}