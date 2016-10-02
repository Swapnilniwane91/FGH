var dbQuery = require('../services/pgdbQuery');

module.exports = {
    createUser: function(req, res) {

        var query = `INSERT INTO public.mstusers(firstname, lastname, roleid, loginid, userpassword, email, isactive)
    VALUES ('${req.body.data.firstname}', '${req.body.data.lastname}', ${null}, '${req.body.data.loginid}', '${req.body.data.userpassword}', '${req.body.data.email}', '${req.body.data.isactive}')`;

        dbQuery.insert(query).then(function(result) {
            if (result.rowCount > 0) {
                return res.status(200).send({
                    data: result
                })
            } else {
                throw new Error('User Not Create');
            }
        }).catch(function(error) {
            return res.status(200).send(error.toString());
        })
    },

    userList: function(req, res) {
        var query = `select * from mstusers`;

        dbQuery.select(query).then(function(result) {
            if (result.length > 0) {
                return res.status(200).send({
                    data: result
                })
            } else {
                throw new Error('Record Not Found');
            }
        }).catch(function(error) {
            return res.status(200).send(error.toString());
        })
    },
}