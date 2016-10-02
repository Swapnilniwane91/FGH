var https = require('https');
var express = require('express');
var bodyParser = require('body-parser');
global._ = require('underscore');
global.q = require('q');
global.moment = require('moment');
global.fs = require('fs');

var sessionmanager = require('./services/sessionManager.js');

//------get session value
var session = require('express-session');
var MemoryStore = require('express-session').MemoryStore;
var sessionStore = new MemoryStore();

var cors = require('cors');
var app = express();
app.use(cors());

//===========Creating user Session ==============
function sessionHandler(req, res, next) {
    sessionMiddleware(req, res, next);
};

var sessionMiddleware = session({
    store: sessionStore,
    secret: 'keyboard_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 60 * 60 * 1000
    }
});

function sessionHandler(req, res, next) {
    sessionMiddleware(req, res, next);
};

function IsAuthenticated(req, res, next) {
    sessionmanager.getAllSession();
    sessionID = req.headers.sessionid;
    if (sessionStore.sessions[sessionID]) {
        var sesss = sessionmanager.getSession(req.headers.sessionid);
        req.session2 = JSON.parse(sesss);
        next();
    } else {
        res.send('auth fail redirect to login');
    }
}

app.use(bodyParser.raw({
    limit: '50mb'
}))
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));

//test api
app.get('/esp/api', function(req, res) {
    res.status(200).send("Welcome to ESP API");
});

//logged user session
app.post('/esp/api/loginUser', sessionHandler, require('./routes/loginUser').loginUser);

//user
var user = require('./routes/user');
app.get('/esp/api/user_list', user.userList);
app.post('/esp/api/create_user', user.createUser);

//service request Assignment
var serviceassignmentlist = require('./routes/ServiceRequestAssignment/serviceAssignment');
app.post('/esp/api/getServiceRequestList', IsAuthenticated, serviceassignmentlist.getServiceRequestList);

// service details Assignment
var pendingServiceRequestSelect = require('./routes/ServiceRequestAssignment/serviceAssignment');
app.post('/esp/api/pendingServiceRequestSelectList', IsAuthenticated, pendingServiceRequestSelect.pendingServiceRequestSelectList);

// get service center
var serviceCenter = require('./routes/ServiceRequestAssignment/serviceAssignment');
app.post('/esp/api/getServiceCenterbyarea', IsAuthenticated, serviceCenter.getServiceCenterbyarea);

//get logistics
var logistics = require('./routes/ServiceRequestAssignment/serviceAssignment');
app.post('/esp/api/getLogisticsbyarea', IsAuthenticated, logistics.getLogisticsbyarea);

//final assignment
var assignServiceCenterToMangr = require('./routes/ServiceRequestAssignment/serviceAssignment');
app.post('/esp/api/assignServiceCenterToManager', IsAuthenticated, assignServiceCenterToMangr.assignServiceCenterToManager);

//insurance Claim Approval
var getAllClaim = require('./routes/insuranceClaimApproval/getAllClaim');
app.get('/esp/api/getAllClaims', IsAuthenticated, getAllClaim.getAllClaim);
app.post('/esp/api/viewClaim', IsAuthenticated, getAllClaim.getClaimDetail);
app.post('/esp/api/claimApproval', IsAuthenticated, getAllClaim.claimApproval);

//unitPickupFromASP as Stror
var unitPickupFromASP = require('./routes/ServiceRequestPickupAndDrop/ServicePickup');
app.post('/esp/api/getServiceRequestFromASP', IsAuthenticated, unitPickupFromASP.getServiceRequestFromASP);

// Bind CheckList for unitPickupFromASP
var bindCheckListData = require('./routes/ServiceRequestPickupAndDrop/ServicePickup');
app.post('/esp/api/bindCheckList', IsAuthenticated, bindCheckListData.bindCheckList);
// Bind Loaner Serial No
var bindLoaner = require('./routes/ServiceRequestPickupAndDrop/ServicePickup');
app.post('/esp/api/bindLoanerSerialNo',bindLoaner.bindLoanerSerialNo);
//pincode
var pincode = require('./routes/pincode');
app.post('/esp/api/pincode_map', pincode.pincodeMap)

//create joby
var create_job = require('./routes/create_job');
app.post('/esp/api/create_new_job', create_job.create_new_job);

//create job
var validateSerialOrImeiNo = require('./routes/ServiceRequest/validateSerialOrImeiNo');
app.post('/esp/api/validateSerialOrImeiNo', IsAuthenticated, validateSerialOrImeiNo.checkSerialOrImeiNo);

var serviceRequestRegistration = require('./routes/ServiceRequest/serviceRequestRegistration');
app.post('/esp/api/serviceRequestRegistration', IsAuthenticated, serviceRequestRegistration.serviceRequestRegistration);

//IMEI Details
var imei = require('./routes/imei');
app.post('/esp/api/imei_details', imei.getIMEIInfo);
app.post('/esp/api/check_imei', imei.CheckIMEI);

//device Problem category and description
var device = require('./routes/deviceProblem');
app.get('/esp/api/device_problem', device.getProblemCategory);
app.get('/esp/api/device_problem/:code', device.getProblemDesc);

//sales
var sales = require('./routes/sales');
app.get('/esp/api/getProductCategory', sales.ProductCategory);
app.post('/esp/api/getClient', sales.clientInfo);
app.get('/esp/api/getEWPlans/:id', sales.getEWPlans);
app.get('/esp/api/getPolicyPlans/:id', sales.getPolicyPlans);
app.post('/esp/api/generatePolicy', IsAuthenticated, sales.salePolicy);

//sale invoice
var saleInvoice = require('./routes/saleInvoice');

// Device details
var deviceDetails = require('./routes/deviceDetails');
app.get('/esp/api/get_oem', deviceDetails.getOEM);
app.get('/esp/api/get_product_family', deviceDetails.getProductFamily);
app.get('/esp/api/get_product/:id', deviceDetails.getProduct);
app.get('/esp/api/get_model/:id', deviceDetails.getModel);
app.get('/esp/api/get_OS', deviceDetails.getOS);

// File Upload
var fileuploader = require('./services/fileUpload');
app.post('/esp/api/uploadfile', fileuploader.fileUpload);

// Upload Doc
var uploadservice = require('./services/commonUtilities');
app.post('/esp/api/uploaddoc', uploadservice.uploaddoc);

/* Pickup & Drop - Logistic */
var logistic = require('./routes/ServiceRequestPickupAndDrop/serviceRequestDocument');
app.post('/esp/api/getServiceRequestDocument', logistic.getServiceRequestDocument);

// Start server
var portno = process.env.PORT || 3030;
app.listen(portno);

module.exports = exports;
exports.sessionStore = sessionStore;
console.log('API is running on port ' + portno);
