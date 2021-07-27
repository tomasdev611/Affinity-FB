exports.up = async function(knex) {
  await knex.schema.createTable('dbo.ipTables', table => {
    table.increments('id').primary();
    table.specificType('IpCIDR', 'varchar(30)');
    table.specificType('name', 'varchar(200)');
    table.boolean('isActive').nullable();
    table.specificType('createdBy', 'varchar(1000)').nullable();
    table.specificType('created', 'datetime').nullable();
    table.specificType('updatedBy', 'varchar(1000)').nullable();
    table.specificType('lastUpdated', 'datetime').nullable();
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('dbo.ipTables');
};
