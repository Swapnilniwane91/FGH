var dbQuery = require('../services/pgdbQuery');

module.exports = {
    pincodeMap: function(req, res) {

        var query = `select dis.district,sts.state,con.country from "mstPincode" pin
            join "mstState" sts On sts."Id" = pin."stateId"
            join "mstDistrict" dis on dis."Id" = pin."districtId"
            JOIN "mstCountry" con on con."Id" = pin."countryId"
            where pin.pincode='${req.body.pincode}' limit 1`;

        dbQuery.select(query).then(function(result) {
            if (result.length > 0) {
                return res.status(200).send({
                    data: result
                });
            } else {
                throw new Error('Pin Code Not Available');
            }
        }).catch(function(error) {
            return res.status(200).send({
                error: error.toString()
            });
        })
    },

}
