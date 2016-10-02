    var dbQuery = require('../services/pgdbQuery');
    var q = require('q');

    // url request for new job creation
    module.exports = {
        create_new_job: function(req, res) {
            var requestdata = req.body.data;
            var trhpickuprequestheadid = '';
            var trhpickuprequestheadidupdated = '';
            var pickuprequestdetailid = '';
            var problempickuprequestmappingid = '';
            var processdetailid = '';
            var ticketnumber = '';
            check_imei(requestdata)
                .then(function(data) {
                    if (data.length > 0) {
                        return res.send({
                            status: 200,
                            message: "Job is already Open"
                        });
                    } else {
                        insert_trhpickuprequesthead(requestdata)
                            .then(function(data) {
                                trhpickuprequestheadid = data.rows[0].pickupRequestHeadID;
                                return update_trhpickuprequesthead(data, trhpickuprequestheadid)
                            })
                            .then(function(data) {
                                trhpickuprequestheadidupdated = data.rows[0].pickupRequestHeadID;
                                return insert_trdpickuprequestdetail(data, trhpickuprequestheadidupdated, requestdata)
                            })
                            .then(function(data) {
                                pickuprequestdetailid = data.data.pickupRequestDetailId;
                                return insert_trdproblempickuprequestmapping(data, pickuprequestdetailid, requestdata)
                            })
                            .then(function(data) {
                                problempickuprequestmappingid = data.data.id;
                                return updatetkno_trdpickuprequestdetail(data, pickuprequestdetailid, requestdata)
                            })
                            .then(function(data) {
                                ticketnumber = data.data;
                                return insert_trdprocessdetail(trhpickuprequestheadid, pickuprequestdetailid, requestdata)
                            })
                            .then(function(data) {
                                processdetailid = data.data.processDetailID;
                                return update_trdprocessdetail(data, processdetailid, requestdata)
                            })
                            .then(function(data) {
                                return res.send({
                                    status: 200,
                                    message: "Job is created sucessfully",
                                    Service_Request_Number: ticketnumber
                                });
                            })
                            .catch(function(error) {
                                res.send({
                                    error: {
                                        error: error
                                    },
                                    status: {
                                        code: 400,
                                        message: 'Job is not Created'
                                    }
                                });
                            })
                            .done();

                    }
                })
                .catch(function(error) {
                    res.send({
                        error: {
                            error: error
                        },
                        status: {
                            code: 400,
                            message: 'Job is not Created'
                        }
                    });
                })
                .done();

        },
    }

    // functions used in new job creation...
    var check_imei = function(requestdata) {
        var deferred = q.defer();
        var query = 'SELECT "serialNumber" FROM public."trdPickupRequestDetail" where "serialNumber" =\'' + requestdata.imeino + '\' AND "actionStatusId" != 11 and ("isCanceled" is null or true) order by "pickupRequestDetailId" desc limit 1';
        dbQuery.select(query).then(function(result) {
            if (result.length > 0) {
                var data = {
                    result: 1,
                    data: result,
                    message: "Imei is available",
                    flag: "success"
                }
                deferred.resolve(result);
            } else {
                deferred.resolve(result);
            }
        })
        return deferred.promise;
    }

    var insert_trhpickuprequesthead = function(trhpickuprequesthead) {
        var deferred = q.defer();
        var insertquery_trhpickuprequesthead = 'INSERT INTO public."trhPickupRequestHead"("aspID","pickupRequestStatusID","pickupRequestedBy", "pickupRequestedOn") VALUES (' + trhpickuprequesthead.aspid + ',' + trhpickuprequesthead.pickuprequeststatusid + ',' + trhpickuprequesthead.pickuprequestedby + ', null)RETURNING "pickupRequestHeadID"';
        dbQuery.insert(insertquery_trhpickuprequesthead).then(function(result) {
            if (result.rowCount > 0) {
                var data = {
                    data: result.rows[0],
                    message: "create_new_job trhpickuprequesthead is inserted",
                    flag: "success"
                }
                deferred.resolve(result);
            } else {
                var data = {
                    data: result,
                    message: "create_new_job trhpickuprequesthead is failed plz try again",
                    flag: "fail"
                }
                deferred.reject(data);
            }
        });
        return deferred.promise;
    }

    var update_trhpickuprequesthead = function(data, trhpickuprequestheadid) {
        var deferred = q.defer();
        var PRNumber = 'PR' + trhpickuprequestheadid;
        var PRN = "'" + PRNumber + "'";
        var updatequery_trhpickuprequesthead = 'Update public."trhPickupRequestHead" SET "pickupRequestNumber" = ' + PRN + ' where "pickupRequestHeadID" = ' + trhpickuprequestheadid + ' RETURNING "pickupRequestHeadID";';
        dbQuery.insert(updatequery_trhpickuprequesthead).then(function(result1) {
            if (result1.rowCount > 0) {
                var data = {
                    data: result1.rows[0],
                    message: "create_new_job trhpickuprequesthead is updated",
                    flag: "success"
                }
                deferred.resolve(result1);
            } else {
                var data = {
                    data: result1,
                    message: "create_new_job updatequery_trhpickuprequesthead is failed plz try again",
                    flag: "fail"
                }
                deferred.reject(data);
            }
        });
        return deferred.promise;
    }

    var insert_trdpickuprequestdetail = function(data, trhpickuprequestheadidupdated, requestdata) {
        var deferred = q.defer();
        var insertquery_trdpickuprequestdetail = 'INSERT INTO public."trdPickupRequestDetail"("pickupRequestHeadId", "productId", "modelId", "serialNumber", "actionStatusId", "createdBy", "createdOn", "assignedToLogistics", "assignedLogisticsOn", "customerName", "customerPhoneNo", "customerEmail", "remark1", "imeiNo", "warrantyStatus", "customerId", "oaCustomerId","oaMembershipId", "oaMembershipStartDate", "damageDate", "dop", "customerAddress", "alternateContactNo", "isBranchCollect", "pincode", "problemReported","deliveryAddress", "deliveryAreaId", "deliveryPincode", "assignedToManager", "isLoanerApplicable") VALUES ( ' + trhpickuprequestheadidupdated + ',' + requestdata.productid + ',' + requestdata.modelid + ',' + requestdata.serialnumber + ',' + requestdata.actionstatusid + ',' + requestdata.createdby + ',' + requestdata.createdon + ',' + requestdata.assignedtologistics + ',' + requestdata.assignedlogisticson + ',' + requestdata.customername + ',' + requestdata.customerphoneno + ',' + requestdata.customeremail + ',' + requestdata.remark1 + ',' + requestdata.imeino + ',' + requestdata.warrantyStatus + ',' + requestdata.customerid + ' , ' + requestdata.oacustomerid + ',' + requestdata.oamembershipid + ',' + requestdata.oamembershipstartdate + ',' + requestdata.damagedate + ',' + requestdata.dop + ',' + requestdata.customeraddress + ',' + requestdata.alternatecontactno + ',' + requestdata.isbranchcollect + ',' + requestdata.pincode + ',' + requestdata.problemreported + ',' + requestdata.deliveryaddress + ',' + requestdata.deliveryareaId + ',' + requestdata.deliverypincode + ',' + requestdata.assignedtomanager + ',' + requestdata.isloanerapplicable + ')RETURNING "pickupRequestDetailId"';

        dbQuery.insert(insertquery_trdpickuprequestdetail).then(function(result2) {
            if (result2.rowCount > 0) {
                var data = {
                    data: result2.rows[0],
                    message: "create_new_job trhpickuprequestdetail is inserted",
                    flag: "success"
                }
                deferred.resolve(data);
            } else {
                var data = {
                    data: result2,
                    message: "create_new_job insertquery_trdpickuprequestdetail is failed plz try again",
                    flag: "fail"
                }
                deferred.reject(data);
            }
        });
        return deferred.promise;
    }

    var insert_trdproblempickuprequestmapping = function(data, pickuprequestdetailid, requestdata) {
        var deferred = q.defer();
        var insertquery_trdproblempickuprequestmapping = 'INSERT INTO public."trdProblemPickupRequestMapping"("pickupRequestDetailId","probCateId","probDescId") VALUES (' + pickuprequestdetailid + ',' + requestdata.probcateid + ',' + requestdata.probdescid + ')RETURNING "id";';
        dbQuery.insert(insertquery_trdproblempickuprequestmapping).then(function(result3) {
            if (result3.rowCount > 0) {
                var data = {
                    data: result3.rows[0],
                    message: "create_new_job insertquery_trdproblempickuprequestmapping is inserted",
                    flag: "success"
                }
                deferred.resolve(data);
            } else {
                var data = {
                    data: result3,
                    message: "create_new_job insertquery_trdproblempickuprequestmapping is failed plz try again",
                    flag: "fail"
                }
                deferred.reject(data);
            }
        });
        return deferred.promise;
    }

    var updatetkno_trdpickuprequestdetail = function(data, pickuprequestdetailid, requestdata) {
        var deferred = q.defer();
        var TKNumber = 'SRN' + pickuprequestdetailid;
        var TKN = "'" + TKNumber + "'";
        var updatetkno_trdpickuprequestdetail = 'Update public."trdPickupRequestDetail" SET "ticketNumber" = ' + TKN + ' where "pickupRequestDetailId" = ' + pickuprequestdetailid + ';';
        dbQuery.insert(updatetkno_trdpickuprequestdetail).then(function(result4) {
            if (result4.rowCount > 0) {
                var data = {
                    data: TKNumber,
                    message: "create_new_job updatetkno_trdpickuprequestdetail is updated",
                    flag: "success"
                }
                deferred.resolve(data);
            } else {
                var data = {
                    data: result4,
                    message: "create_new_job updatetkno_trdpickuprequestdetail is failed plz try again",
                    flag: "fail"
                }
                deferred.reject(data);
            }
        });
        return deferred.promise;
    }

    var insert_trdprocessdetail = function(trhpickuprequestheadid, pickuprequestdetailid, requestdata) {
        var deferred = q.defer();
        var query = 'SELECT "userId" FROM public."mstUsers" WHERE "roleId"=6 AND "partnerId"=(SELECT "partnerId" FROM "mstUsers" WHERE "userId"=' + requestdata.createdby + ') limit 1;';
        selectid(query).then(function(data1) {
            var managerid = data1[0].userId;
            var insertquery_trdprocessdetail = 'INSERT INTO public."trdProcessDetail"("pickupRequestHeadID","pickupRequestDetailID","assignTo","assignedBy","assignedOn","actionStatusID","screeningLevel","screeningAssignStatus") VALUES (' + trhpickuprequestheadid + ',' + pickuprequestdetailid + ',' + managerid + ',' + requestdata.createdby + ',NULL,1,NULL,NULL) RETURNING "processDetailID"';
            dbQuery.insert(insertquery_trdprocessdetail).then(function(result5) {
                if (result5.rowCount > 0) {
                    var data = {
                        data: result5.rows[0],
                        message: "create_new_job insertquery_trdprocessdetail is inserted",
                        flag: "success"
                    }
                    deferred.resolve(data);
                } else {
                    var data = {
                        data: result5,
                        message: "create_new_job insertquery_trdprocessdetail is failed plz try again",
                        flag: "fail"
                    }
                    deferred.reject(data);
                }
            });
        });
        return deferred.promise;
    }

    var update_trdprocessdetail = function(data, processdetailid, requestdata) {
        var deferred = q.defer();
        var TRNumber = 'TRN' + processdetailid;
        var TRN = "'" + TRNumber + "'";
        var update_trdprocessdetail = 'Update public."trdProcessDetail" SET "processNumber" = ' + TRN + ' where "processDetailID" = ' + processdetailid + ';';
        dbQuery.insert(update_trdprocessdetail).then(function(result6) {
            if (result6.rowCount > 0) {
                var data = {
                    data: result6.rows[0],
                    message: "create_new_job update_trdprocessdetail is updated",
                    flag: "success"
                }
                deferred.resolve(data);
            } else {
                var data = {
                    data: result6,
                    message: "create_new_job update_trdprocessdetail is failed plz try again",
                    flag: "fail"
                }
                deferred.reject(data);
            }
        });
        return deferred.promise;
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