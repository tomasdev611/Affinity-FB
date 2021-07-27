import {token} from '../../../services/passport';
const SecurityGroupModel = require('../../../models/securitygroup');

module.exports = function(router) {
  router.get('/', token({required: true}), getCb);
  router.get('/:id', token({required: true}), getByIdCb);
  router.get('/class/:id', token({required: true}), getClassByIdCb);
  router.get('/location/:id', token({required: true}), getLocationByIdCb);
  router.post('/', token({required: true}), postCb);
  router.post('/class/', token({required: true}), postClassCb);
  router.post('/location/', token({required: true}), postLocationCb);
  router.put('/', token({required: true}), putCb);
  router.delete('/', token({required: true}), deleteCb);
  router.post('/addlocation/', token({required: true}), addNewLocation);
  router.post('/deletelocation/:id', token({required: true}), deleteLocationById);
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function getCb(req, res, next) {
  const model = new SecurityGroupModel();
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
  const model = new SecurityGroupModel();
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
function getClassByIdCb(req, res, next) {
  const model = new SecurityGroupModel();
  model
    .readClassById(req.params.id, req.division_db, req.query.token)
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
function getLocationByIdCb(req, res, next) {
  const model = new SecurityGroupModel();
  model
    .readLocationById(req.params.id, req.division_db, req.query.token)
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
  const model = new SecurityGroupModel();
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
function postClassCb(req, res, next) {
  const model = new SecurityGroupModel();
  model
    .createClass(req.body, req.division_db, req.query.token)
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
function postLocationCb(req, res, next) {
  const model = new SecurityGroupModel();
  model
    .createLocation(req.body, req.division_db, req.query.token)
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
  const model = new SecurityGroupModel();
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
 *
 */
function deleteCb(req, res, next) {
  const model = new SecurityGroupModel();
  model
    .delete(req.body, req.division_db, req.query.token)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}
/*
 * code by Jatin Feb-21
 * for location
 */

function addNewLocation(req, res, next) {
  const model = new SecurityGroupModel();
  model
    .addLocation(req.body, req.division_db, req.query.token)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

// for delete location for security users

function deleteLocationById(req, res, next) {
  const model = new SecurityGroupModel();
  model
    .deleteLocation(req.params.id, req.division_db, req.query.token)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}
