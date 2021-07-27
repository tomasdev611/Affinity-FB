import {token} from '../../../services/passport';
const SuperAdminDivision = require('../../../models/superdivision');

module.exports = function(router) {
  router.get('/', token({required: true}), getdivision);
  router.post('/add/', token({required: true}), adddivision);
  router.get('/delete/:id', token({required: true}), deletedivision);
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function getdivision(req, res, next) {
  const model = new SuperAdminDivision();
  model
    .getdivision(req.params, req.division_db, req.query.token)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

// for add new division
function adddivision(req, res, next) {
  const model = new SuperAdminDivision();
  model
    .insertDivision(req.body, req.division_db, req.query.token)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}
// for delete division
function deletedivision(req, res, next) {
  const model = new SuperAdminDivision();
  model
    .deleteDivision(req.params.id, req.division_db, req.query.token)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}
