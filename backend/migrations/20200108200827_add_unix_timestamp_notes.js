exports.up = async function(knex) {
  await knex.schema.table('dbo.clientNotes', table => {
    table.integer('NoteDateTime').nullable();
  });
  await knex.schema.table('dbo.caregiverNotes', table => {
    table.integer('NoteDateTime').nullable();
  });
};

exports.down = async function(knex) {
  await knex.schema.table('dbo.clientNotes', table => {
    table.dropColumns('NoteDateTime');
  });
  await knex.schema.table('dbo.caregiverNotes', table => {
    table.dropColumns('NoteDateTime');
  });
};
