# Zest Project To-Do List

This document outlines the tasks needed to build the Zest chat application, organized by dependency and logical flow. Each task is designed to be atomic and completable in a single session.

## Project Setup & Infrastructure

### 1. Project Structure Setup
**Description:** Set up the foundational project structure following our architecture guidelines.
**Deliverables:**
- Create recommended directory structure for Next.js app
- Configure ESLint rules for TypeScript and React
- Set up Tailwind CSS with dark mode support
- Add basic layout with theme toggle
**Dependencies:** None
**Definition of Done:** Project successfully runs with `npm run dev` and shows a basic homepage with theme toggle working.

### 2. Database Configuration
**Description:** Set up PostgreSQL database and Prisma ORM.
**Deliverables:**
- Create a PostgreSQL database instance (locally or on Railway/Supabase)
- Install and configure Prisma
- Define initial schema based on our data model
- Add database connection details to environment variables
**Dependencies:** None
**Definition of Done:** Database connection is established and Prisma client can be generated.

### 3. WebSocket Server Scaffold
**Description:** Create a basic Socket.io server for real-time communication.
**Deliverables:**
- Create a new repository for the WebSocket server
- Set up basic Socket.io with Express
- Implement connection/disconnection handling
- Set up CORS for local development
**Dependencies:** None
**Definition of Done:** WebSocket server runs locally and logs connections/disconnections.

### 4. Authentication Setup
**Description:** Implement user authentication using Auth.js.
**Deliverables:**
- Install and configure Auth.js
- Implement email/password authentication
- Set up OAuth providers (Google/GitHub)
- Create sign-in and sign-up pages
**Dependencies:** #1, #2
**Definition of Done:** Users can register, log in, and log out with email/password and OAuth providers.

## Core Backend Functionality

### 5. Database Schema Implementation
**Description:** Implement the full database schema using Prisma.
**Deliverables:**
- Create complete Prisma schema for all models
- Define relationships between models
- Create migration
- Generate Prisma client
**Dependencies:** #2
**Definition of Done:** All models are defined in the Prisma schema, migration runs successfully, and types are generated.

### 6. API Routes for User Management
**Description:** Create API routes for user account management.
**Deliverables:**
- Implement user profile retrieval
- Add routes for account settings
- Secure routes with authentication checks
**Dependencies:** #4, #5
**Definition of Done:** API routes are working and correctly secured, returning appropriate data.

### 7. API Routes for Chatroom Management
**Description:** Create API routes for chatroom CRUD operations.
**Deliverables:**
- Create route for chatroom creation
- Implement listing user's chatrooms
- Add chatroom deletion endpoint
- Add validation for chatroom constraints
**Dependencies:** #5, #6
**Definition of Done:** API endpoints allow creating, listing, and deleting chatrooms with proper validation.

### 8. Password Handling for Chatrooms
**Description:** Implement secure password handling for chatroom access.
**Deliverables:**
- Set up bcrypt for password hashing
- Create endpoint for validating chatroom passwords
- Store hashed passwords in database
**Dependencies:** #7
**Definition of Done:** Chatroom passwords are securely hashed and stored, with validation endpoint working.

### 9. Message Storage Implementation
**Description:** Implement API routes for message persistence.
**Deliverables:**
- Create endpoint for storing messages
- Implement message retrieval by chatroom
- Add message pagination
**Dependencies:** #5, #7
**Definition of Done:** Messages can be stored and retrieved with pagination.

## WebSocket Server Development

### 10. WebSocket Server - Chatroom Functionality
**Description:** Enhance the WebSocket server with chat functionality.
**Deliverables:**
- Implement join/leave chatroom logic
- Set up message broadcasting
- Add chatroom-specific channels
**Dependencies:** #3
**Definition of Done:** Users can join specific chatrooms and send/receive messages in real-time.

### 11. WebSocket Server - Presence Tracking
**Description:** Implement user presence tracking in chatrooms.
**Deliverables:**
- Track active users per chatroom
- Broadcast join/leave events
- Maintain alias lists
**Dependencies:** #10
**Definition of Done:** Chatrooms display the current list of active participants, updating in real-time.

### 12. WebSocket Server - Security & Validation
**Description:** Add security and validation to the WebSocket server.
**Deliverables:**
- Implement authentication token validation
- Add rate limiting for message sending
- Validate chatroom access based on schedule
**Dependencies:** #8, #11
**Definition of Done:** WebSocket connections are secured and validated, with rate limiting and schedule-based access.

## Frontend Components

