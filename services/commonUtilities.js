// var sessionManager = require('../services/sessionManager');
var path = require('path');
var Busboy = require('busboy');
var folderPath = 'public/images/';

// function fileExists(filePath) {
//     try {
//         return fs.statSync(filePath).isFile();
//     } catch (err) {
//         return false;
//     }
// }

var uploaddoc = function(req, res) {

    if (req.headers['content-type'] == null) {
        return res.send({
            error: " null content-type"
        });
    }
    // console.log('headers >> ', req.headers);
    if (req.headers['content-type'].indexOf("multipart/form-data") < 0) {
        return res.send({
            error: " wrong content-type"
        });
    }

    // if (req.headers['sessionid'] == null) {
    //     return res.send({
    //         error: " null sessionid  "
    //     });
    // }

    // if (req.headers['customerid'] == null) {
    //     return res.send({
    //         error: " null customerid  "
    //     });
    // }

    var fileurl;
    var userFolderPath = folderPath;
    fs.existsSync(userFolderPath) || fs.mkdirSync(userFolderPath);

    var fstream;
    var files = [];
    var busboy = new Busboy({
        headers: req.headers
    });

    busboy.on('file', function(fieldname, file, filename) {
        // function fileExists(filePath) {
        //     try {
        //         return fs.statSync(filePath).isFile();
        //     } catch (err) {
        //         return false;
        //     }
        // }
        filename = moment(moment.now()).format('YYYYMMDDHHMMSS') + '_' + filename.substring(0, filename.lastIndexOf('.')).replace(/-/g, '_').replace(/ /g, '_') + '.' + filename.substring(filename.lastIndexOf('.') + 1);
        fileurl = userFolderPath + filename;
        fstream = fs.createWriteStream(fileurl);
        file.pipe(fstream);
        fstream.on('close', function() {
            files.push(filename);
        });

        // fstream.on('error', function(err) {
        //     var resObj = {
        //         code: 0,
        //         msg: err.stack,
        //         result: {}
        //     };
        //     res.send(resObj);
        // });
    });
    // busboy.on('end', function(){console.log('END')});
    busboy.on('finish', function() {
        // res.writeHead(200, { 'Connection': 'close' });
        res.send({
            message: "File uploaded.",
            filename: '../' + fileurl
        });
    });

    // busboy.on('error', function() {
    //     res.send({
    //         message: "Please select file to upload."
    //     });
    // });
    return req.pipe(busboy);
}

//
// var uploadservicegetfiles = function(req, res) {
//     console.log('uploadservicegetfiles', req.headers)
//
//     var custid = req.body.data.customerId //"CUS0000000013" //asdasdsad  via sessionid
//     var userFolderPath = folderPath + custid + "/"
//     fs.existsSync(userFolderPath) || fs.mkdirSync(userFolderPath);
//
//     function readFiles(dirname, onFileContent, onError) {
//         fs.readdir(dirname, function(err, filenames) {
//             if (err) {
//                 onError(err);
//                 return res.send('error uploadservice');
//             }
//             allfiles = {}
//             allfiles.files = []
//
//             filenames.forEach(function(filename) {
//
//                 var stats = fs.statSync(dirname + filename)
//                 var fileSizeInBytes = stats["size"]
//                 var fileSizeInMegabytes = fileSizeInBytes / 1000000.0
//                 var filenameresz = {
//                     'fileName': filename,
//                     'uploadedTime': stats.ctime,
//                     //'createdTime': stats.birthtime,
//                     'Content-Type': stats.birthtime,
//
//                     'fileSizeInMegabytes': fileSizeInMegabytes
//                 }
//                 console.log(stats)
//
//                 allfiles.files.push(filenameresz)
//             });
//             onFileContent(allfiles, 'content');
//         });
//     }
//
//
//     var data = {};
//     readFiles(userFolderPath, function(filenames, content) {
//         console.log('filename', filenames)
//         res.send(filenames)
//
//     }, function(error) {
//         res.send({
//             error: {
//                 error: error,
//                 'location': 'uploadservice'
//             }
//         })
//     });
// }
//
// var uploadservicedownloadfiles = function(req, res) {
//     console.log('uploadservicedownloadfiles', req.headers)
//     var custid = req.body.data.customerId //"CUS0000000013" //asdasdsad  via sessionid
//     var userFolderPath = folderPath + custid + "/"
//     fs.existsSync(userFolderPath) || fs.mkdirSync(userFolderPath);
//
//     filename = req.body.data.fileName
//     var file = userFolderPath + filename;
//
//     var stat = fs.statSync(file);
//     //  res.set('Content-Type', 'image/jpeg');
//     // res.set('Content-Length', stat.size);
//     // res.set('Content-Disposition', filename)
//
//     $.debug('res', res.headers)
//
//
//     $.debug('download', file)
//         //  res.download(file); // Set disposition and send it.
//     res.download(file, function(err) {
//         $.debug(err, res.headers)
//             // Don't need res.end() here since already sent
//     });
//
//
//
// }
//
//

// Return router
module.exports.uploaddoc = uploaddoc;
// module.exports.uploadservicegetfiles = uploadservicegetfiles;
// module.exports.uploadservicedownloadfiles = uploadservicedownloadfiles;
