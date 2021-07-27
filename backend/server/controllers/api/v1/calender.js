import knex from 'knex';
import moment from 'moment';
import {token} from '../../../services/passport';
import {populateForUpdate, populateForCreate, wrapAsync, handleSuccess} from '../../../lib/helpers';
const Schedule = require('../../../models/ScheduleModel');
const Caregiver = require('../../../models/CaregiverModel');
const Client = require('../../../models/ClientModel');

module.exports = function(router) {
  router.get('/events', token({required: true}), wrapAsync(getEvents));
  router.get('/data', token({required: true}), wrapAsync(getCalendarData));

  router.post('/bulk', token({required: true}), wrapAsync(bulkCreate));
  router.put('/bulk', token({required: true}), wrapAsync(bulkEdit));
  router.post('/bulk/delete', token({required: true}), wrapAsync(bulkDelete));
};

async function getEvents(req, res, next) {
  const {ClientId, SocialSecurityNum, calendarTime, type, loadHours} = req.query;

  var calDate = new Date(calendarTime);
  var calStartDate = new Date(calendarTime);
  var calEndDate = new Date(calendarTime);

  var calWeekDay = calDate.getDay();
  var calMonthDay = calDate.getDate();
  var calMonth = calDate.getMonth();
  var calYear = calDate.getFullYear();

  if (type == 'month') {
    var lastDay = new Date(calYear, calMonth + 1, 0).getDate();
    calStartDate.setDate(1);
    calEndDate.setDate(lastDay + 1);
  } else if (type == 'week') {
    //get the number of days left in week
    var dayLeftWeek = 6 - calWeekDay; //starts with 0
    calDate.setDate(dayLeftWeek + calMonthDay);
    calStartDate.setDate(dayLeftWeek + calMonthDay - 6); //start of the week
    calEndDate.setDate(dayLeftWeek + calMonthDay + 1); //end of the week
  } else {
    calDate.setDate(calMonthDay);
    calStartDate.setDate(calMonthDay); //start of the week
    calEndDate.setDate(calMonthDay + 1); //end of the week
  }

  calStartDate = calStartDate.toISOString().substring(0, 10);
  calEndDate = calEndDate.toISOString().substring(0, 10);

  // sql = `use [${division_db}];select dbo.schedules.*,dbo.employee.FirstName as careGiverFirstName,dbo.employee.LastName as careGiverLastName, dbo.client.FirstName,dbo.client.LastName ,dbo.services.Description  from dbo.schedules INNER JOIN dbo.client ON dbo.schedules.ClientId=dbo.client.ClientId INNER JOIN dbo.employee ON dbo.schedules.SocialSecNum=dbo.employee.SocialSecurityNum INNER JOIN dbo.services ON dbo.schedules.ServiceCode=dbo.services.ServiceCode
  //         where (CONVERT(datetime,StartTime) >= '${calStartDate}' OR  CONVERT(datetime,EndTime) >= '${calStartDate}') AND (CONVERT(datetime,StartTime) <= '${calEndDate}' OR  CONVERT(datetime,EndTime) <= '${calEndDate}')`;

  const query = Schedule.query(req.knex).whereRaw(
    `(CONVERT(datetime,StartTime) >= '${calStartDate}' OR  CONVERT(datetime,EndTime) >= '${calStartDate}') AND (CONVERT(datetime,StartTime) <= '${calEndDate}' OR  CONVERT(datetime,EndTime) <= '${calEndDate}')`
  );

  const response = {};
  if (ClientId || SocialSecurityNum) {
    let eventQuery = query.clone();
    if (ClientId) {
      eventQuery.where('ClientId', ClientId);
    }
    if (SocialSecurityNum) {
      eventQuery.where('SocialSecNum', SocialSecurityNum);
    }
    response.schedules = await eventQuery;
  }

  if (loadHours === 'true' || loadHours === true) {
    let clientsQuery = query.clone();
    let clients = await clientsQuery
      .select(
        'ClientId',
        knex.raw('SUM(ABS(DATEDIFF(MINUTE,StartTime,EndTime))) as total_hours')
        // 'cast(SUM(ROUND((ABS(DATEDIFF(MINUTE,StartTime,EndTime))*1.0/60),2)) as decimal(10,1)) as total_hours'
      )
      .groupBy('ClientId');
    response.clientHours = clients.reduce((obj, cur) => {
      obj[cur.ClientId] = parseInt(cur.total_hours / 60);
      return obj;
    }, {});

    let caregiverQuery = query.clone();
    let caregivers = await caregiverQuery
      .select(
        'SocialSecNum',
        knex.raw('SUM(ABS(DATEDIFF(MINUTE,StartTime,EndTime))) as total_hours')
        // 'cast(SUM(ROUND((ABS(DATEDIFF(MINUTE,StartTime,EndTime))*1.0/60),2)) as decimal(10,1)) as total_hours'
      )
      .groupBy('SocialSecNum');
    response.caregiverHours = caregivers.reduce((obj, cur) => {
      obj[cur.SocialSecNum] = parseInt(cur.total_hours / 60);
      return obj;
    }, {});
  }

  handleSuccess(res, response);
}

