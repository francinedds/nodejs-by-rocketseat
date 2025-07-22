import { FastifyReply, FastifyRequest } from 'fastify'

export async function checkSessionIdExists(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const sessionId = request.cookies.sessionId

  if (!sessionId) {
    return reply.status(401).send({ 
      error: 'Unauthorized.',
      // Se não houver sessionId no cookie, a função responde com:
      // Status 401 (Unauthorized): significa que o cliente não tem permissão para acessar esse recurso.
      // Um JSON com uma mensagem de erro.
    })
  }
}

// ### EXPLICAÇÕES:
// O que faz:
// Define uma função middleware (ou hook) chamada checkSessionIdExists, que será executada antes de certas rotas, para verificar se o usuário tem um sessionId válido.
// Ela recebe:
// request: a requisição vinda do cliente.
// reply: o objeto usado para responder ao cliente.



