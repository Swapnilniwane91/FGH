var validator = require('validator');
var imei = require('imei');
var q = require('q');

module.exports = {
    validate: function(userData, callback) {
        var obj = [];
        if (_.keys(userData).length < 1) {
            var result = {
                isData: false
            }
            obj.push(result);
        }

        if (userData.firstName == '' || userData.firstName == undefined || validator.isAlpha(userData.firstName) == false) {
            var result = {
                firstName: 'Please Enter First Name'
            }
            obj.push(result);
        }

        if (userData.lastName == '' || userData.lastName == undefined || validator.isAlpha(userData.lastName) == false) {
            var result = {
                lastName: 'Please Enter Last Name'
            }
            obj.push(result);
        }

        if (userData.customerContNo == '' || userData.customerContNo == undefined || validator.isNumeric(userData.customerContNo) == false) {
            var result = {
                ContactNumber: 'Please Enter valid contact Number'
            }
            obj.push(result);
        }

        if (userData.customerEmail == '' || userData.customerEmail == undefined || validator.isEmail(userData.customerEmail, [{ allow_display_name: false, allow_utf8_local_part: true, require_tld: true }]) == false) {
            var result = {
                customerEmail: 'Please Enter valid E-mail Address'
            }
            obj.push(result);
        }

        if (userData.pincode == '' || userData.pincode == undefined || validator.isLength(userData.pincode, { min: 6, max: 6 }) == false || validator.isNumeric(userData.pincode) == false) {
            var result = {
                pincode: 'Please Enter valid Pincode'
            }
            obj.push(result);
        }

        if (userData.purchaseDate == '' || userData.purchaseDate == undefined || validator.isDate(userData.purchaseDate) == false || validator.isBefore(userData.purchaseDate) == false) {
            var result = {
                purchaseDate: 'Please Enter valid Purchase Date'
            }
            obj.push(result);
        }

        if (userData.selectedModel == '' || userData.selectedModel == undefined || validator.isNumeric(userData.selectedModel) == false) {
            var result = {
                selectedModel: 'Please Enter valid Selected Model'
            }
            obj.push(result);
        }

        if (userData.selectedProduct == '' || userData.selectedProduct == undefined || validator.isNumeric(userData.selectedProduct) == false) {
            var result = {
                selectedProduct: 'Please Enter valid Selected Product'
            }
            obj.push(result);
        }

        if (userData.imeiNo == '' || userData.imeiNo == undefined || validator.isLength(userData.imeiNo, { min: 13, max: 15 }) == false || validator.isNumeric(userData.imeiNo) == false) {
            var result = {
                imeiNo: 'Please Enter valid Imei Number...'
            }
            obj.push(result);
        }

        if (userData.plan == '' || userData.plan == undefined || validator.isNumeric(userData.plan) == false) {
            var result = {
                plan: 'Please Enter valid Plan'
            }
            obj.push(result);
        }

        if (userData.oemId == '' || userData.oemId == undefined || validator.isNumeric(userData.oemId) == false) {
            var result = {
                oem: 'Please Enter valid oem'
            }
            obj.push(result);
        }

        // if (userData.pFamilyId == '' || userData.pFamilyId == undefined || validator.isNumeric(userData.pFamilyId) == false) {
        //     var result = {
        //         pFamily: 'Please Enter valid productFamily'
        //     }
        //     obj.push(result);
        // }

        if (userData.osId == '' || userData.osId == undefined || validator.isNumeric(userData.osId) == false) {
            var result = {
                os: 'Please Enter valid os'
            }
            obj.push(result);
        }

        if (userData.productCategoryId == '' || userData.productCategoryId == undefined || validator.isNumeric(userData.productCategoryId) == false) {
            var result = {
                productCategory: 'Please Enter valid productCategory'
            }
            obj.push(result);
        }

        if (userData.clientId == '' || userData.clientId == undefined || validator.isNumeric(userData.clientId) == false) {
            var result = {
                client: 'Please Enter valid client'
            }
            obj.push(result);
        }

        if (userData.paymentMode == '' || userData.paymentMode == undefined || validator.isAlpha(userData.paymentMode) == false) {
            var result = {
                paymentMode: 'Please Enter valid paymentMode'
            }
            obj.push(result);
        }

        // if (userData.policyDate == '' || userData.policyDate == undefined || validator.isDate(userData.policyDate) == false || validator.isBefore(userData.policyDate) == false) {
        //     var result = {
        //         policyDate: 'Please Enter valid policyDate'
        //     }
        //     obj.push(result);
        // }

        if (userData.amount == '' || userData.amount == undefined || validator.isFloat(userData.amount) == false) {
            var result = {
                amount: 'Please Enter valid amount'
            }
            obj.push(result);
        }
        if (userData.filePath == '' || userData.filePath == undefined) {
            var result = {
                filePath: 'Please Enter File Path'
            }
            obj.push(result);
        }
        return callback(obj);
    },

    isData: function(data, callback) {
        var deferred = q.defer();
        if (_.keys(data).length < 1) {
            var result = {
                isData: false
            }
            return callback(result);
        } else {
            var result = {
                isData: true
            }
            return callback(result);
        }

    },
    isEmpty: function(data, callback) {
        var deferred = q.defer();
        if (data == '' || data == undefined) {
            var result = {
                isEmpty: true
            }
            return callback(result);
        } else {
            var result = {
                isEmpty: false
            }
            return callback(result);
        }
    },

    isNumber: function(data, callback) {
        var deferred = q.defer();
        if (data == '' || data == undefined || validator.isNumeric(data) == false) {
            var result = {
                isNumber: false
            }
            return callback(result);
        } else {
            var result = {
                isNumber: true
            }
            return callback(result);
        }
    },

    isString: function(data, callback) {
        var deferred = q.defer();
        if (data == '' || data == undefined || _.isString(data) == false) {
            var result = {
                isString: false
            }
            return callback(result);
        } else {
            var result = {
                isString: true
            }
            return callback(result);
        }
    },

    isDate: function(data, callback) {
        var deferred = q.defer();
        if (data == '' || data == undefined || validator.isDate(data) == false) {
            var result = {
                isDate: false
            }
            return callback(result);
        } else {
            var result = {
                isDate: true
            }
            return callback(result);
        }
    },

    isImei: function(data, callback) {
        var deferred = q.defer();
        if (data == '' || data == undefined || imei.isValid(data) == false) {
            var result = {
                isImei: false
            }
            return callback(result);
        } else {
            var result = {
                isImei: true
            }
            return callback(result);
        }
    },

    isLength: function(data, length, callback) {
        var deferred = q.defer();
        if (data == '' || data == undefined || validator.isLength(data, { min: length, max: length }) == false || validator.isNumeric(data) == false) {
            var result = {
                isLength: false
            }
            return callback(result);
        } else {
            var result = {
                isLength: true
            }
            return callback(result);
        }
    },
    isEmail: function(data, callback) {
        var deferred = q.defer();
        if (data == '' || data == undefined || validator.isEmail(data, [{ allow_display_name: false, allow_utf8_local_part: true, require_tld: true }]) == false) {
            var result = {
                isEmail: false
            }
            return callback(result);
        } else {
            var result = {
                isEmail: true
            }
            return callback(result);
        }
    },

}