import {difference, pick, omit} from 'lodash';
import {token} from '../../../services/passport';
// import ClassModel from '../../../models/ClassModel';
// import {wrapAsync} from '../../../lib/helpers';
import {handleSuccess, wrapAsync} from '../../../lib/helpers';

import {SecurityUserService} from '../../../models/SecurityUserService';
const bcrypt = require('bcrypt');
const SecurityUsersModel = require('../../../models/securityusers');
const SecurityUser = require('../../../models/SecurityUser');
const SecurityUserGroup = require('../../../models/SecurityUserGroup');
const SecurityUserClass = require('../../../models/SecurityUserClass');
const SecurityUserLocation = require('../../../models/SecurityUserLocation');
// const SecurityUser = require('../../../models/SecurityUser')
// const SecurityUser = require('../../../models/SecurityUser')

module.exports = function(router) {
  router.get('/', token({required: true}), wrapAsync(getCb));
  router.get('/:userName', token({required: true}), wrapAsync(getUserDetail));
  router.put('/:userName', token({required: true}), wrapAsync(updateUser));
  router.delete('/:userName', token({required: true}), wrapAsync(deleteUser));
  router.post('/', token({required: true}), wrapAsync(addUserCb));
  router.post('/:userName/reset-password', token({required: true}), wrapAsync(resetPassword));
  router.post('/enable/:userName', token({required: true}), wrapAsync(enableUser));
  router.get('/acl/:userName', token({required: true}), wrapAsync(getAclCb));
  router.post('/disable/:userName', token({required: true}), wrapAsync(disableUser));
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function getCb(req, res, next) {
  try {
    const users = await SecurityUser.query(req.knex).select('userName', 'enabled', 'str_email');
    res.status(200).send(users);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
  // const model = new SecurityUsersModel();
  // model
  //   .read(req.params, req.division_db, req.query.token)
  //   .then(response => {
  //     res.status(201).send(response);
  //   })
  //   .catch(err => {
  //     res.status(500).send(err);
  //   });
}

async function getUserDetail(req, res) {
  try {
    const personaldata = await SecurityUser.query(req.knex)
      .findById(req.params.userName)
      .select('userName', 'enabled', 'str_email');
    let securityGroups = await SecurityUserGroup.query(req.knex).where({
      userName: req.params.userName
    });
    let classes = await SecurityUserClass.query(req.knex).where({
      str_userName: req.params.userName
    });
    classes = classes.map(c => c.str_className);
    let locations = await SecurityUserLocation.query(req.knex).where({
      str_userName: req.params.userName
    });
    res.status(200).send({personaldata, securityGroups, classes, locations});
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
}
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function getAclCb(req, res, next) {
  const model = new SecurityUsersModel();
  model
    .getAcl(req.params.userName, req.body, req.division_db, req.query.token)
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
async function addUserCb(req, res, next) {
  const securityUserService = new SecurityUserService(req.knex, req.user, req.division_db);
  const response = await securityUserService.createNewUser(req.body);
  handleSuccess(res, response);
}

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function resetPassword(req, res, next) {
  try {
    const {userPassword} = req.body;
    const existUser = await SecurityUser.query(req.knex).findById(req.params.userName);
    if (!existUser) {
      throw new Error('User does not exist');
    }
    let password2 = bcrypt.hashSync(userPassword, 10);
    const user = await SecurityUser.query(req.knex).updateAndFetchById(req.params.userName, {
      password2
    });
    res.status(200).send(omit(user, ['password2', 'userPassword']));
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
  // const model = new SecurityUsersModel();
  // model
  //   .resetPassword(req.params.id, req.body, req.division_db, req.query.token)
  //   .then(response => {
  //     res.status(201).send(response);
  //   })
  //   .catch(err => {
  //     res.status(500).send(err);
  //   });
}

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function updateUser(req, res, next) {
  try {
    const existUser = await SecurityUser.query(req.knex).findById(req.params.userName);
    if (!existUser) {
      throw new Error('User does not exist');
    }
    let {securityGroups, locations, classes, personaldata} = req.body;
    let response = {};
    if (personaldata) {
      personaldata = await SecurityUser.query(req.knex).updateAndFetchById(
        req.params.userName,
        personaldata
      );
      response.personaldata = pick(personaldata, ['userName', 'enabled', 'str_email']);
    }

    if (securityGroups) {
      let currentSecurityGroups = await SecurityUserGroup.query(req.knex).where({
        userName: req.params.userName
      });

      let dataExists = securityGroups.filter(sg => sg.bit_read || sg.bit_delete || sg.bit_update);

      await SecurityUserGroup.query(req.knex)
        .delete()
        .where('userName', req.params.userName)
        .whereNotIn('GroupId', dataExists.map(sg => sg.GroupId));

      for (let i = 0; i < dataExists.length; i++) {
        let userSecurityGroup = dataExists[i];
        let existSecurityGroup = currentSecurityGroups.find(
          csg => csg.GroupId === userSecurityGroup.GroupId
        );
        if (existSecurityGroup) {
          if (
            userSecurityGroup.bit_read !== existSecurityGroup.bit_read ||
            userSecurityGroup.bit_delete !== existSecurityGroup.bit_delete ||
            userSecurityGroup.bit_update !== existSecurityGroup.bit_update
          ) {
            // If there were changes, then we update.
            await SecurityUserGroup.query(req.knex).patchAndFetchById(
              [req.params.userName, userSecurityGroup.GroupId],
              pick(userSecurityGroup, ['bit_read', 'bit_update', 'bit_delete'])
            );
          }
        } else {
          await SecurityUserGroup.query(req.knex).insert({
            ...userSecurityGroup,
            userName: req.params.userName
          });
        }
      }
      response.securityGroups = dataExists;
    }

    if (classes) {
      let currentClasses = await SecurityUserClass.query(req.knex).where({
        str_userName: req.params.userName
      });
      currentClasses = currentClasses.map(c => c.str_className);
      await SecurityUserClass.query(req.knex)
        .delete()
        .where('str_userName', req.params.userName)
        .whereNotIn('str_className', classes);
      let newClasses = difference(classes, currentClasses);
      if (newClasses.length > 0) {
        for (let i = 0; i < newClasses.length; i++) {
          let newClass = newClasses[i];
          await SecurityUserClass.query(req.knex).insert({
            str_userName: req.params.userName,
            str_className: newClass
          });
        }
      }
      response.classes = classes;
    }

    if (locations) {
    }

    res.status(200).send(response);
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function deleteUser(req, res, next) {
  const securityUserService = new SecurityUserService(req.knex, req.user, req.division_db);
  await securityUserService.deleteUser(req.params.userName);
  handleSuccess(res, {});
}

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function enableUser(req, res, next) {
  const model = new SecurityUsersModel();
  model
    .enableUser(req.params.userName, req.body, req.division_db, req.query.token)
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
function disableUser(req, res, next) {
  const model = new SecurityUsersModel();
  model
    .disableUser(req.params.userName, req.body, req.division_db, req.query.token)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}
