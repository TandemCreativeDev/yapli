const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { Server: SocketIOServer } = require('socket.io')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = 3000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })

  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: dev ? ['http://localhost:3000'] : false,
      methods: ['GET', 'POST']
    }
  })

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id)

    // Join the global chat room
    socket.join('global-chat')

    // Handle new messages
    socket.on('send-message', (data) => {
      console.log('Message received:', data)
      // Broadcast to all clients in the global chat
      io.to('global-chat').emit('new-message', {
        id: `temp-${Date.now()}-${Math.random()}`,
        alias: data.alias,
        message: data.message,
        timestamp: new Date().toISOString()
      })
    })

    // Handle alias updates (for presence tracking)
    socket.on('set-alias', (alias) => {
      socket.data.alias = alias
      console.log(`User ${socket.id} set alias to: ${alias}`)
      
      // Broadcast updated user list
      const users = Array.from(io.sockets.sockets.values())
        .filter(s => s.data.alias)
        .map(s => s.data.alias)
      
      io.to('global-chat').emit('users-updated', [...new Set(users)])
    })

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id)
      
      // Broadcast updated user list after disconnect
      setTimeout(() => {
        const users = Array.from(io.sockets.sockets.values())
          .filter(s => s.data.alias)
          .map(s => s.data.alias)
        
        io.to('global-chat').emit('users-updated', [...new Set(users)])
      }, 100)
    })
  })

  // Store io instance globally for access in API routes
  global.io = io

  httpServer
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
    })
})