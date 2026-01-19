# Local Development Setup

## Prerequisites

- Docker installed (if running containerised database locally)
- Node.js installed
- npm installed

## Option 1: Local PostgreSQL (no Docker - simplest recommended)

```bash
# Create the database
createdb yapli_db

# Set DATABASE_URL in .env
# DATABASE_URL="postgresql://localhost:5432/yapli_db"

# Run migrations
npx prisma migrate deploy

# Seed the database
psql -d yapli_db < prisma/seed.sql

# Run the app
npm run dev
```

## Option 2: Docker Database + Local App

### 1. Create the external network

```bash
docker network create yapli-tunnel
```

### 2. Start only the database

```bash
POSTGRES_USER=postgres POSTGRES_PASSWORD=postgres POSTGRES_DB=yapli_db docker compose up -d db
```

### 3. Run migrations

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/yapli_db" npx prisma migrate deploy
```

### 4. Seed the database

```bash
docker compose exec -T db psql -U postgres -d yapli_db < prisma/seed.sql
```

### 5. Run the app locally

```bash
npm run dev
```

Then open http://localhost:3000

## Option 3: Simpler Local Setup

Create a `docker-compose.local.yml`:

```yaml
services:
  db:
    image: postgres:17-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: yapli_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Then run:

```bash
# Start database
docker compose -f docker-compose.local.yml up -d

# Run migrations
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/yapli_db" npx prisma migrate deploy

# Seed
psql -h localhost -U postgres -d yapli_db < prisma/seed.sql

# Run app
npm run dev
```
