// Importa a função `randomUUID` para gerar identificadores únicos
import { randomUUID } from 'node:crypto'

// Importa uma classe de banco de dados local (provavelmente baseado em memória)
import { Database } from './database.js'

// Função utilitária para construir caminhos de rotas com parâmetros, como /users/:id
import { buildRoutePath } from './utils/build-route-path.js'

// Cria uma instância do banco de dados
const database = new Database()

// Exporta um array de rotas que serão usadas pelo servidor
export const routes = [
  {
    // Rota para LISTAR usuários
    method: 'GET',
    path: buildRoutePath('/users'),
    handler: (req, res) => {
      const { search } = req.query

      // Se houver um parâmetro `search`, filtra por nome ou email
      const users = database.select('users', search ? {
        name: search,
        email: search
      } : null)

      // Retorna os usuários encontrados como JSON
      return res.end(JSON.stringify(users))
    }
  },
  {
    // Rota para CRIAR um novo usuário
    method: 'POST',
    path: buildRoutePath('/users'),
    handler: (req, res) => {
      const { name, email } = req.body

      // Cria um objeto usuário com um ID único
      const user = {
        id: randomUUID(),
        name,
        email,
      }

      // Insere o usuário no banco de dados
      database.insert('users', user)

      // Retorna status 201 (Created) - Isso é um Status Code
      return res.writeHead(201).end()
    }
  },
  {
    // Rota para ATUALIZAR um usuário existente
    method: 'PUT',
    path: buildRoutePath('/users/:id'), // ":id" é um parâmetro da rota
    handler: (req, res) => {
      const { id } = req.params
      const { name, email } = req.body

      // Atualiza os dados do usuário no banco
      database.update('users', id, {
        name,
        email,
      })

      // Retorna status 204 (No Content) - Isso é um Status Code
      return res.writeHead(204).end()
    }
  },
  {
    // Rota para deletar um usuário
    method: 'DELETE',
    path: buildRoutePath('/users/:id'),
    handler: (req, res) => {
      const { id } = req.params

      // Remove o usuário do banco
      database.delete('users', id)

      // Retorna status 204 (No Content) - Isso é um Status Code
      return res.writeHead(204).end()
    }
  }
]
