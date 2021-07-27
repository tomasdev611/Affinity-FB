exports.up = async function(knex) {
  await knex.schema.table('dbo.employee', table => {
    table.specificType('Phone1Formatted', 'varchar(21)');
  });
};

exports.down = async function(knex) {
  await knex.schema.table('dbo.employee', table => {
    table.dropColumns('Phone1Formatted');
  });
};
