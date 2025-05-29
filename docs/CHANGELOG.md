# Changelog

All notable changes to the Zest chat application will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.0] - 2025-05-29

### Added

#### 🔗 Link Detection & Hyperlinking

- **Automatic URL Detection**: Messages now automatically detect http/https URLs and convert them to clickable links
- **Security Features**: External links open in new tabs with `noopener noreferrer` for security
- **New Dependencies**: Added `linkifyjs` (^4.3.1) and `linkify-react` (^4.3.1)
- **Styling Integration**: Links use yellow accent color (#ffc100) to match dark theme

#### 🎨 Dark Theme Implementation

- **Complete Design System**: Implemented cohesive dark theme across all components
- **Color Palette**:
  - Primary background: `#1a1a1a`
  - Secondary background: `#2a2a2a` (cards)
  - Accent color: `#ffc100` (yellow/gold)
  - Text: White and light gray variants
- **Component Updates**: All UI components updated with consistent dark styling
- **CSS Architecture**: Added CSS custom properties for theme consistency

#### 🏷️ Logo Integration & Branding

- **Logo Component**: Created reusable `Logo.tsx` component
- **Strategic Placement**: Logo positioned in bottom-right corner on all pages
- **Interactive Design**: Opacity fade animation on hover
- **Asset Integration**: Utilizes existing `/images/zest-logo.png`

#### 🎯 UI/UX Enhancements

- **Cursor Pointers**: Added pointer cursors to all interactive buttons
- **Icon Integration**: Added Heroicons library for modern UI elements
- **Delete Button Redesign**: Replaced text-based delete buttons with intuitive trash icons
- **Accessibility**: Added title attributes for improved accessibility
- **Smooth Animations**: Implemented transition effects for better user experience

### Changed

#### 🎨 Visual Design

- **Homepage Header**: Enhanced with larger "Zest" branding and integrated logo
- **Button Styling**: All primary buttons now use yellow accent color instead of blue
- **Form Inputs**: Dark-themed inputs with yellow focus states
- **Message Links**: Blue links changed to yellow for better dark theme contrast

#### 🏗️ Component Architecture

- **MessageList.tsx**: Enhanced with automatic link detection using Linkify component
- **All Input Components**: Updated with dark theme styling and yellow accents
- **Button Components**: Standardized cursor pointer behavior across all buttons

### Dependencies

#### Added

- `@heroicons/react`: ^2.2.0 - Icon library for modern UI elements
- `linkifyjs`: ^4.3.1 - Core link detection library
- `linkify-react`: ^4.3.1 - React component for automatic link conversion

#### Updated

- Maintained existing versions for core dependencies (Next.js 15.3.2, React 19)

## [1.0.0] - 2025-05-29

### Added

#### 🏠 Dynamic Room Management

- **Room Creation**: Users can create unlimited chat rooms with custom titles
- **Unique URLs**: Each room gets a shareable URL (`/chat/[roomId]`)
- **Room Isolation**: Messages and presence tracking scoped per room
- **Room Deletion**: Ability to delete rooms with confirmation dialog

#### 💬 Real-time Chat Features

- **WebSocket Integration**: Real-time messaging using Socket.io
- **Presence Tracking**: Live display of online users in each room
- **Message Persistence**: All messages stored in PostgreSQL database
- **Timestamp Display**: Messages show creation time

#### 🔧 Technical Implementation

- **Database Schema**: Prisma-based schema with Chatroom and Message models
- **API Endpoints**: RESTful endpoints for room and message management
- **WebSocket Events**: Room-scoped real-time events
- **Frontend Routing**: Dynamic Next.js routing for room pages

### Technical Details

#### Database Schema

```sql
-- Chatroom model
id        String   @id @default(uuid())
title     String
createdAt DateTime @default(now())
messages  Message[]

-- Message model
id         String   @id @default(uuid())
chatroomId String
alias      String
message    String
timestamp  DateTime @default(now())
chatroom   Chatroom @relation(fields: [chatroomId], references: [id])
```

#### Component Structure

```
src/components/
├── AliasInput.tsx - User alias entry component
├── MessageInput.tsx - Message composition component
├── MessageList.tsx - Message display with auto-scroll
└── Logo.tsx - Branding component (added in v2.0.0)
```

#### API Routes

- `GET /api/rooms` - List all chatrooms
- `POST /api/rooms` - Create new chatroom
- `GET /api/rooms/[roomId]` - Get chatroom details
- `DELETE /api/rooms/[roomId]` - Delete chatroom
- `GET /api/rooms/[roomId]/messages` - Get room messages
- `POST /api/rooms/[roomId]/messages` - Send new message

### Migration Notes

#### From Global Chat (MVP)

- All existing messages preserved in `global-chat` room
- Backward compatibility maintained
- No data loss during migration
- WebSocket events updated to be room-scoped

---

## Development Milestones

### Phase 1: MVP (Learning Version) ✅

- Single global chat room
- Basic Next.js + TypeScript + Tailwind setup
- Prisma + PostgreSQL integration
- Polling-based message updates
- VPS deployment (Hetzner)

### Phase 2: Dynamic Rooms ✅

- Multiple isolated chat rooms
- Real-time WebSocket communication
- Room-specific presence tracking
- Database schema with relationships

### Phase 3: UI/UX Polish ✅

- Modern dark theme implementation
- Automatic link detection
- Icon-based interactions
- Professional branding integration

### Phase 4: Production Readiness (Upcoming)

- Authentication system
- Room scheduling and time controls
- Enhanced security features
- Performance optimizations

