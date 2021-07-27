exports.up = async function(knex) {
  await knex.schema.createTable('dbo.DcnSubmittedHeader', table => {
    table.increments('DcnHeaderId').primary();
    // What's DcnId? is it user input or auto-generated?
    // What's the relationship between Header and Deatil 1 - 1 ? or 1-N?
    table.integer('DcnId');
    table.specificType('SocialSecurityNum', 'varchar(9)').nullable();
    table.integer('ClientId').nullable();
    table.specificType('LastSaturdayDate', 'datetime').nullable();
    table.boolean('HourlyFlag').nullable();
    table.boolean('LiveInFlag').nullable();
    table.boolean('OvernightFlag').nullable();
    table.integer('WeekTotalHours').nullable();
    table.boolean('ComplianceFlag').nullable();
    table.specificType('CaregiverSignature', 'varchar(100)');
    table.specificType('CaregiverSignatureDate', 'datetime').nullable();
    table.specificType('ClientSignature', 'varchar(100)');
    table.specificType('ClientSignatureDate', 'datetime').nullable();
    table.boolean('HasPAF').nullable();
    table.integer('PafId').nullable();
    table.boolean('SendToPhoneFlag').nullable();
    table.specificType('Phone1', 'varchar(20)');
    table.specificType('Phone2', 'varchar(20)');
    table.boolean('SendToEmailFlag').nullable();
    table.specificType('Email1', 'varchar(256)');
    table.specificType('Email2', 'varchar(256)');
    table.specificType('DateTimeOfSubmission', 'datetime').nullable();
    // GPSLocationOfSubmission - Shouldn't we split it into lat & lng?
    table.specificType('GPSLocationOfSubmission', 'varchar(60)').nullable();
    table.specificType('ImageOfDCN', 'varchar(200)');
    table.specificType('PDFOfDCN', 'varchar(200)');

    table.specificType('createdBy', 'varchar(1000)').nullable();
    table.specificType('created', 'datetime').nullable();
    table.specificType('updatedBy', 'varchar(1000)').nullable();
    table.specificType('updated', 'datetime').nullable();
  });

  await knex.schema.createTable('dbo.DcnSubmittedDetail', table => {
    table.increments('DcnDetailId').primary();
    table.integer('DcnId');
    table.specificType('DayOfWeek', 'varchar(20)').nullable();
    table.specificType('TimeIn1', 'varchar(20)').nullable();
    table.specificType('TimeOut1', 'varchar(20)').nullable();
    table.specificType('TimeIn2', 'varchar(20)').nullable();
    table.specificType('TimeOut2', 'varchar(20)').nullable();
    table.specificType('TimeIn3', 'varchar(20)').nullable();
    table.specificType('TimeOut3', 'varchar(20)').nullable();
    table.specificType('TimeIn4', 'varchar(20)').nullable();
    table.specificType('TimeOut4', 'varchar(20)').nullable();
    table.integer('HoursPerDay').nullable();
    table.boolean('MobilityWalkingMovingFlag').nullable();
    table.boolean('BathingShoweringFlag').nullable();
    table.boolean('DressingFlag').nullable();
    table.boolean('ToiletingFlag').nullable();
    table.boolean('EatingFlag').nullable();
    table.boolean('ContinenceBladderBowelFlag').nullable();
    table.boolean('MealPrepIncludingFlag').nullable();
    table.boolean('LaundryFlag').nullable();
    table.boolean('LightHousekeepingIncludingFlag').nullable();

    table.integer('PersonalCareHours').nullable();
    table.integer('HomemakingHours').nullable();
    table.integer('CompanionHours').nullable();
    table.integer('RespiteHours').nullable();
    table.integer('AttendantHours').nullable();

    table.specificType('createdBy', 'varchar(1000)').nullable();
    table.specificType('created', 'datetime').nullable();
    table.specificType('updatedBy', 'varchar(1000)').nullable();
    table.specificType('updated', 'datetime').nullable();
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('dbo.DcnSubmittedHeader');
  await knex.schema.dropTableIfExists('dbo.DcnSubmittedDetail');
};
