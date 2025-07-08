# Contributing to Yapli

## Prerequisites

- Node.js 18+
- npm package manager

## Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables into `.env.local` (see `.env.example`)
4. Start development server: `npm run dev`

## Code Standards

For detailed development standards, see [CLAUDE.md](CLAUDE.md).

## Project Structure

- `/src/app` - Next.js App Router pages and API routes
- `/src/components` - Reusable UI components (all components are located in this folder)
- `/src/lib` - Utility functions and shared logic
- `/prisma` - Database schema and migrations

## Database Schema

<img width="1300" height="608" alt="Image" src="https://github.com/user-attachments/assets/236b5cca-eb71-4033-9fc5-8240ece0fcad" />

## API Routes

| Route                          | Method | Input                        | Output                                                           |
| ------------------------------ | ------ | ---------------------------- | ---------------------------------------------------------------- |
| `/api/auth/register`           | POST   | `{ name?, email, password }` | `{ user: { id, name, email } }`                                  |
| `/api/link-preview`            | GET    | `?url=<url>`                 | `{ url, title, description, images, siteName, favicon, domain }` |
| `/api/rooms`                   | GET    | -                            | `Array<{ id, roomUrl, title, createdAt, messageCount }>`         |
| `/api/rooms`                   | POST   | `{ title }`                  | `{ roomUrl, title }`                                             |
| `/api/rooms/check`             | POST   | `{ roomUrl }`                | `{ exists: boolean, roomUrl? }`                                  |
| `/api/rooms/[roomId]`          | GET    | -                            | `{ id, roomUrl, title, createdAt, messageCount, userId }`        |
| `/api/rooms/[roomId]`          | DELETE | -                            | `{ success: boolean }`                                           |
| `/api/rooms/[roomId]/messages` | GET    | -                            | `Array<{ id, alias, message, timestamp }>`                       |
| `/api/rooms/[roomId]/messages` | POST   | `{ alias, message }`         | `{ id, alias, message, timestamp }`                              |
