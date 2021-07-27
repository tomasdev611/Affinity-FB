import createError from 'http-errors';
import ipRangeCheck from 'ip-range-check';
import IpTableModel from '../models/IpTableModel';
import {extractIpFromReq} from './helpers';
import {ipRestriction} from '../config';

class IpValidator {
  cidrMap = {};
  async validateRequest(req) {
    if (ipRestriction !== 'ENABLED') {
      return true;
    }
    let isValid = false;
    try {
      let cidrs = this.cidrMap[req.division_db];
      if (!cidrs) {
        let records = await IpTableModel.query(req.knex).where('isActive', true);
        cidrs = records.map(record => record.IpCIDR);
        this.cidrMap[req.division_db] = cidrs;
      }
      const ip = extractIpFromReq(req);
      if (cidrs.length > 0) {
        isValid = ipRangeCheck(ip, cidrs);
      }
    } catch (error) {
      console.error(error);
    }
    if (!isValid) {
      throw createError(400, 'Your machine is not authorized to access this service');
    }
    return false;
  }

  async updateMap(req) {
    if (ipRestriction !== 'ENABLED') {
      return;
    }
    let records = await IpTableModel.query(req.knex).where('isActive', true);
    let cidrs = records.map(record => record.IpCIDR);
    this.cidrMap[req.division_db] = cidrs;
  }

  init() {}
}

const ipValidator = new IpValidator();
module.exports = {ipValidator};
