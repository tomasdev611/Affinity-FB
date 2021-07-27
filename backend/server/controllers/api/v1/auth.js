import LoginModel from '../../../models/login';
import SuperDivisionModel from '../../../models/superdivision';
import {password, token} from '../../../services/passport';
import {handleError, handleSuccess, wrapAsync} from '../../../lib/helpers';
import {sign} from '../../../services/jwt';
const SecurityUserGroup = require('../../../models/SecurityUserGroup');
const BusinessModel = require('../../../models/business');

module.exports = function(router) {
  // router.get('/verify', verify);
  router.post('/login', password(), wrapAsync(loginUser));
  router.post('/me', token({required: true}), wrapAsync(getCurrentUser));
  // router.post('/token', generateToken);
  router.post('/superAdmin', wrapAsync(generateTokenSuperAdmin));
  // router.post('/division_database', getDivisionDatabase);
};

async function loginUser(req, res, next) {
  let {user, division_db} = req;
  let businessModel = new BusinessModel();
  let token = await sign({userName: user.userName, division_db: division_db});
  let securityGroups = await SecurityUserGroup.query(req.knex).where({userName: user.userName});
  let setting = await businessModel.readSettingsById(user.userName, division_db);
  handleSuccess(res, {token, user, acl_list: securityGroups, setting});
}

async function getCurrentUser(req, res, next) {
  let {user, division_db} = req;
  let businessModel = new BusinessModel();
  // let token = await sign({userName: user.userName, division_db: division_db});
  let securityGroups = await SecurityUserGroup.query(req.knex).where({userName: user.userName});
  let setting = await businessModel.readSettingsById(user.userName, division_db);
  handleSuccess(res, {user, acl_list: securityGroups, setting});
}

// function getDivisionDatabase(req, res, next) {
//   const sdModel = new SuperDivisionModel();
//   const division_id = req.body.division_id;
//   sdModel
//     .getDivisionDatabase(division_id)
//     .then(response => {
//       res.status(201).send(response);
//     })
//     .catch(err => {
//       res.status(500).send(err);
//     });
// }
function generateTokenSuperAdmin(req, res, next) {
  const loginModel = new LoginModel();
  const login = req.body;
  const username = login.username;
  const password = login.password;
  loginModel
    .verifyUserDbSluperAdmin(username, password)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}
