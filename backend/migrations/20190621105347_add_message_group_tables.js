exports.up = async function(knex) {
  await knex.schema.createTable('dbo.messageGroups', table => {
    table.increments('id').primary();
    table.specificType('GroupId', 'char(4)').notNullable();
    table.specificType('name', 'varchar(1000)');
    table.boolean('isCaregiverGroup').nullable();
    table.integer('groupSize').defaultTo(0);
    table.specificType('createdBy', 'varchar(1000)').nullable();
    table.specificType('created', 'datetime').nullable();
  });

  await knex.schema.createTable('dbo.messageGroupMembers', table => {
    table.increments('id').primary();
    table.specificType('GroupId', 'char(4)').notNullable();
    table.specificType('SocialSecurityNum', 'varchar(9)').nullable();
    table.integer('ClientId').nullable();
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('dbo.messageGroupMembers');
  await knex.schema.dropTableIfExists('dbo.messageGroups');
};
