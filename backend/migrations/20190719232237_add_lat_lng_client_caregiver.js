exports.up = async function(knex) {
  await knex.schema.table('dbo.employee', table => {
    table.float('lat');
    table.float('lng');
    table.specificType('addressHash', 'varchar(50)');
  });
  await knex.schema.table('dbo.client', table => {
    table.float('lat');
    table.float('lng');
    table.specificType('addressHash', 'varchar(50)');
  });
};

exports.down = async function(knex) {
  await knex.schema.table('dbo.employee', table => {
    table.dropColumns('lat', 'lng', 'addressHash');
  });
  await knex.schema.table('dbo.client', table => {
    table.dropColumns('lat', 'lng', 'addressHash');
  });
};
