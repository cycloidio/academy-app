import { createServer } from 'node:http'
import { handler, readConfig } from './app.js'

const port = Number(process.env.PORT || 8080)
const server = createServer(handler(readConfig()))

server.listen(port, () => console.log(`academy-app listening on port ${port}`))

// Kubernetes stops a pod with SIGTERM: finish the requests in flight, then exit.
process.on('SIGTERM', () => server.close(() => process.exit(0)))
