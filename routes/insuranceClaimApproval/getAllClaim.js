    var dbQuery = require('../../services/pgdbQuery');
    var q = require('q');

    // url request for getAllClaim 
    module.exports = {
        getAllClaim: function(req, res) {
            var clientId = req.session2.welcomeData.response.clientIds;
            var role = req.session2.welcomeData.response.role;
            if (role.indexOf('insurance') == -1 && role.indexOf('callCenter') == -1) {
                return res.status(200).send({
                    error: 'You are not Authorised for this Page'
                });
            } else {
                var pfQuery = `select * from getAllClaims(clientId:=ARRAY[${clientId}])`;
                dbQuery.select(pfQuery).then(function(result) {
                    if (result.length > 0) {
                        return res.status(200).send({
                            data: result
                        });
                    } else {
                        return res.status(200).send({
                            error: 'Record Not Found'
                        });
                    }
                }).catch(function(error) {
                    return res.status(200).send({
                        error: error.toString()
                    });
                })
            }
        },

        getClaimDetail: function(req, res) {
            var clientId = req.session2.welcomeData.response.clientIds;
            var ticketNumber = req.body.data.ticketNumber;
            var role = req.session2.welcomeData.response.role;
            if (role.indexOf('insurance') == -1 && role.indexOf('callCenter') == -1) {
                return res.status(200).send({
                    error: 'You are not Authorised for this Page'
                });
            } else {
                var pfQuery = `select * from viewInsuranceClaimDetail('${ticketNumber}')`
                dbQuery.select(pfQuery).then(function(claim) {
                    if (claim.length > 0) {
                        var claimpfQuery = 'select * from public."trhUploadDoc" where "serviceRequestHeadId" = ' + claim[0].servicerequestheadid + '';
                        dbQuery.select(claimpfQuery).then(function(uploadDoc) {
                            if (uploadDoc.length > 0) {
                                return res.status(200).send({
                                    uploadDoc: uploadDoc,
                                    claim: claim
                                });

                            } else {
                                return res.status(200).send({
                                    uploadDoc: uploadDoc,
                                    claim: claim
                                });
                            }
                        }).catch(function(error) {
                            return res.status(200).send({
                                error: error.toString()
                            });
                        })
                    } else {
                        return res.status(200).send({
                            error: 'claim Record Not Found'
                        });
                    }
                }).catch(function(error) {
                    return res.status(200).send({
                        error: error.toString()
                    });
                })
            }
        },

        claimApproval: function(req, res) {
            var clientId = req.session2.welcomeData.response.clientIds;
            var ticketNumber = req.body.data.ticketNumber;
            var claimResult = req.body.data.claimResult;
            var role = req.session2.welcomeData.response.role;
            if (role.indexOf('insurance') == -1 && role.indexOf('callCenter') == -1) {
                return res.status(200).send({
                    error: 'You are not Authorised for this Page'
                });
            } else {
                var pfQuery = `select * from "insuranceClaimApproval"('${claimResult}','${ticketNumber}')`;
                dbQuery.select(pfQuery).then(function(claim) {
                    return res.status(200).send({
                        message: claim[0].insuranceClaimApproval
                    });
                }).catch(function(error) {
                    return res.status(200).send({
                        error: error.toString()
                    });
                })
            }
        },
    }