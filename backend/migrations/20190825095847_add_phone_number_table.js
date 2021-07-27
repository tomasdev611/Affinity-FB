exports.up = async function(knex) {
  await knex.schema.createTable('dbo.phoneNumbers', table => {
    table.increments('id').primary();
    table.specificType('PhoneNumber', 'varchar(50)');
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('dbo.phoneNumbers');
};
