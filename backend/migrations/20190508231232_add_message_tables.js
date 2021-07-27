exports.up = async function(knex) {
  // knex.client.driver.map.register(String, knex.client.driver.VarChar);
  await knex.schema.createTable('dbo.messages', table => {
    table.increments('MessageId').primary();
    table.specificType('twilioNumber', 'varchar(20)');
    table.specificType('targetNumber', 'varchar(20)');
    table.specificType('username', 'varchar(15)').nullable();
    table.specificType('SocialSecurityNum', 'varchar(9)').nullable();
    table.integer('ClientId').nullable();
    table.specificType('GroupId', 'varchar(4)').nullable();
    table.specificType('sender', 'varchar(1)');
    table.specificType('message', 'varchar(1000)');
    table.specificType('createdBy', 'varchar(1000)').nullable();
    table.specificType('created', 'datetime').nullable();
  });

  await knex.schema.table('dbo.securityUsers', table => {
    table.specificType('twilioNumber', 'varchar(20)');
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('dbo.messages');
  await knex.schema.table('dbo.securityUsers', table => {
    table.dropColumns('twilioNumber');
  });
};
