exports.up = async function(knex) {
  // knex.client.driver.map.register(String, knex.client.driver.VarChar);
  await knex.schema.createTable('dbo.availabilities', table => {
    table.increments('id').primary();
    // table.string('name', 80).nullable();
    table.specificType('name', 'varchar(80)').nullable();
    table.boolean('caregiver').nullable();
    table.boolean('client').nullable();
  });

  await knex.schema.createTable('dbo.clientAvailabilities', table => {
    table
      .integer('AvailabilityId')
      .notNullable()
      .references('id')
      .inTable('dbo.availabilities')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table
      .integer('ClientId')
      .notNullable()
      .references('ClientId')
      .inTable('dbo.client')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table.primary(['ClientId', 'AvailabilityId'], 'clientAvailabilities_pkey');
  });

  await knex.schema.createTable('dbo.caregiverAvailabilities', table => {
    table
      .integer('AvailabilityId')
      .notNullable()
      .references('id')
      .inTable('dbo.availabilities')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table
      .specificType('SocialSecurityNum', 'varchar(9)')
      // .string('SocialSecurityNum', 9)
      .notNullable()
      .references('SocialSecurityNum')
      .inTable('dbo.employee')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table.primary(['SocialSecurityNum', 'AvailabilityId'], 'caregiverAvailabilities_pkey');
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('dbo.clientAvailabilities');
  await knex.schema.dropTableIfExists('dbo.caregiverAvailabilities');
  await knex.schema.dropTableIfExists('dbo.availabilities');
};
