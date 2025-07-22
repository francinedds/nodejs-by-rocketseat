import { app } from './app'
import { env } from './env'

app
  .listen({
    port: env.PORT, // port = variável ambiente definida em .env
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })
// Aqui o Fastify começa a "escutar" a porta especificada (por padrão, 3333 se não houver .env).
// Quando o servidor inicia com sucesso, imprime no terminal: HTTP Server Running!



// ### EXPLICAÇÕES:

// Esse é o arquivo final que inicia seu servidor — é aqui que a aplicação realmente começa a rodar e escutar requisições HTTP!
// Esse código importa o app (que você definiu no app.ts) e inicia o servidor usando a PORTA definida nas variáveis de ambiente.