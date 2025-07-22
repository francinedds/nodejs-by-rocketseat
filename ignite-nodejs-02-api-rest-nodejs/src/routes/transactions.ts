import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function transactionsRoutes(app: FastifyInstance) {
  // GET / → Listar transações da sessão
  app.get(   
    '/',
    {
      preHandler: [checkSessionIdExists], // PreHandler é uma função (ou array de funções) que é executada ANTES da rota principal.
                                          // Ele está dizendo que, ANTES de executar a rota, o Fastify deve EXECUTAR a função checkSessionIdExists.
    },
    async (request) => {
      const { sessionId } = request.cookies

      const transactions = await knex('transactions')
        .where('session_id', sessionId)
        .select()

      return { transactions }
    },
  )
  // RESUMO:
  // Verifica se sessionId existe no cookie.
  // Busca todas as transações dessa sessão no banco.
  // Retorna um array com os dados.

  // GET /:id → Buscar uma transação específica
  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const getTransactionsParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getTransactionsParamsSchema.parse(request.params)

      const { sessionId } = request.cookies

      const transaction = await knex('transactions')
        .where({
          session_id: sessionId,
          id,
        })
        .first()

      return {
        transaction,
      }
    },
  )
  // RESUMO:
  // Valida que id é um UUID com zod.
  // Busca uma transação específica por 'id' e 'sessionId'.
  // Retorna essa transação.
 
  // GET /summary → Retorna o total das transações (resumo)
  app.get(
    '/summary',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies

      const summary = await knex('transactions')
        .where('session_id', sessionId)
        .sum('amount', { as: 'amount' })
        .first()

      return { summary }
    },
  )
  // RESUMO:
  // Soma todos os valores da coluna 'amount' (créditos positivos, débitos negativos).
  // Retorna o total como summary.

  // POST / → Criar nova transação
  app.post('/', async (request, reply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body,
    )

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      reply.setCookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days // Ou será ficará salvo por 7 dias
      })
    }

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1, // Débito vira negativo
      session_id: sessionId,
    })

    return reply.status(201).send()
  })
  // RESUMO:
  // Valida o corpo da requisição com zod.
  // Gera um 'sessionId' se não existir (e salva em cookie).
  // Insere a transação no banco (débito vira valor negativo).
  // Retorna status 201 (created).
}



// ### EXPLICAÇÕES:

//  Esse arquivo define as rotas da API para a entidade 'transactions' usando o framework Fastify e o banco de dados acessado via Knex.

// O que é 'sessionId'?
// É um identificador único por sessão de usuário (cookie). Ele permite que:
// O usuário não precise estar logado.
// Cada visitante tenha suas próprias transações separadas.
// O Fastify identifique o usuário só pelo cookie sessionId.

// O que é '.parse()'?
// Valida o valor passado conforme o esquema definido.
// Se for válido, retorna o valor com os tipos corretos.
// Se for inválido, lança um erro com mensagens explicando o problema.
// Quando usar '.parse()'?
// Use .parse() quando:
// Você quer garantir 100% que os dados estão certos.
// Pode deixar o Zod lançar erro automaticamente se algo estiver errado.
// Se quiser evitar que ele lance erro automaticamente, use .safeParse() (retorna { success: true | false } em vez de lançar erro).