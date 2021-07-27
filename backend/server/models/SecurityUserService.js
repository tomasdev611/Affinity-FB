import bcrypt from 'bcrypt';
import {pick} from 'lodash';
import createError from 'http-errors';
import {insertMultipleRows} from '../lib/helpers';
import SecurityUserClass from './SecurityUserClass';
import ClassModel from './ClassModel';
import SecurityUser from './SecurityUser';
import SecurityUserGroup from './SecurityUserGroup';
import SecurityUserLocation from './SecurityUserLocation';

import database from './../lib/databasemssql';

export class SecurityUserService {
  constructor(knex, user, division_db) {
    this.knex = knex;
    this.user = user;
    this.division_db = division_db;
    this.db = database.getDb();
  }

  async createNewUser(rawData) {
    const {userPassword, selectAllClass, ...data} = rawData;
    const existUser = await SecurityUser.query(this.knex).findById(data.userName);
    if (existUser) {
      throw createError(400, 'User already exists with same username');
    }
    data.password2 = bcrypt.hashSync(userPassword, 10);
    const user = await SecurityUser.query(this.knex).insertAndFetch(data);
    let response = {personaldata: pick(user, ['userName', 'enabled', 'str_email'])};

    if (selectAllClass) {
      const classNames = await ClassModel.query(this.knex).select('className');
      if (classNames.length > 0) {
        let newClasses = classNames.map(c => ({
          str_className: c.className,
          str_userName: data.userName
        }));
        await insertMultipleRows(
          this.db,
          this.division_db,
          'dbo.tbl_securityusers_class',
          ['str_userName', 'str_className'],
          newClasses,
          30
        );
        response.classes = newClasses;
      }
    }
    return response;
  }

  async deleteUser(userName) {
    const existUser = await SecurityUser.query(this.knex).findById(userName);
    if (!existUser) {
      throw createError(400, 'User does not exist');
    }
    await SecurityUserClass.query(this.knex)
      .where({str_userName: userName})
      .delete();
    await SecurityUserGroup.query(this.knex)
      .where({userName: userName})
      .delete();
    await SecurityUserLocation.query(this.knex)
      .where({str_userName: userName})
      .delete();

    await SecurityUser.query(this.knex)
      .where({userName})
      .delete();
  }
}
