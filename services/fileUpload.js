var multer = require('multer');
var dateFormat = require('dateformat');

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/images/upload')
    },
    filename: function(req, file, cb) {
        var Date = dateFormat();
        var Date = Date.replace(/ /, '-').replace(/ /, '-').replace(/ /, '-').replace(/ /, '-').replace(/:/, '-').replace(/:/, '-');
        cb(null, Date + '-' + file.originalname)
    }
})

var upload = multer({ storage: storage }).single('file');

module.exports = {
    fileUpload: function(req, res) {
        upload(req, res, function(err) {
            if (req.file == undefined) {
                return res.status(200).send({
                    code: 400,
                    message: 'Please attach file',
                    error: err
                });
            } else {
                if (err) {
                    return res.status(200).send({
                        code: 400,
                        message: 'File Uploading Failed',
                        error: err
                    });
                } else {
                    return res.status(200).send({
                        code: 200,
                        filePath: req.file.path,
                        message: 'File Uploaded successfully',
                    });
                }
            }

        })
    },

}