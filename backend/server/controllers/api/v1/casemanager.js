import {token} from '../../../services/passport';
const CasemanagerModel = require('../../../models/casemanager');

module.exports = function(router) {
  router.get('/', token({required: true}), getCb);
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function getCb(req, res, next) {
  const model = new CasemanagerModel();
  model
    .read(req.params, req.division_db, req.query.token)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}
