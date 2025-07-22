import { Knex } from 'knex'

// up() — adiciona uma coluna
export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('transactions', (table) => {
    table.uuid('session_id').after('id').index()  // .after('id'): tenta posicionar a nova coluna logo após a coluna id (esse comando só funciona em alguns bancos, como MySQL).
                                                  // .index(): cria um índice nessa coluna para que as buscas usando session_id fiquem mais rápidas.
  })
}

// Se for preciso reverter a migration, essa parte REMOVE a coluna session_id da tabela.
export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('transactions', (table) => {
    table.dropColumn('session_id')
  })
}



// ### EXPLICAÇÕES:

// Esse é mais um arquivo de MIGRATION, e desta vez ele ALTERA A TABLE existente transactions para ADICIONAR uma nova coluna chamada session_id