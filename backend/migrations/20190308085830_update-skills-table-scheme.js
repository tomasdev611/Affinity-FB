exports.up = async function(knex) {
  await knex.schema.table('dbo.skills', table => {
    table.boolean('caregiver').nullable();
    table.boolean('client').nullable();
  });
  await knex('dbo.skills').update({
    caregiver: true,
    client: true
  });
};

exports.down = async function(knex) {
  await knex.schema.table('dbo.skills', table => {
    table.dropColumns('caregiver', 'client');
  });
};
