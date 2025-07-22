// Está importando o tipo `Knex` da biblioteca `knex`, para poder usar a tipagem no TypeScript (ajuda com autocompletar e validações).
import { Knex } from 'knex'

// Essa MIGRATION tem o objetivo de CRIAR UMA TABELA no banco de dados, chamada 'transactions':

// Essa função up() define o que acontece quando aplicamos a migration. Ela é chamada quando você executa algo como 'knex migrate:latest'.
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('transactions', (table) => {   // Cria uma tabela chamada 'transactions' e os tipos de campos que iremos usar:
    table.uuid('id').primary()
    table.text('title').notNullable() // notNullable = não nulo
    table.decimal('amount', 10, 2).notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable() // Define o valor padrão como o momento atual (knex.fn.now()).
  })
}

// A função down() é usada quando você quer reverter (desfazer) uma migration (explicação abaixo).
export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('transactions') 
}



// ### EXPLICAÇÕES:

// Funções OBRIGATÓRIAS em uma migration (UP E DOWN)
// Função	         Para que serve
// up	             Aplica a mudança no banco (ex: criar ou alterar tabelas, adicionar colunas)
// down	           Desfaz a mudança (ex: remover a tabela ou coluna que foi criada)

// Por que DOWN() é útil?
// Segurança: Se algo der errado com uma migration, você pode revertê-la facilmente (usando 'npx knex migrate:rollback').
// Testes: Durante o desenvolvimento, você pode criar e desfazer estruturas do banco sem precisar apagar tudo manualmente.
// Controle de versão do banco de dados: Assim como o Git controla o código, migrations controlam a estrutura do banco.

// E se eu não escrever a função down()?
// O Knex não vai saber como reverter sua migration.
// Você ainda consegue rodar o 'up()' normalmente, mas o 'rollback' não vai funcionar.
// Em projetos sérios (e principalmente em produção), isso pode ser arriscado.