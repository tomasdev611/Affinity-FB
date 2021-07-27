import {token} from '../../../services/passport';
const BusinessModel = require('../../../models/business');

module.exports = function(router) {
  router.get('/', token({required: true}), getCb);
  router.get('/:id', token({required: true}), getByIdCb);
  router.get('/settings/:id', token({required: true}), getSettingsByIdCb);
  router.post('/', token({required: true}), postCb);
  router.post('/logo/', token({required: true}), postLogoCB);
  router.post('/settings/', token({required: true}), postSettingsCb);
  router.put('/', token({required: true}), putCb);
  router.delete('/', token({required: true}), deleteCb);
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function getCb(req, res, next) {
  const model = new BusinessModel();
  model
    .read(req.params, req.division_db, req.query.token)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function getByIdCb(req, res, next) {
  const model = new BusinessModel();
  model
    .readById(req.params.id, req.division_db, req.query.token)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function getSettingsByIdCb(req, res, next) {
  const model = new BusinessModel();
  model
    .readSettingsById(req.params.id, req.division_db, req.query.token)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function postCb(req, res, next) {
  const model = new BusinessModel();
  model
    .create(req.body, req.division_db, req.query.token)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function postLogoCB(req, res, next) {
  const model = new BusinessModel();
  model
    .updateLogoById(req, res, req.division_db, req.query.token)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function postSettingsCb(req, res, next) {
  const model = new BusinessModel();
  model
    .updateSettingsById(req.body, req.division_db, req.query.token)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function putCb(req, res, next) {
  const model = new BusinessModel();
  model
    .update(req.body, req.division_db, req.query.token)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function deleteCb(req, res, next) {
  const model = new BusinessModel();
  model
    .delete(req.body, req.division_db, req.query.token)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}
