# Deployment Architecture

## Overview

This project uses NGINX as a reverse proxy to handle all external traffic, with all other services running internally behind it.

## Architecture Benefits

1. **Expose only NGINX**, keep all other containers internal (API, WebSocket, DB, Redis).
2. **NGINX handles HTTPS** (TLS termination) using Let's Encrypt or manual certs.
3. **Routes traffic**: `/` → frontend, `/api` → API, `/ws` → WebSocket server.
4. **Supports WebSocket upgrades** out of the box.
5. **Simplifies domain setup**: one domain, no port juggling or subdomains.
6. **Centralised TLS config** – no need to manage certs in multiple containers.
7. **Improves security**: API and DB are never exposed publicly.
8. **Enables rate limiting, caching, and headers** in one place.
9. **Keeps system modular** and production-ready.
10. **Dropping NGINX breaks all this** – so don't.

## Service Architecture

```
Internet → NGINX (Port 443/80) → Internal Network
                ├── Frontend (/)
                ├── API (/api)
                ├── WebSocket (/ws)
                └── Static Assets
```

## Internal Services

- **Frontend**: Next.js application
- **API**: Backend API server
- **WebSocket**: Real-time communication server
- **Database**: PostgreSQL/MySQL (internal only)
- **Redis**: Caching and session storage (internal only)

## Security Model

- Only NGINX is exposed to the internet
- All other services communicate over internal Docker network
- TLS termination handled centrally at NGINX
- Database and Redis never exposed publicly
- Rate limiting and security headers configured at proxy level

## Deployment Considerations

- Single domain with path-based routing
- Centralized certificate management
- Horizontal scaling possible behind NGINX
- Health checks and load balancing at proxy level
- Logging and monitoring centralized through NGINX