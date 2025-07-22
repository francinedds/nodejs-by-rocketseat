import { Knex, knex as setupKnex } from 'knex'
import { env } from './env'

export const config: Knex.Config = {
  client: env.DATABASE_CLIENT, // É usado .env, que faz a criação de variáveis ambiente (criadas no arquivo .env) // ex: ao invés de usarmos a URL do banco de dados diretamente, passamos uma variável
  connection:
    env.DATABASE_CLIENT === 'sqlite'
      ? {
          filename: env.DATABASE_URL,
        }
      : env.DATABASE_URL,
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
}

export const knex = setupKnex(config)


// ### EXPLICAÇÕES:

// Esse arquivo configura a conexão com o banco de dados usando o Knex, que é uma biblioteca SQL para Node.js. Ele também exporta a instância do Knex que sua aplicação vai usar para fazer queries (inserir, buscar, etc.).