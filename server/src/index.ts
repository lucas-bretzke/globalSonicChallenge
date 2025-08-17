import express from 'express'
import http from 'http'
import { Server as SocketIOServer } from 'socket.io'
import dotenv from 'dotenv'
import { json } from 'express'
import deviceRoutes from './routes/deviceRoutes'
import { errorHandler } from './middlewares/errorHandler'

dotenv.config()

const app = express()
const server = http.createServer(app)
const io = new SocketIOServer(server, {
  cors: { origin: '*' }
})

app.use(json())
app.use((req, res, next) => {
  req['io'] = io
  next()
})

app.use('/api/devices', deviceRoutes)
app.use(errorHandler)

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export { io }
