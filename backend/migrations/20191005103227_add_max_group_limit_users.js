exports.up = async function(knex) {
  await knex.schema.table('dbo.securityUsers', table => {
    table.integer('maximumGroupMemberCount').nullable();
  });
};

exports.down = async function(knex) {
  await knex.schema.table('dbo.securityUsers', table => {
    table.dropColumns('maximumGroupMemberCount');
  });
};
