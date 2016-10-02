var dbQuery = require('../services/pgdbQuery');
var q = require('q');
var welcomeData = {}
    //===============start of Main Method for call event============
module.exports = {

        loginUser: function(req, res) {
            if (_.keys(req.body.data).length < 1) {
                return res.status(200).send({
                    code: 400,
                    error: 'Invalid request.'
                });
            }

            var userData = {};
            userData.userName = req.body.data.username;
            userData.password = req.body.data.password;

            if (userData.userName == '' || userData.userName == undefined) {
                return res.status(400).send({
                    code: 400,
                    error: 'Please enter username.'
                });

            }
            if (userData.password == '' || userData.password == undefined) {
                return res.status(400).send({
                    code: 400,
                    error: 'Please enter password.'
                });
            }

            var query = `SELECT * FROM authenticateloginuser('${userData.userName}','${userData.password}')`;
            dbQuery.select(query)
                .then(function(result) {
                    if (result.length > 0) {
                        var clientId = result.map(function(item) {
                            return item.clientId;
                        });
                        var uniqueClientId = _.uniq(clientId);

                        var roleId = result.map(function(item) {
                            return item.roleId;
                        });
                        var uniqueroleId = _.uniq(roleId);

                        var role = result.map(function(item) {
                            return item.role;
                        });
                        var uniqueRole = _.uniq(role);

                        var pageUrls = result.map(function(item) {
                            return item.pageUrl;
                        });
                        var uniquePageUrl = _.uniq(pageUrls);
                        userData.operationId = "b2xop_" + _.random(100000, 999999)
                        userData.details = result.pop();
                        req.session.userData = userData;
                        welcomeData = {
                            'userId': userData.details.userId,
                            'userDetails': {
                                userName: userData.details.userName,
                                contactNo: userData.details.contactNo,
                                alternateContactNo: userData.details.alternateContactNo,
                                emailId: userData.details.emailId,
                                userImagePath: userData.details.userImage,
                                userAddress: userData.details.address,
                            },
                            'response': {
                                clientIds: uniqueClientId,
                                role: uniqueRole,
                                pageUrls: uniquePageUrl,
                                message: "Welcome : " + userData.details.userName,
                                sessionID: req.sessionID,
                                operationId: userData.operationId,
                            }
                        }
                        req.session.welcomeData = welcomeData;
                        return res.status(200).send(welcomeData);
                    } else {
                        return res.status(200).send({
                            code: 200,
                            error: 'Invaild username/password.'
                        });
                    }
                })
                .catch(function(error) {
                    return res.status(200).send(error.toString());
                })
                .done();
        }
    }
    //===============End of Main Method for call event============