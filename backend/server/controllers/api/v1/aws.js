import {token} from '../../../services/passport';
import {AWSService} from '../../../services/aws';
import {handleSuccess, wrapAsync} from '../../../lib/helpers';
// Not Used: We are currently not using AWS for file upload
module.exports = function(router) {
  router.post('/signed-url', token({required: true}), wrapAsync(getSignedURL));
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function getSignedURL(req, res, next) {
  const key = `${new Date().getUTCMilliseconds()}.jpg`;
  const url = await AWSService.generatePresignedUrlForUpload(key);
  handleSuccess(res, {url});
}
