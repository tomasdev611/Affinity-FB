exports.up = async function(knex) {
  await knex.schema.table('dbo.messages', table => {
    table.specificType('image', 'varchar(1000)');
  });
};

exports.down = async function(knex) {
  await knex.schema.table('dbo.messages', table => {
    table.dropColumns('image');
  });
};
