var dbQuery = require('../../services/pgdbQuery');
var q = require('q');

/* Get service request document details */
function getServiceRequestDocument(req, res) {
    var pgQuery = `SELECT * from public."fngetServiceRequestDetails"('${req.body.data.ticketnumber}');`;
    dbQuery.select(pgQuery).then(function(result) {
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

/* Export function to route */
exports.getServiceRequestDocument = getServiceRequestDocument;
