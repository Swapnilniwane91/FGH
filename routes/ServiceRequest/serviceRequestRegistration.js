var dbQuery = require('../../services/pgdbQuery');
var q = require('q');

module.exports = {
    serviceRequestRegistration: function(req, res) {
        if (_.keys(req.body.data).length < 1) {
            return res.status(200).send({
                code: 400,
                error: 'Invalid request.'
            });
        }
        var serialOrIMEINo = req.body.data.imeiOrSerialNumber;
        var customerName = req.body.data.customerName;
        var emailId = req.body.data.emailId;
        var contactNo = req.body.data.contactNo;
        var alternateContactNo = req.body.data.alternateContactNo;
        var whichAddress = req.body.data.whichAddreqs;
        var address = req.body.data.address1;
        var pincode = req.body.data.pincode;
        var alternateAddress = req.body.data.address2;
        var alternatePincode = req.body.data.pincode2;
        var oemName = req.body.data.oemName;
        var modelName = req.body.data.modelName;
        var planName = req.body.data.planName;
        var productName = req.body.data.productName;
        var problemDetails = req.body.data.problems;
        var cases = req.body.data.case;
        var remarks = req.body.data.remarks;
        var otherProblem = req.body.data.otherProblem;
        var modelId = req.body.data.modelId;
        var isLoaner = req.body.data.isLoaner;
        var clientId =  req.body.data.clientId;
        var userId = req.session2.welcomeData.userId;
        var whichAddress = req.body.data.whichAddress;
        var damageDate = req.body.data.damageDate;
        var isAlternateAddress = false;
        var isPickupRequire = false;
        var isTheft = false;
        if (whichAddress == 'alter') {
            isAlternateAddress = true;
        }
        if (cases == 'serviceCall') {
            isPickupRequire = true;
        } else if (cases == 'stolen') {
            isTheft = true;
        }

        var query = `select * from public.insertServiceRequestDetails(serialOrIMEINo:='${serialOrIMEINo}',customerName:='${customerName}',emailId:='${emailId}',
        contactNo:='${contactNo}',alternateContactNo:='${alternateContactNo}',address1:='${address}',pincode1:='${pincode}',address2:='${alternateAddress}',pincode2:='${alternatePincode}',
        oem:='${oemName}',modelName:='${modelName}',planName:='${planName}',productName:='${productName}',remarks:='${remarks}',otherProblem:='${otherProblem}',
        modelId:=${modelId},loaner:=${isLoaner},clientId:=${clientId},userId:=${userId},isTheft:=${isTheft},damageDate:='${damageDate}',pickupRequire:=${isPickupRequire},
        isAlternateAddress:=${isAlternateAddress},problemDetails:='${JSON.stringify(problemDetails)}')`;
        dbQuery.select(query).then(function(result) {
            if (result.length > 0) {
                
                data = {
                    'data': {
                        code:200,
                        'message': result[0].insertservicerequestdetails,
                    }
                }
                return res.status(200).send(data);

            } else {
                throw new Error('An Error Occurred, Contact Admin');
            }
        }).catch(function(error) {
            return res.status(200).send({
                error: error.toString()
            });
        })
    }
}