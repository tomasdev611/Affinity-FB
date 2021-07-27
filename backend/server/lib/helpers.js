import moment from 'moment';
import {pick} from 'lodash';
import stringHash from 'string-hash';

export const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss.SSS';

export const sqlCompatibleDateString = dt => {
  return moment(new Date(dt)).format(DATE_FORMAT);
};

export const populateForUpdate = (user, body, creatorTimeFields) => {
  const createdTime = sqlCompatibleDateString(new Date());
  if (creatorTimeFields) {
    if (creatorTimeFields.length === 0) {
      return {...body};
    }
    return {
      ...body,
      [creatorTimeFields[2]]: user.userName,
      [creatorTimeFields[3]]: createdTime // .toLocaleDateString('en-US')
    };
  }
  return {
    ...body,
    updatedBy: user.userName,
    lastUpdated: createdTime //.toLocaleDateString('en-US')
  };
};

export const populateForCreate = (user, body, creatorTimeFields) => {
  const createdTime = sqlCompatibleDateString(new Date());
  if (creatorTimeFields) {
    if (creatorTimeFields.length === 0) {
      return {...body};
    }
    return {
      ...body,
      [creatorTimeFields[0]]: user.userName,
      [creatorTimeFields[1]]: createdTime, //.toLocaleDateString('en-US'),
      [creatorTimeFields[2]]: user.userName,
      [creatorTimeFields[3]]: createdTime // .toLocaleDateString('en-US')
    };
  }
  return {
    ...body,
    createdBy: user.userName,
    created: createdTime, //.toLocaleDateString('en-US'),
    updatedBy: user.userName,
    lastUpdated: createdTime // .toLocaleDateString('en-US')
  };
};

export const populateForCreateOnly = (user, body) => {
  const createdTime = sqlCompatibleDateString(new Date());
  return {
    ...body,
    createdBy: user.userName,
    created: createdTime //.toLocaleDateString('en-US'),
  };
};

export const handleSuccess = (res, result = {}, status = 200) => {
  // if (entity) {
  return res.status(status || 200).json({success: true, ...result});
};

export const notFound = res => {
  res.status(404).end();
  return null;
};

export const handleError = (res, err = {message: 'Internal Server Error'}, status = 500) => {
  console.error('handleError : ', err);
  let errorMessage = typeof err === 'string' ? err : err.message;
  const response = {
    success: false,
    message: errorMessage || 'Something went wrong'
  };
  return res.status(err.status || status || 500).send(response);
};

export const wrapAsync = fn => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (err) {
    handleError(res, err, err.status);
  }
};

export const extractIpFromReq = req => {
  const ip =
    (req.headers['x-forwarded-for'] || '').split(',').pop() ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  return ip;
};

export const fetchManyRecords = async (knexQuery, fieldName, rowIds, pageSize = 100) => {
  let count = rowIds.length;
  let page = Math.ceil(count / pageSize);
  let data = [];
  for (let i = 0; i < page; i++) {
    let query = knexQuery.clone();
    query.whereIn(fieldName, rowIds.slice(i * pageSize, (i + 1) * pageSize));
    let rows = await query;
    data.push(...rows);
  }
  return data;
};

export const multiRowsInsertHelper = (tableName, columns, data) => {
  const rows = data.map(row => {
    return 'select ' + columns.map(c => `'${row[c]}'`).join(', ');
  });
  return `insert into ${tableName} (${columns.join(', ')}) ${rows.join(' union all ')}`;
};

export const insertMultipleRows = async (
  db,
  division_db,
  tableName,
  columns,
  data,
  pageSize = 100
) => {
  let count = data.length;
  let page = Math.ceil(count / pageSize);
  for (let i = 0; i < page; i++) {
    const sql = `use [${division_db}];${multiRowsInsertHelper(
      tableName,
      columns,
      data.slice(i * pageSize, (i + 1) * pageSize)
    )}`;
    await new Promise((resolve, reject) => {
      db.request()
        .query(sql)
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          console.trace(err); // todo : will do to logger later
          reject(err);
        });
    });
  }
};

export const generateHash = data => {
  let source = data;
  if (typeof source !== 'string') {
    source = JSON.stringify(source);
  }
  const hash = stringHash(source);
  return hash.toString();
};

export const generateAddressHash = obj => {
  const addressObj = pick(obj, ['Address1', 'City', 'County', 'State', 'Zip']);
  return generateHash(addressObj).slice(0, 30);
};

export const distanceFieldGenerator = (lat1, lng1, lat2, lng2) => {
  const selectDistanceQuery = `ACOS(SIN(PI()*(${lat1})/180.0)*SIN(PI()*(${lat2})/180.0)+COS(PI()*(${lat1})/180.0)*COS(PI()*(${lat2})/180.0)*COS(PI()*(${lng2})/180.0-PI()*(${lng1})/180.0))*3958.75`;
  return selectDistanceQuery;
};

export const canUserDoAction = (user, groupId, action) => {
  if (!user.securityGroups || !user.securityGroups[groupId]) {
    return false;
  }
  if (!user.securityGroups[groupId][`bit_${action}`]) {
    return false;
  }
  return true;
};

// outputFormat - 10 - 10 Digit system, 36 - 0~10, a~z
export const generateRandomIds = (prefix = '', len = 8, numberSystem = 10) => {
  const unixTimestamp = Math.round(new Date().getTime());
  const milli = (unixTimestamp % (numberSystem * numberSystem)).toString(numberSystem);
  const secs = Math.round(unixTimestamp / (numberSystem * numberSystem)).toString(numberSystem);
  const num = secs
    .split('')
    .reverse()
    .join('')
    .substring(0, len - 2);
  return `${prefix}${num}${milli}`.toUpperCase();
};
