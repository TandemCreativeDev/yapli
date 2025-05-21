# ZEST Project Standards & Guidelines

## Code Style

- Use TypeScript for all new code
- Follow ESLint configuration rules
- Use functional components with hooks for React
- Prefer server components where possible in Next.js

## Project Structure

- `/src/app` - Next.js App Router pages and layouts
- `/src/components` - Reusable UI components
- `/src/lib` - Utility functions and shared logic
- `/src/services` - External service integrations (auth, websocket, etc.)
- `/src/types` - TypeScript type definitions
- `/src/hooks` - Custom React hooks
- `/public` - Static assets

## Development Workflow

- Run development server with: `npm run dev`
- Build project with: `npm run build`
- Lint project with: `npm run lint`

## Naming Conventions

- **Components**: PascalCase (e.g., `MessageList.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useWebSocket.ts`)
- **Utilities**: camelCase (e.g., `formatTimestamp.ts`)
- **Types/Interfaces**: PascalCase (e.g., `Message.ts`)
- **CSS modules**: camelCase (e.g., `styles.module.css`)

## Commit Guidelines

- Use clear, concise commit messages
- Reference ticket/issue numbers when applicable
- Keep commits focused on single concerns

## Testing

- Unit tests should accompany new components
- Integration tests should verify full user flows
- Run tests before submitting PRs

## Security

- NEVER store sensitive information in client code
- ALWAYS hash passwords with bcrypt
- Use httpOnly cookies for authentication
- Sanitize user input before storing or displaying

## Accessibility

- Ensure proper heading hierarchy
- Include alt text for all images
- Maintain keyboard navigability
- Aim for WCAG AA compliance minimum

## Performance

- Minimize bundle size with dynamic imports when appropriate
- Use optimized images and assets
- Implement proper pagination for data fetching
- Consider SSR/SSG for appropriate pages

## Documentation

- Document complex logic with clear comments
- Maintain up-to-date READMEs
- Document API endpoints clearly
- Create/update architectural docs for major changes