async function getCalendarData(req, res, next) {
  let clients = await Client.query(req.knex)
    .where('Status', 'A')
    .select('ClientId', 'FirstName', 'LastName', 'Status');
  let caregivers = await Caregiver.query(req.knex)
    .where('Status', 'A')
    .select('SocialSecurityNum', 'FirstName', 'LastName', 'Status');

  handleSuccess(res, {clients, caregivers});
}

async function bulkCreate(req, res, next) {
  const {
    SocialSecNum,
    ClientId,
    StartTimes,
    EndTimes,
    ServiceCode,
    serviceRequestId,
    itemName
  } = req.body;

  for (let i = 0; i < StartTimes.length; i++) {
    let scheduleData = {
      SocialSecNum,
      ClientId,
      ServiceCode,
      serviceRequestId,
      itemName,
      StartTime: StartTimes[i],
      EndTime: EndTimes[i],
      Date: `${StartTimes[i].substring(0, 10)} 00:00:00`
    };
    await Schedule.query(req.knex).insert(populateForCreate(req.user, scheduleData));
  }
  handleSuccess(res, {message: 'success'});
}

async function bulkEdit(req, res, next) {
  const {
    SocialSecNum,
    ClientId,
    AllFutureDates,
    weekDays,
    StartTime,
    EndTime,
    ServiceCode,
    serviceRequestId,
    itemName,
    NewCaregiverSSN,
    NewStartTime,
    NewEndTime,
    NewFromDate,
    NewToDate
  } = req.body;

  let scheduleQuery = Schedule.query(req.knex)
    .where('SocialSecNum', SocialSecNum)
    .where('ClientId', ClientId);

  scheduleQuery.whereRaw(`datepart(hour, StartTime) = datepart(hour,'${StartTime}')`);
  scheduleQuery.whereRaw(`datepart(hour, EndTime) = datepart(hour,'${EndTime}')`);

  if (weekDays && weekDays.length > 0) {
    scheduleQuery.whereRaw(`datepart(dw,StartTime) IN (${weekDays.map(day => day + 1).join(',')})`);
  }

  if (AllFutureDates) {
    scheduleQuery.whereRaw(`StartTime >= '${StartTime}'`);
  } else {
    scheduleQuery.whereRaw(
      `StartTime between '${NewFromDate} 00:00:00.000' and '${NewToDate} 23:59:59.999'`
    );
  }
  const schedules = await scheduleQuery;
  for (let i = 0; i < schedules.length; i++) {
    const updateObj = {ServiceCode, serviceRequestId, itemName};
    if (NewCaregiverSSN) {
      updateObj.SocialSecNum = NewCaregiverSSN;
    }
    if (NewStartTime) {
      if (NewEndTime > NewStartTime) {
        updateObj.StartTime = `${moment(schedules[i].Date).format(
          'YYYY/MM/DD'
        )} ${NewStartTime}:00`;
        updateObj.EndTime = `${moment(schedules[i].Date).format('YYYY/MM/DD')} ${NewEndTime}:00`;
      } else {
        updateObj.StartTime = `${moment(schedules[i].Date).format(
          'YYYY/MM/DD'
        )} ${NewStartTime}:00`;
        updateObj.EndTime = `${moment(schedules[i].Date)
          .add(1, 'days')
          .format('YYYY/MM/DD')} ${NewEndTime}:00`;
      }
    }

    await Schedule.query(req.knex)
      .patch(updateObj)
      .where('scheduleID', schedules[i].scheduleID);
  }
  handleSuccess(res, {message: 'success'});
}

async function bulkDelete(req, res, next) {
  const {
    SocialSecNum,
    ClientId,
    AllFutureDates,
    weekDays,
    StartTime,
    EndTime,
    FromDate,
    ToDate
  } = req.body;

  let scheduleQuery = Schedule.query(req.knex)
    .where('SocialSecNum', SocialSecNum)
    .where('ClientId', ClientId);
  if (weekDays && weekDays.length > 0) {
    scheduleQuery.whereRaw(`datepart(dw,StartTime) IN (${weekDays.map(day => day + 1).join(',')})`);
  }

  if (AllFutureDates) {
    scheduleQuery.whereRaw(`StartTime >= '${StartTime}'`);
  } else {
    scheduleQuery.whereRaw(
      `StartTime between '${FromDate} 00:00:00.000' and '${ToDate} 23:59:59.999'`
    );
  }

  await scheduleQuery.delete();
  handleSuccess(res, {message: 'success'});
}
