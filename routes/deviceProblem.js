var dbQuery = require('../services/pgdbQuery');

module.exports = {
    getProblemCategory: function(req, res) {
        var query = `select "Id", "problemCatCode", "problemCatName" from "mstProblemCategory"`;

        dbQuery.select(query).then(function(result) {
            if (result.length > 0) {
                return res.status(200).send({
                    data: result
                });
            } else {
                throw new Error('Record Not Found');
            }
        }).catch(function(error) {
            return res.status(200).send(error.toString());
        })
    },

    getProblemDesc: function(req, res) {
        var query = `select pc."problemCatCode", pc."problemCatName", pd."Id", pd."problemDescription" from
            "mstProblemCategory" pc join "msdProblemCategoryProblemDescriptionLink"
            link on pc."Id" = link."problemCategoryId"
            join "mstProblemDescription" pd on pd."Id" = link."problemDesciptionId"
            where pc."problemCatCode" = '${req.params.code}'`;

        dbQuery.select(query).then(function(result) {
            if (result.length > 0) {
                return res.status(200).send({
                    data: result
                });
            } else {
                throw new Error('Problem Code Invalid');
            }
        }).catch(function(error) {
            return res.status(200).send(error.toString());
        })

    }

}