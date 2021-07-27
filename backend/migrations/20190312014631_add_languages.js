exports.up = async function(knex) {
  // knex.client.driver.map.register(String, knex.client.driver.VarChar);
  await knex.schema.createTable('dbo.languages', table => {
    table.increments('id').primary();
    table.specificType('name', 'varchar(80)').nullable();
  });

  await knex.schema.createTable('dbo.clientLanguages', table => {
    table
      .integer('LanguageId')
      .notNullable()
      .references('id')
      .inTable('dbo.languages')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table
      .integer('ClientId')
      .notNullable()
      .references('ClientId')
      .inTable('dbo.client')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table.primary(['ClientId', 'LanguageId'], 'clientLanguages_pkey');
  });

  await knex.schema.createTable('dbo.caregiverLanguages', table => {
    table
      .integer('LanguageId')
      .notNullable()
      .references('id')
      .inTable('dbo.languages')
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
    table.primary(['SocialSecurityNum', 'LanguageId'], 'caregiverLanguages_pkey');
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('dbo.clientLanguages');
  await knex.schema.dropTableIfExists('dbo.caregiverLanguages');
  await knex.schema.dropTableIfExists('dbo.languages');
};
