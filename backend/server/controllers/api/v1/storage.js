import {token} from '../../../services/passport';
import {aws} from '../../../config';
const LoginModel = require('../../../models/login');
const ClientModel = require('../../../models/client');
const CaregiverModel = require('../../../models/caregiver');

module.exports = function(router) {
  const fs = require('fs');

  var S3FS = require('s3fs');
  var s3fsImpl = new S3FS(aws.awsBucketName, {
    accessKeyId: aws.accessKeyId,
    secretAccessKey: aws.secretAccessKey,
    signatureVersion: 'v4'
  });

  // Create our bucket if it doesn't exist
  //s3fsImpl.create();

  /**
   * upload a file
   */
  router.post('/upload', token({required: true}), function(req, res) {
    var savePath = './public/uploads/' + req.files[''].name;
    fs.rename(req.files[''].path, './public/uploads/' + req.files[''].name, function(err) {
      //res.send("file uploaded");

      //upload the file to the aws
      var savedFile = req.files.file;
      var stream = fs.createReadStream('./public/uploads/' + req.files[''].name);
      return s3fsImpl.writeFile(req.files[''].name, stream, {ACL: 'public-read'}).then(function() {
        fs.unlink('./public/uploads/' + req.files[''].name, function(err) {
          if (err) {
            console.error(err);
          }
        });
        res.status(200).end();
      });
    });
  });
};
