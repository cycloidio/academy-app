import { createServer } from 'node:http'
import { handler, readConfig } from './app.js'

const port = Number(process.env.PORT || 8080)
const config = readConfig()
const server = createServer(handler(config))

server.listen(port, () => console.log(`${config.service} listening on port ${port}`))

// Kubernetes stops a pod with SIGTERM: finish the requests in flight, then exit.
process.on('SIGTERM', () => server.close(() => process.exit(0)))
