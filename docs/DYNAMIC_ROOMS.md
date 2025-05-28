## 💡 How Dynamic Room Creation Works (Production Workflow)

### 1. **Create Chatroom Page**

Facilitator visits something like `/rooms/new` and submits:

- Room title
- Optional password
- Start + end time

This hits an API route like `POST /api/rooms` and stores the new room in the DB.

---

### 2. **Generate a Unique URL**

After room creation, redirect the facilitator to:

```
/chat/<roomId>      ← UUID, slug, or short ID
```

Frontend renders the chat UI scoped to that room.

---

### 3. **Routing**

You’ll need dynamic routing in Next.js:

```
/chat/[roomId]/page.tsx
```

This component:

- Loads messages via `/api/rooms/:roomId/messages`
- Connects to WebSocket room `roomId`
- Fetches room metadata (title, times, etc.)
- Enforces read-only behaviour post end-time

---

### 4. **Room Joining for Participants**

- They receive a link: `/chat/<roomId>`
- If protected, prompt for a password (compare against bcrypt hash)
- Set alias
- Join WebSocket room `roomId`
- Messages + presence scoped to that room

---

## 🔐 Backend Logic You Need

- `POST /api/rooms` → creates chatroom
- `GET /api/rooms/:roomId` → returns metadata
- `GET /api/rooms/:roomId/messages` → loads history
- `POST /api/rooms/:roomId/messages` → writes message
- WebSocket `join-room` event with `roomId`

---

## 🗂 DB Schema Minimum

```prisma
model Chatroom {
  id           String   @id @default(uuid())
  title        String
  passwordHash String?
  startTime    DateTime
  endTime      DateTime
  messages     Message[]
}
```

---

You’ve already built the basic infrastructure (global chatroom). Now you just need to:

1. Scope all logic to `roomId`
2. Make routes + WebSocket room-based
3. Add a form to create rooms