### 13. Component Library Setup
**Description:** Set up Shadcn UI components for the application.
**Deliverables:**
- Install and configure Shadcn UI
- Set up theme configuration
- Create basic UI component samples
**Dependencies:** #1
**Definition of Done:** Shadcn UI is configured and basic components are available for use.

### 14. Form Validation Setup
**Description:** Configure form validation libraries.
**Deliverables:**
- Set up React Hook Form
- Configure Zod for schema validation
- Create reusable form components
**Dependencies:** #13
**Definition of Done:** Form validation is working with type-safe schemas and reusable components.

### 15. Layout & Navigation Components
**Description:** Create the main layout and navigation components.
**Deliverables:**
- Implement responsive layout with Tailwind
- Create navigation bar/sidebar
- Build footer component
- Implement authenticated routes protection
**Dependencies:** #4, #13
**Definition of Done:** Application has a complete layout with navigation and responsive design.

### 16. Auth UI Components
**Description:** Create authentication-related UI components.
**Deliverables:**
- Build sign-in form
- Create sign-up form
- Implement OAuth buttons
- Add form validation
**Dependencies:** #14, #15
**Definition of Done:** Authentication forms are complete with validation and OAuth support.

### 17. Chatroom Creation & Management UI
**Description:** Build UI for creating and managing chatrooms.
**Deliverables:**
- Create chatroom creation form
- Build dashboard for listing chatrooms
- Implement chatroom deletion UI
- Add date/time pickers for schedules
**Dependencies:** #7, #14, #15
**Definition of Done:** Users can create, view, and delete chatrooms through the UI.

### 18. Chat Interface Components
**Description:** Create the core chat interface components.
**Deliverables:**
- Build message list component
- Create message input form
- Implement alias entry screen
- Add copy functionality for messages
**Dependencies:** #13, #14
**Definition of Done:** Chat interface components are built and working with static data.

## Integration & State Management

### 19. WebSocket Client Hooks
**Description:** Create React hooks for WebSocket functionality.
**Deliverables:**
- Build useWebSocket hook for connection management
- Create useChatroom hook for room-specific logic
- Implement useAlias hook for presence tracking
**Dependencies:** #10, #11
**Definition of Done:** React hooks successfully connect to WebSocket server and provide real-time functionality.

### 20. State Management Setup
**Description:** Implement application state management.
**Deliverables:**
- Set up Zustand for client-side state
- Create stores for UI state
- Implement auth state management
**Dependencies:** #15, #16
**Definition of Done:** Application state is properly managed with Zustand stores.

### 21. Chatroom State Integration
**Description:** Connect chatroom UI with state management and API.
**Deliverables:**
- Integrate chatroom creation with API
- Connect chatroom listing with data fetching
- Implement chatroom deletion with confirmation
**Dependencies:** #7, #17, #20
**Definition of Done:** Chatroom management UI is fully functional with backend API integration.

### 22. Chat Functionality Integration
**Description:** Integrate chat UI with WebSocket and API.
**Deliverables:**
- Connect message list to WebSocket events
- Integrate message sending with WebSocket
- Implement real-time alias list
**Dependencies:** #9, #12, #18, #19
**Definition of Done:** Chat interface is fully functional with real-time messaging and presence tracking.

## Polishing & Features

### 23. Chatroom Access Control
**Description:** Implement time-based access control for chatrooms.
**Deliverables:**
- Add schedule validation to chatroom access
- Implement automatic read-only mode after end time
- Create UI for showing chatroom availability status
**Dependencies:** #12, #21
**Definition of Done:** Chatrooms respect their scheduled time windows for access.

### 24. Transcript View Implementation
**Description:** Create the read-only transcript view for ended chatrooms.
**Deliverables:**
- Build transcript UI component
- Implement conditional rendering based on chatroom status
- Create shareable link functionality
**Dependencies:** #22, #23
**Definition of Done:** Ended chatrooms display a read-only transcript view with shareable links.

### 25. Link Detection in Messages
**Description:** Implement automatic link detection in chat messages.
**Deliverables:**
- Add link detection in message text
- Create clickable link rendering
- Implement security for link handling
**Dependencies:** #22
**Definition of Done:** Links in messages are automatically detected and rendered as clickable elements.

### 26. Copy Message Functionality
**Description:** Implement the ability to copy individual messages.
**Deliverables:**
- Add copy button to messages
- Implement clipboard functionality
- Create visual feedback for copy action
**Dependencies:** #22
**Definition of Done:** Each message has a working copy button with visual feedback.

