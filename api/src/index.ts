import Fastify from 'fastify'

const app = Fastify()

app.get('/ping', async () => {
  return { pong: true }
})

app.listen({ port: 3000 }).then(() => {
  console.log('API running on http://localhost:3000')
})
