import {token} from '../../../services/passport';
import IpTableModel from '../../../models/IpTableModel';
import {populateForUpdate, populateForCreate} from '../../../lib/helpers';
import {ipValidator} from '../../../lib/ipValidator';

module.exports = function(router) {
  router.get('/', token({required: true}), loadIpTables);
  router.post('/', token({required: true}), createIpRecord);
  router.delete('/:id', token({required: true}), deleteIpRecord);
  router.put('/:id', token({required: true}), updateIpRecord);
};

async function loadIpTables(req, res, next) {
  try {
    const records = await IpTableModel.query(req.knex);

    res.status(200).send({records});
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function createIpRecord(req, res, next) {
  try {
    const record = await IpTableModel.query(req.knex).insertAndFetch({
      ...populateForCreate(req.user, req.body)
    });
    await ipValidator.updateMap(req);
    res.status(200).send({record});
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function deleteIpRecord(req, res, next) {
  try {
    await IpTableModel.query(req.knex)
      .where('id', req.params.id)
      .delete();
    await ipValidator.updateMap(req);
    res.status(200).send({id: req.params.id});
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function updateIpRecord(req, res, next) {
  try {
    const {id, ...data} = req.body;
    const record = await IpTableModel.query(req.knex).updateAndFetchById(
      req.params.id,
      populateForUpdate(req.user, data)
    );
    await ipValidator.updateMap(req);
    res.status(200).send({record});
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}
