exports.up = async function(knex) {
  await knex.schema.table('dbo.messages', table => {
    table.specificType('MessageSid', 'varchar(50)');
  });
};

exports.down = async function(knex) {
  await knex.schema.table('dbo.messages', table => {
    table.dropColumns('MessageSid');
  });
};
