import request from 'request';
import Config from '../../config';
const fs = require('fs');

const aws = require('aws-sdk');

var S3FS = require('s3fs');
var s3fsImpl = new S3FS(Config.aws.awsBucketName, {
  accessKeyId: Config.aws.accessKeyId,
  secretAccessKey: Config.aws.secretAccessKey,
  signatureVersion: 'v4'
});

aws.config.update({
  accessKeyId: Config.aws.accessKeyId,
  secretAccessKey: Config.aws.secretAccessKey
});
const s3 = new aws.S3({signatureVersion: 'v4'});

export const CONTENT_TYPE_JPEG = 'image/jpeg';
export const ACL_PUBLIC_READ = 'public-read';
export const ACL_PRIVATE = 'private';
export const ACL_AUTHENTICATED_READ = 'authenticated-read';

export class AWSService {
  static async generatePresignedUrlForUpload(
    fileName,
    contentType = CONTENT_TYPE_JPEG,
    acl = ACL_PUBLIC_READ
  ) {
    const s3Params = {
      Bucket: Config.aws.awsBucketName,
      Key: fileName,
      Expires: 600,
      ContentType: contentType,
      ACL: acl
    };

    let url = await s3.getSignedUrl('putObject', s3Params);
    return url;
  }

  static async generatePresignedUrlForDownload(
    key
    // contentType = CONTENT_TYPE_JPEG,
    // acl = ACL_PUBLIC_READ
  ) {
    const s3Params = {
      Bucket: Config.aws.awsBucketName,
      Key: key,
      Expires: 600
      // ContentType: contentType,
      // ACL: acl
    };

    let url = await s3.getSignedUrl('getObject', s3Params);
    return url;
  }

  static s3UrlFor(key) {
    // return `https://${Config.aws.awsBucketName}.s3.`
    return `https://s3.amazonaws.com/${Config.aws.awsBucketName}/${key}`;
  }

  static async uploadFile(filePath, key, contentType = CONTENT_TYPE_JPEG, acl = ACL_PUBLIC_READ) {
    const newKey = await new Promise((resolve, reject) => {
      var stream = fs.createReadStream(filePath);
      return s3fsImpl
        .writeFile(key, stream, {ACL: 'public-read'})
        .then(function() {
          // fs.unlink('./public/uploads/' + req.files[''].name, function(err) {
          //   if (err) {
          //     console.error(err);
          //   }
          // });
          resolve(key);
        })
        .catch(function(error) {
          reject(error);
        });
      // var savePath = './public/uploads/' + req.files[''].name;
      // fs.rename(req.files[''].path, './public/uploads/' + req.files[''].name, function(err) {
      //   //res.send("file uploaded");

      //   //upload the file to the aws
      //   var savedFile = req.files.file;
      //   var stream = fs.createReadStream('./public/uploads/' + req.files[''].name);
      //   return s3fsImpl
      //     .writeFile(req.files[''].name, stream, {ACL: 'public-read'})
      //     .then(function() {
      //       fs.unlink('./public/uploads/' + req.files[''].name, function(err) {
      //         if (err) {
      //           console.error(err);
      //         }
      //       });
      //       resolve()
      //     });
      // });
    });
    return newKey;
  }

  static async uploadFileToAWSS3(
    bucket,
    fileName,
    Body,
    contentType = CONTENT_TYPE_JPEG,
    acl = ACL_PUBLIC_READ
  ) {
    const s3Params = {
      Bucket: bucket,
      Key: fileName,
      Body,
      ContentType: contentType,
      ACL: acl
    };
    await new Promise((resolve, reject) => {
      try {
        s3.putObject(s3Params, (error, data) => {
          if (error) {
            reject(error);
          } else {
            resolve(data);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
    // await s3.putObject(s3Params);

    return true;
  }

  static async uploadImageToS3FromUrl(
    imageUrl,
    key,
    contentType = CONTENT_TYPE_JPEG,
    acl = ACL_PUBLIC_READ
  ) {
    let body = await new Promise((resolve, reject) => {
      try {
        request({url: imageUrl, encoding: null}, (error, res, body) => {
          if (error) {
            reject(error);
          } else {
            resolve(body);
          }
        });
      } catch (error) {
        reject(error);
      }
    });

    await AWSService.uploadFileToAWSS3(Config.aws.awsBucketName, key, body, contentType, acl);
  }

  static async uploadImageToS3FromFilePath(
    filePath,
    key,
    contentType = CONTENT_TYPE_JPEG,
    acl = ACL_PUBLIC_READ
  ) {
    let body = await new Promise((resolve, reject) => {
      try {
        fs.readFile(filePath, (err, data) => {
          if (err) throw err;
          resolve(data);
        });
      } catch (error) {
        reject(error);
      }
    });

    await AWSService.uploadFileToAWSS3(Config.aws.awsBucketName, key, body, contentType, acl);
  }

  static async uploadFileToS3FromContent(
    body,
    key,
    contentType = CONTENT_TYPE_JPEG,
    acl = ACL_PUBLIC_READ
  ) {
    await AWSService.uploadFileToAWSS3(Config.aws.awsBucketName, key, body, contentType, acl);
  }

  static async downloadFileFromAWSS3(bucket, key) {
    const s3Params = {
      Bucket: bucket,
      Key: key
    };
    const data = await new Promise((resolve, reject) => {
      try {
        s3.getObject(s3Params, (error, data) => {
          if (error) {
            reject(error);
          } else {
            resolve(data);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
    return data;
  }

  static async downloadFile(key) {
    return AWSService.downloadFileFromAWSS3(Config.aws.awsBucketName, key);
  }

  static async downloadFileAndSave(key, path) {
    const data = await AWSService.downloadFile(key);
    fs.writeFileSync(path, data.Body);
  }
}

// import {token} from '../../../services/passport';
// import {aws} from '../../../config';
// const LoginModel = require('../../../models/login');
// const ClientModel = require('../../../models/client');
// const CaregiverModel = require('../../../models/caregiver');

// module.exports = function(router) {
//   // Create our bucket if it doesn't exist
//   //s3fsImpl.create();

//   /**
//    * upload a file
//    */
//   router.post('/upload', token({required: true}), function(req, res) {
//     var savePath = './public/uploads/' + req.files[''].name;
//     fs.rename(req.files[''].path, './public/uploads/' + req.files[''].name, function(err) {
//       //res.send("file uploaded");

//       //upload the file to the aws
//       var savedFile = req.files.file;
//       var stream = fs.createReadStream('./public/uploads/' + req.files[''].name);
//       return s3fsImpl.writeFile(req.files[''].name, stream, {ACL: 'public-read'}).then(function() {
//         fs.unlink('./public/uploads/' + req.files[''].name, function(err) {
//           if (err) {
//             console.error(err);
//           }
//         });
//         res.status(200).end();
//       });
//     });
//   });
// };
