exports.up = async function(knex) {
  await knex.schema.createTable('dbo.messageTemplates', table => {
    table.increments('id').primary();
    table.specificType('name', 'varchar(100)');
    table.specificType('message', 'varchar(1000)');
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('dbo.messageTemplates');
};
