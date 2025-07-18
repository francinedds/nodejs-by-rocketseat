// Importa o módulo HTTP nativo do Node.js para criar o servidor
import http from 'node:http'

// Middleware para interpretar o corpo da requisição como JSON
import { json } from './middlewares/json.js'

// Importa o array de rotas definidas no arquivo routes.js (que você mostrou antes)
import { routes } from './routes.js'

// Função para extrair parâmetros da query string da URL
import { extractQueryParams } from './utils/extract-query-params.js'

// Cria um servidor HTTP que vai tratar cada requisição recebida
const server = http.createServer(async (req, res) => {
  const { method, url } = req

  // Aplica o middleware json para ler e parsear o corpo JSON da requisição
  await json(req, res)

  // Encontra a rota que bate com o método HTTP e a URL da requisição
  const route = routes.find(route => {
    // A propriedade `path` é um regex para casar a rota (ex: /users/:id)
    return route.method === method && route.path.test(url)
  })

  if (route) {
    // Extrai os parâmetros da rota a partir da URL usando regex
    const routeParams = req.url.match(route.path)

    // Pega o grupo "query" da regex (parte depois do ? na URL)
    const { query, ...params } = routeParams.groups

    // Adiciona os parâmetros da rota na requisição para o handler usar
    req.params = params

    // Extrai e parseia os parâmetros da query string em um objeto
    req.query = query ? extractQueryParams(query) : {}

    // Chama a função handler da rota, passando req e res
    return route.handler(req, res)
  }

  // Se não encontrou rota correspondente, responde com 404 Not Found - Isso é um Status Code
  return res.writeHead(404).end()
})

// Faz o servidor escutar na porta 3333 por requisições
server.listen(3333)