### 27. Accessibility Improvements
**Description:** Enhance application accessibility.
**Deliverables:**
- Audit and fix heading hierarchy
- Ensure proper keyboard navigation
- Add screen reader support
- Test with accessibility tools
**Dependencies:** #15, #16, #17, #18
**Definition of Done:** Application meets WCAG AA standards and passes accessibility audits.

### 28. Error Handling Implementation
**Description:** Implement comprehensive error handling.
**Deliverables:**
- Create error boundaries for React components
- Implement form error handling
- Add API error handling with user feedback
- Create error pages (404, 500)
**Dependencies:** #21, #22
**Definition of Done:** Application handles errors gracefully with appropriate user feedback.

### 29. Light/Dark Mode Refinement
**Description:** Refine the light/dark mode implementation.
**Deliverables:**
- Ensure consistent styling in both modes
- Add system preference detection
- Implement smooth theme transitions
- Store preference in local storage
**Dependencies:** #1, #15
**Definition of Done:** Theme switching works flawlessly with smooth transitions and persistence.

## Testing & Deployment

### 30. Unit Testing Setup
**Description:** Set up unit testing infrastructure.
**Deliverables:**
- Configure Vitest
- Set up Testing Library
- Create initial test utilities
- Implement first component tests
**Dependencies:** #1
**Definition of Done:** Testing environment is set up with working component tests.

### 31. Authentication Tests
**Description:** Create tests for authentication functionality.
**Deliverables:**
- Test user registration
- Test login flows
- Test password hashing
- Test OAuth integration
**Dependencies:** #4, #30
**Definition of Done:** Authentication flows have comprehensive test coverage.

### 32. API Route Tests
**Description:** Implement tests for API routes.
**Deliverables:**
- Test chatroom API endpoints
- Test user management routes
- Test message storage and retrieval
- Test validation and error responses
**Dependencies:** #6, #7, #9, #30
**Definition of Done:** API routes have comprehensive test coverage.

### 33. WebSocket Server Tests
**Description:** Create tests for WebSocket server functionality.
**Deliverables:**
- Test connection handling
- Test message broadcasting
- Test presence tracking
- Test error scenarios
**Dependencies:** #12, #30
**Definition of Done:** WebSocket server has comprehensive test coverage.

### 34. End-to-End Tests
**Description:** Implement end-to-end tests for critical user flows.
**Deliverables:**
- Configure Playwright
- Test login → create → join → chat flow
- Test time-based access restrictions
- Test transcript visibility
**Dependencies:** #24, #30
**Definition of Done:** Critical user flows have end-to-end test coverage.

### 35. Performance Optimization
**Description:** Optimize application performance.
**Deliverables:**
- Implement code splitting
- Optimize image loading
- Add performance monitoring
- Reduce bundle size
**Dependencies:** #22
**Definition of Done:** Application meets performance benchmarks for load time and interaction.

### 36. Deployment Configuration - Frontend
**Description:** Configure frontend deployment to Vercel.
**Deliverables:**
- Set up Vercel project
- Configure environment variables
- Set up CI/CD pipeline
- Create production build
**Dependencies:** #22, #35
**Definition of Done:** Frontend is successfully deployed to Vercel with a working CI/CD pipeline.

### 37. Deployment Configuration - WebSocket Server
**Description:** Configure WebSocket server deployment to Render.
**Deliverables:**
- Set up Render project
- Configure environment variables
- Set up deployment from repository
- Implement health checks
**Dependencies:** #12, #33
**Definition of Done:** WebSocket server is successfully deployed to Render with automatic deployments.

### 38. Deployment Configuration - Database
**Description:** Configure production database deployment.
**Deliverables:**
- Set up production database (Railway/Supabase)
- Configure connection security
- Set up database backups
- Update environment variables
**Dependencies:** #5
**Definition of Done:** Production database is configured and accessible from deployed applications.

### 39. Documentation
**Description:** Create comprehensive project documentation.
**Deliverables:**
- Update README with setup instructions
- Document API endpoints
- Create user guide
- Add development workflow documentation
**Dependencies:** #36, #37, #38
**Definition of Done:** Project has complete documentation for both users and developers.

### 40. Final Testing & Launch
**Description:** Perform final testing and official launch.
**Deliverables:**
- Execute full test suite in production environment
- Perform manual testing of critical flows
- Verify all integrations are working
- Update status to public
**Dependencies:** #34, #36, #37, #38, #39
**Definition of Done:** Application passes all tests in production and is ready for public use.