const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server: SocketIOServer } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  });

  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: dev ? ["http://localhost:3000"] : false,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    // Handle joining a specific room
    socket.on("join-room", (roomId) => {
      // Leave any previously joined rooms (except the socket's own room)
      const rooms = Array.from(socket.rooms);
      rooms.forEach((room) => {
        if (room !== socket.id) {
          socket.leave(room);
        }
      });

      // Join the specified room
      socket.join(roomId);
      socket.data.currentRoom = roomId;

      // Broadcast updated user list for this room
      updateRoomUsers(roomId);
    });

    // Handle setting alias in current room
    socket.on("set-alias", (alias) => {
      const roomId = socket.data.currentRoom;

      if (roomId) {
        // Check if alias is already taken in this room
        const room = io.sockets.adapter.rooms.get(roomId);
        if (room) {
          const existingAliases = Array.from(room)
            .map((socketId) => io.sockets.sockets.get(socketId))
            .filter(
              (s) =>
                s &&
                s.data.alias &&
                s.data.currentRoom === roomId &&
                s.id !== socket.id,
            )
            .map((s) => s.data.alias);

          if (existingAliases.includes(alias)) {
            // Reject the alias and notify the client
            socket.emit("alias-rejected", {
              reason:
                "This name is already taken in this room. Please choose a different name.",
            });
            return;
          }
        }
      }

      socket.data.alias = alias;

      if (roomId) {
        updateRoomUsers(roomId);
      }
    });

    // Handle new messages with room context
    socket.on("send-message", (data) => {
      const { roomId, alias, message } = data;

      // Broadcast to all clients in the specific room
      io.to(roomId).emit("new-message", {
        id: `temp-${Date.now()}-${Math.random()}`,
        chatroomId: roomId,
        alias,
        message,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on("disconnect", () => {
      const roomId = socket.data.currentRoom;

      // Broadcast updated user list after disconnect
      if (roomId) {
        setTimeout(() => {
          updateRoomUsers(roomId);
        }, 100);
      }
    });

    // Helper function to update users list for a specific room
    function updateRoomUsers(roomId) {
      const room = io.sockets.adapter.rooms.get(roomId);
      if (!room) return;

      const users = Array.from(room)
        .map((socketId) => io.sockets.sockets.get(socketId))
        .filter((s) => s && s.data.alias && s.data.currentRoom === roomId)
        .map((s) => s.data.alias);

      io.to(roomId).emit("users-updated", [...new Set(users)]);
    }
  });

  // Store io instance globally for access in API routes
  global.io = io;

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {});
});

