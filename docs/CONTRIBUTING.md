# Contributing to Yapli

Thank you for your interest in contributing to Yapli! This guide will help you get started with the contribution process.

## Prerequisites

- Node.js 18+
- npm package manager
- Git

## Getting Started

### 1. Fork the Repository

1. Navigate to the [Yapli repository](https://github.com/tandemhub/yapli)
2. Click the "Fork" button in the top right corner
3. Select your GitHub account as the destination for the fork

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/yapli.git
cd yapli
```

### 3. Set Up the Development Environment

1. Install dependencies: `npm install`
2. Set up environment variables into `.env.local` (see `.env.example`)
3. Start development server: `npm run dev`

### 4. Create a Branch

```bash
git checkout -b your-branch-name
```

### 5. Make Your Changes

- Follow the code standards outlined in [CLAUDE.md](CLAUDE.md)
- Write tests for new functionality
- Ensure your code passes linting: `npm run lint` and `npm run build`

### 6. Commit Your Changes

```bash
git add .
git commit -m "feat: add your feature description"
```

### 7. Push to Your Fork

```bash
git push origin your-branch-name
```

### 8. Create a Pull Request

1. Navigate to your fork on GitHub
2. Click "New Pull Request"
3. Select the base repository (tandemhub/yapli) and base branch (main)
4. Select your fork and feature branch
5. Fill out the pull request template

## Code Standards

For detailed development standards, see [CLAUDE.md](CLAUDE.md).

## Project Structure

- `/src/app` - Next.js App Router pages and API routes
- `/src/components` - Reusable UI components (all components are located in this folder)
- `/src/lib` - Utility functions and shared logic
- `/prisma` - Database schema and migrations

## Database Schema

<img width="1300" alt="Screenshot 2025-07-08 at 13 00 14" src="https://github.com/user-attachments/assets/a4ff65a1-f326-4c2c-a668-aee61059b3dd" />

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
