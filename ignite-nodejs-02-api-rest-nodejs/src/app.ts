import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { transactionsRoutes } from './routes/transactions'

export const app = fastify() // Cria a aplicação Fastify. Importante ser criado antes das rotas.

app.register(cookie)

app.register(transactionsRoutes, {
  prefix: 'transactions', // Adiciona o prefixo /transactions a TODAS as rotas, ou seja: get/transactions, post/transactions, /transactions/summary, /transactions/:id
})



// ### EXPLICAÇÕES:

// Esse arquivo é o ponto de entrada da sua aplicação Fastify — ele CONFIGURA o app, ADICIONA plugins e REGISTRA as rotas.
// 1. Cria a aplicação Fastify.
// 2. Habilita o suporte a cookies.
// 3. Registra as rotas da API (no caso, as de transactions).