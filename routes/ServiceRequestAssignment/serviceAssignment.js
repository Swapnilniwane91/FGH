    var dbQuery = require('../../services/pgdbQuery');
    var q = require('q');

    // url request for devicedetails 
    module.exports = {
        getServiceRequestList: function(req, res) {
            
            var clientId = req.session2.welcomeData.response.clientIds;
            var pfQuery = `select * from getservicerequestlist(clientId:=ARRAY[${clientId}])`;
            dbQuery.select(pfQuery).then(function(result) {                
                if (result.length > 0) {
                    return res.status(200).send({
                        data: result
                    });
                }
                else {
                      return res.status(200).send({
                        error:'Record Not Found'
                    });
                }
            }).catch(function(error) {
                return res.status(200).send({
                    error:error.toString()
                });
            })
        },
           pendingServiceRequestSelectList: function(req, res) {
            var pfQuery1 = `select * from fnpendingServiceRequestSelectList('${req.body.data.headId}')`;
            dbQuery.select(pfQuery1).then(function(result) {                
                if (result.length > 0) {
                    return res.status(200).send({
                        data: result
                    });
                }
                else {
                      return res.status(200).send({
                        error:'Record Not Found'
                    });
                }
            }).catch(function(error) {
                return res.status(200).send({
                    error:error.toString()
                });
            })
        },


        getServiceCenterbyarea: function(req,res){
                var dbgetCenter=`select * from fnserviceCenter('${req.body.data.pincode}')`;
                 dbQuery.select(dbgetCenter).then(function(result) {
            if (result.length > 0) {
                return res.status(200).send({
                    data: result
                });
            } else {
                return res.status(200).send({
                        error:'Record Not Found'
                    });
            }
        }).catch(function(error) {
            return res.status(200).send({
                error: error.toString()
            });
        })
        },
        getLogisticsbyarea: function(req,res){
                var dbgetLogistics=`select * from fnassignLogistic('${req.body.data.pincode}')`;
                 dbQuery.select(dbgetLogistics).then(function(result) {
            if (result.length > 0) {
                return res.status(200).send({
                    data: result
                });
            } else {
                return res.status(200).send({
                        error:'Record Not Found'
                    });
            }
        }).catch(function(error) {
            return res.status(200).send({
                error: error.toString()
            });
        })
        },
        assignServiceCenterToManager: function(req,res){
                var dbAssign=`select * from "assignServiceRequest"('${req.body.data.headId}','${req.body.data.assignToLogistic}','${req.body.data.assignBy}','${req.body.data.assignedToServiceCenter}')`;           
                 dbQuery.insert(dbAssign).then(function(result) {
            if (result.rows[0].assignServiceRequest=="Service assignment successfully") {
                return res.status(200).send({
                    message: "Service assignment successfully"
                });
            } else {
                return res.status(200).send({
                        error:'Update Error'
                    });
            }
        }).catch(function(error) {
            return res.status(200).send({
                error: error.toString()
            });
        })
        },
    }