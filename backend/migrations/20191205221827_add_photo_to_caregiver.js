exports.up = async function(knex) {
  await knex.schema.table('dbo.employee', table => {
    table.specificType('photo', 'varchar(200)');
  });
  await knex.schema.table('dbo.Applicant', table => {
    table.specificType('photo', 'varchar(200)');
  });
};

exports.down = async function(knex) {
  await knex.schema.table('dbo.employee', table => {
    table.dropColumns('photo');
  });
  await knex.schema.table('dbo.Applicant', table => {
    table.dropColumns('photo');
  });
};
