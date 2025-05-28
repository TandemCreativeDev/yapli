# 🚀 Zest MVP (Learning Version)

## Overview

A super-simplified global chat room for learning Prisma, PostgreSQL, and chat app fundamentals using polling. One room, everyone chats together. Perfect for first-time chat app development.

## Core MVP Features

### Single Global Chat Room

- One chat room for everyone
- Enter an **alias** (name) to join
- Send and receive plain text messages
- Messages update every 3 seconds via polling
- All messages persist in database

## Technical Stack

### Frontend

- **Next.js 15** with App Router
- **Tailwind CSS** for basic styling
- **TypeScript** for type safety
- Simple responsive layout

### Backend

- **Next.js API routes** for all endpoints
- **Prisma ORM** for database interactions
- **PostgreSQL** (local dev + Docker production)
- **Polling** every 3 seconds (no WebSockets)

### Database Deployment

- **Development:** Local PostgreSQL installation
- **Production:** Hetzner VPS + Docker PostgreSQL container

### App Deployment

- **Vercel** for Next.js app deployment

## Database Schema

### Messages Table (Single Table)

```sql
id          UUID PRIMARY KEY
alias       TEXT NOT NULL
message     TEXT NOT NULL
timestamp   TIMESTAMP DEFAULT NOW()
```

## API Endpoints

### Messages

- `POST /api/messages` - Send message to global chat
- `GET /api/messages` - Get all messages from global chat

## User Flow

1. Visit the app homepage
2. Enter your alias/name
3. See existing message history
4. Type and send messages
5. Messages auto-refresh every 3 seconds

## Learning Goals

- Setting up Prisma with PostgreSQL
- Creating Next.js API routes
- Building a simple chat interface
- Understanding polling vs real-time
- Docker containerization
- VPS deployment and management
- Testing across different machines

---

# 📋 Development Todo List

## 1. Local Development Setup

- [x] Create new Next.js project with TypeScript
- [x] Install Tailwind CSS
- [x] Set up basic project structure
- [x] Install PostgreSQL locally (brew/apt/installer)
- [x] Create local development database
- [x] Test dev server and database connection

## 2. Prisma Setup

- [ ] Install Prisma CLI and client
- [ ] Initialize Prisma in project
- [ ] Create Messages schema in Prisma
- [ ] Configure database URL for local development
- [ ] Run first migration locally
- [ ] Test Prisma Client connection

## 3. API Routes Development

- [ ] Create `POST /api/messages` endpoint with Prisma
- [ ] Create `GET /api/messages` endpoint with Prisma
- [ ] Add request validation and error handling
- [ ] Test API routes with Postman/curl locally
- [ ] Add basic CORS configuration

## 4. Frontend Components

- [ ] Create simple homepage layout
- [ ] Build alias input form component
- [ ] Create message list component with styling
- [ ] Build message input form component
- [ ] Add basic Tailwind responsive design
- [ ] Implement local storage for alias persistence

## 5. Chat Functionality Integration

- [ ] Connect message form to POST API endpoint
- [ ] Connect message list to GET API endpoint
- [ ] Implement polling mechanism (setInterval every 3 seconds)
- [ ] Add message timestamps and formatting
- [ ] Handle loading states and basic error scenarios
- [ ] Test full chat flow locally

## 6. Production Database Setup

- [ ] Create Hetzner VPS instance
- [ ] Install Docker and Docker Compose on VPS
- [ ] Create docker-compose.yml for PostgreSQL
- [ ] Configure PostgreSQL environment variables
- [ ] Set up Docker volumes for data persistence
- [ ] Start PostgreSQL container and test connection

## 7. Production Database Configuration

- [ ] Configure VPS firewall (allow PostgreSQL port from Vercel)
- [ ] Set up SSL/TLS for database connection
- [ ] Create production database and user
- [ ] Test remote connection from local machine
- [ ] Run Prisma migrations on production database

## 8. Environment Configuration

- [ ] Create .env.local for development
- [ ] Create .env.production variables
- [ ] Configure Prisma for multiple environments
- [ ] Set up Vercel environment variables
- [ ] Test database connections in both environments

## 9. Production Deployment

- [ ] Deploy Next.js app to Vercel
- [ ] Configure production database URL in Vercel
- [ ] Test production deployment
- [ ] Verify database connectivity from Vercel
- [ ] Run final migration check

## 10. Testing & Verification

- [ ] Test chat from multiple devices/browsers
- [ ] Verify messages persist after browser refresh
- [ ] Confirm polling works correctly in production
- [ ] Test basic error scenarios (network issues, etc.)
- [ ] Verify alias persistence across sessions
- [ ] Load test with multiple concurrent users

## 11. Basic Security & Monitoring

- [ ] Add basic rate limiting to API routes
- [ ] Configure VPS security (SSH keys, firewall)
- [ ] Set up basic database backups
- [ ] Add simple logging for debugging
- [ ] Monitor VPS resource usage

---

**Docker Compose Example for Production:**

```yaml
# docker-compose.yml for Hetzner VPS
version: "3.8"
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: zest_chat
      POSTGRES_USER: zest_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

**Total estimated time: 2-3 days for a beginner**
