    var dbQuery = require('../../services/pgdbQuery');
    var q = require('q');

    // url request for devicedetails 
    module.exports = {
        getServiceRequestFromASP: function(req, res) {
            
            var clientId = req.session2.welcomeData.response.clientIds;
            var userId = req.body.data.userId;
            var pfQuery = `select * from unitPickupFromASPInsert(clientId:=ARRAY[${clientId}],logisticId:=${userId})`;
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
    // url BIND checklist 
    bindCheckList: function(req, res) {
            var pageName=req.body.data.pageName;
            var pfQuery=`select * from "mstChecklistForPageSelectList"('${pageName}')`;
            dbQuery.select(pfQuery).then(function(result) {              
                if (result.length > 0) {
                    return res.status(200).send({
                        data: result
                    });
                }
                else {
                      return res.status(200).send({
                        error:'CheckList Not Bind'
                    });
                }
            }).catch(function(error) {
                return res.status(400).send({
                    error:error.toString()
                });
            })
        },
// BIND Loaner SerialNumbers
bindLoanerSerialNo: function(req,res){
                var userId=req.body.data.userId;
                var dbLoanerNo=`select * from "bindLoaners"('${req.body.data.userId}')`;
                 dbQuery.select(dbLoanerNo).then(function(result) {
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

    }