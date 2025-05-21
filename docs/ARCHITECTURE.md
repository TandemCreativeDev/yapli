# 🏗️ Project Architecture

## Frontend

- **Next.js (App Router)**, responsive layout
  - Version: ^15.3.2
  - React: ^19.0.0
- WebSockets for live messaging and alias tracking
- Styling with Tailwind CSS v4
- Light/Dark mode toggle
- UI Components:
  - Message list: continuous scroll, auto-scrolls to bottom on new message
  - Timestamp, alias, and message displayed for each post
  - "Copy" button per message
  - Responsive design for all device sizes

## Backend

- **PostgreSQL** for persistent data (hosted or local)
- **Node.js WebSocket server** (self-hosted) for real-time events
- REST/GraphQL API for chatroom creation, login, message history, etc.
- Session management via cookies or secure tokens (httpOnly)
- Passwords (both user and room) hashed using bcrypt

## Development Infrastructure

- TypeScript for type safety
- ESLint for code quality
- Next.js App Router for routing and server components
- Turbopack for fast development experience

# 🗃️ Database Schema

## Users (facilitators)

```sql
id UUID PK
email TEXT UNIQUE
password_hash TEXT
created_at TIMESTAMP
auth_provider TEXT
```

## Chatrooms

```sql
id UUID PK
user_id FK -> Users(id)
title TEXT UNIQUE (per user)
start_time TIMESTAMP
end_time TIMESTAMP
password_hash TEXT
created_at TIMESTAMP
```

## Messages

```sql
id UUID PK
chatroom_id FK -> Chatrooms(id)
alias TEXT
message TEXT
timestamp TIMESTAMP
```

## ActiveSessions (in-memory or ephemeral store, e.g. Redis)

```
chatroom_id -> Set of aliases (for presence tracking)
```

# 🧪 Development Notes

- Use `socket.io` or `ws` for WebSockets
- Use Prisma or another ORM for DB handling
- Consider Redis or in-memory store for live alias tracking
- Deploy backend + WebSocket server together if self-hosted (e.g. DigitalOcean, Railway)
- Frontend deployable separately (e.g. Vercel) if using external WebSocket server

# System Architecture Diagram

```
+----------------------------------+
|          CLIENT BROWSER          |
|                                  |
| +------------+   +------------+  |
| | Next.js    |   | WebSocket  |  |
| | App Router |<->| Connection |  |
| +------------+   +------------+  |
+--------^------------------^------+
         |                  |
         |                  |
+--------v--------+  +------v------+
|                 |  |             |
| NEXT.JS SERVER  |  | WEBSOCKET   |
| - Auth          |  | SERVER      |
| - API Routes    |  | - Live Chat |
| - SSR/SSG       |  | - Presence  |
|                 |  |             |
+---------^-------+  +------^------+
          |                 |
          |                 |
+---------v-----------------v------+
|                                  |
|          POSTGRESQL DB           |
|                                  |
| +------------+ +---------------+ |
| | User Data  | | Message Store | |
| +------------+ +---------------+ |
|                                  |
+----------------------------------+
```

