var dbQuery = require('../services/pgdbQuery');

module.exports = {
    getIMEIInfo: function(req, res) {
        var query = `select case when serialno = '${req.body.data.imei}' then serialno else imeino end serialno,
            customername,customercontno, customeremail, customeraddress, cu.id as customerid,membershipid as oamembershipid,
            productid, alternatecontno as dop,modelid,pincode, cpl.customertypeid,cpl.planid,mstplan.planname from
            msdCustomerProductLink cpl left join mstcustomer cu on cpl.customerid =cu.id left join mstplan on
            cpl.planid=mstplan.planid where (serialno = '${req.body.data.imei}'or imeino ='${req.body.data.imei}')`;

        dbQuery.select(query).then(function(result) {
            if (result.length > 0) {
                return res.status(200).send({
                    data: result
                });
            } else {
                throw new Error('Invaild IMEI Number');
            }
        }).catch(function(error) {
            return res.status(200).send(error.toString());
        })
    },

    CheckIMEI: function(req, res) {

        var query = `select count(1) from "msdCustomerProductLink" where 
            "imeiNo" = '${req.body.imei}' AND "productCategoryId" = '${req.body.id}'`;

        dbQuery.select(query).then(function(result) {
            if (result[0].count > 0) {
                return res.status(200).send({
                    message: "IMEI Number Already Registered",
                    flag: false
                });
            } else {
                return res.status(200).send({
                    flag: true
                });
            }
        }).catch(function(error) {
            return res.status(200).send(error.toString());
        })
    }

}