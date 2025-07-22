// eslint-disable-next-line
import { Knex } from 'knex'
// ou faça apenas:
// import 'knex'

declare module 'knex/types/tables' { // Isso está declarando um módulo interno chamado 'knex/types/tables', que é onde o Knex espera encontrar informações sobre a estrutura das tabelas.
  export interface Tables {
    transactions: {
      id: string
      title: string
      amount: number
      created_at: string
      session_id?: string
    }
  }
}



// ### EXPLICAÇÕES:

// Esse arquivo é bem importante e normalmente é usado quando se está trabalhando com TypeScript + Knex. 
// Ele serve para DECLARAR OS TIPOS DAS TABELAS que existem no seu banco de dados, para que o Knex saiba qual estrutura usar durante o desenvolvimento.
// Isso não altera o banco de dados, apenas melhora a inteligência do TypeScript (autocompletar, verificação de tipo etc).
// Diz ao TypeScript: “A tabela `transactions` tem essas colunas e esses tipos”