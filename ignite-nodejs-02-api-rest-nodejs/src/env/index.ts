import { config } from 'dotenv'
import { z } from 'zod'
// Usa a biblioteca zod para VALIDAR os valores e garantir que estão corretos.

// Se a aplicação estiver rodando em ambiente de **teste**, ele carrega as variáveis do arquivo `.env.test`.
// Caso contrário, carrega do `.env` padrão.
if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' })
} else {
  config()
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'), // Enum: Pode ser development, test ou production (padrão: production)
  DATABASE_CLIENT: z.enum(['sqlite', 'pg']).default('sqlite'),  // Enum: Pode ser sqlite ou pg (PostgreSQL) (padrão: sqlite)
  DATABASE_URL: z.string(),                             // URL de conexão com o banco de dados
  PORT: z.coerce.number().default(3333),                // Porta onde o servidor vai rodar (padrão: 3333) // z.coerce.number() transforma strings em números (útil porque .env sempre retorna strings)
})

const _env = envSchema.safeParse(process.env) // Aqui ele valida as variáveis de ambiente.

if (_env.success === false) {
  console.error('⚠️ Invalid environment variables', _env.error.format()) // Se as variáveis de ambiente estiverem incorretas ou faltando, mostra um erro no terminal e interrompe a aplicação.

  throw new Error('Invalid environment variables.')
}


export const env = _env.data // Aqui é exportado um objeto chamado env com todas as variáveis já validadas e com os tipos corretos.



// ### EXPLICAÇÕES:

// Esse arquivo é um dos mais importantes da sua aplicação — ele é responsável por CARREGAR E VALIDAR as 'variáveis de ambiente' do seu projeto.
// É útil quando não queremos expor conteúdo sensível na aplicação, ex: senhas, portas de API... 
// Ele é acompanhado do arquivo '.env.example' que contém os VALORES daas variáveis 
