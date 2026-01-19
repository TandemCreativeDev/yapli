# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2025-01-19

### Changed

- **Deployment Architecture**
  - Migrated from Traefik reverse proxy to Cloudflare Tunnel for secure external access
  - Container naming: `yapli_app` (application), `yapli_db` (database)
  - Docker network: `yapli-tunnel` (external network for Cloudflare integration)
  - Removed port mappings from application container (handled by Cloudflare Tunnel)
  - Updated Node.js base image to 22-alpine
  - Added Socket.io installation to production Dockerfile for WebSocket support
- **Database Scripts**
  - Added `db:generate` - Generate Prisma client
  - Added `db:migrate` - Run database migrations in development
  - Added `db:migrate:deploy` - Deploy migrations to production
  - Added `db:push` - Push schema changes without migrations
  - Added `db:studio` - Open Prisma Studio GUI
  - Added `db:setup` - Create database and run initial migrations
  - Added `db:reset` - Drop, recreate, and migrate database

### Fixed

- WebSocket connectivity through reverse proxies with `allowEIO3` and explicit transports configuration

## [0.1.0] - 2025-02-06

### Added

- Initial release of Yapli - a modern, minimalist web-based chatroom application
- **Dynamic Room Management**
  - Create unlimited chat rooms with custom titles
  - Unique shareable URLs for each room (`/[roomId]`)
  - Room isolation with per-room message and presence tracking
  - Real-time room deletion with trash icon interface
- **Real-time Chat Features**
  - Instant messaging with WebSocket integration via Socket.io
  - Live presence tracking showing online users
  - Automatic link detection and conversion to clickable links
  - Message persistence with timestamp display
  - Link preview functionality for shared URLs
- **Modern UI/UX**
  - Beautiful dark theme with #ffc100 yellow accents
  - Responsive design for all screen sizes
  - Consistent branding with integrated Yapli logo
  - Smooth hover animations and transitions
  - Icon-based UI with Heroicons for intuitive interactions
- **Security & Accessibility**
  - Secure external link handling with `noopener noreferrer`
  - Keyboard navigation support
  - Cross-browser compatibility
  - Input validation and sanitization
- **Database & Architecture**
  - PostgreSQL database with Prisma ORM
  - Database migrations for rooms and messages
  - RESTful API endpoints for room and message management
- **Development & Deployment**
  - Docker containerization with multi-stage builds
  - Docker Compose setup with PostgreSQL service
  - Health checks for database connectivity
  - Production-ready configuration with environment variables
  - ESLint configuration for code quality
  - TypeScript support throughout the application

### Technical Stack

- **Frontend**: Next.js 15.3.2 with React 19
- **Styling**: Tailwind CSS v4 with custom dark theme
- **Real-time Communication**: Socket.io 4.8.1
- **Database**: PostgreSQL with Prisma ORM 6.8.2
- **UI Components**: Heroicons 2.2.0
- **Link Processing**: Linkifyjs 4.3.1 and link-preview-js 3.1.0
- **Runtime**: Node.js 22-alpine (Docker)

### Deployment Architecture

- **Infrastructure**: Hetzner VPS hosting
- **External Access**: Cloudflare Tunnel (no port exposure required)
- **Container Orchestration**: Docker Compose with 2 containers:
  - `yapli_app`: Next.js application container (Node.js 22-alpine)
  - `yapli_db`: PostgreSQL 17 database container
- **Networking**: External Docker network `yapli-tunnel` for Cloudflare integration
- **Data Persistence**: PostgreSQL data stored in named Docker volume
- **Health Monitoring**: Database health checks with 10s intervals
- **Restart Policy**: `unless-stopped` for both containers
- **Environment Management**: Production environment variables via `.env.production`
- **Container Dependencies**: App container depends on healthy PostgreSQL service

### Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run start` - Production server with environment configuration
- `npm run lint` - Code linting
- `npm run test` - Run test suite
- `npm run test:watch` - Run tests in watch mode
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations (development)
- `npm run db:migrate:deploy` - Deploy migrations (production)
- `npm run db:push` - Push schema changes without migrations
- `npm run db:studio` - Open Prisma Studio GUI
- `npm run db:setup` - Create database and run initial setup
- `npm run db:reset` - Reset database (drop, recreate, migrate)
