exports.up = async function(knex) {
  await knex.schema.table('dbo.messages', table => {
    table.boolean('isRead').defaultTo(true);
  });
};

exports.down = async function(knex) {
  await knex.schema.table('dbo.messages', table => {
    table.dropColumns('isRead');
  });
};
