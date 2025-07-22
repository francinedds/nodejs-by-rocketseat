import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../src/app'

describe('Transactions routes', () => { // Agrupa todos os testes relacionados às rotas de transações (/transactions).
  beforeAll(async () => {    // Executado uma vez antes de todos os testes. 
    await app.ready()        // Aqui, ele espera a aplicação estar pronta (garante que tudo estará pronto)(app.ready()).
  })

  afterAll(async () => {    // Executado uma vez após todos os testes.
    await app.close()       // Aqui, ele fecha a aplicação (app.close()).
  })

  beforeEach(() => {       // Executado antes de cada teste individual. Ele: Apaga todas as migrações do banco (rollback). Reaplica as migrações (latest).
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })
  // Isso garante que cada teste comece com o banco limpo, garantindo isolamento e consistência.

  // TESTES INDIVIDUAIS
  it('should be able to create a new transaction', async () => {  // 1. Criar uma nova transação
    await request(app.server) // Faz requisições HTTP simuladas para a aplicação
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit',
      })
      .expect(201) // Verifica se os resultados das respostas são os esperados
  })

  it('should be able to list all transactions', async () => {   // 2. Listar todas as transações
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie') // Aqui, o código está pegando os cookies que vieram da resposta da requisição anterior

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    expect(listTransactionsResponse.body.transactions).toEqual([   // O que é esperado no corpo da requisição
      expect.objectContaining({     // Aqui espera um objeto contendo as seguintes informações(propriedades):
        title: 'New transaction',
        amount: 5000,
      }),
    ])
  })

  it('should be able to get a specific transaction', async () => {   // 3. Buscar uma transação específica por ID 
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    const transactionId = listTransactionsResponse.body.transactions[0].id

    const getTransactionResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(getTransactionResponse.body.transaction).toEqual(
      expect.objectContaining({
        title: 'New transaction',
        amount: 5000,
      }),
    )
  })

  it('should be able to get the summary', async () => {   // 4. Obter o resumo das transações
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Credit transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send({
        title: 'Debit transaction',
        amount: 2000,
        type: 'debit',
      })

    const summaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)
      .expect(200)

    expect(summaryResponse.body.summary).toEqual({
      amount: 3000,
    })
  })
})



// ### EXPLICAÇÕES:

// Esse é um tipo de Teste End2End (Teste E2E envolve todo o sistema rodando como em produção, mesmo que sem interface gráfica, como o caso de um backend.)

// Uma breve explicação sobre esses métodos:

// beforeAll
// É uma função que é executada uma única vez antes de todos os testes. É útil para inicializar recursos compartilhados que serão utilizados pelos testes.

// beforeEach
// É uma função que é executada antes de cada teste. É útil para preparar o ambiente antes da execução de cada teste, por exemplo, inicializar variáveis ou limpar o banco de dados.

// afterAll
// É uma função que é executada uma única vez após todos os testes terem sido executados. É útil para limpar recursos compartilhados ou fechar conexões abertas.

// afterEach
// É uma função que é executada após cada teste. É útil para limpar o ambiente depois da execução de cada teste, por exemplo, limpar variáveis ou fechar conexões com o banco de dados.