# Zest

<p align="center">
  <img src="https://github.com/user-attachments/assets/47ef837d-709e-4778-989d-39e0947d155a" alt="Zest App Logo May 21 2025" width="200">
</p>

Zest is a modern, minimalist web-based chatroom application built with Next.js and real-time WebSocket communication. Create dynamic chat rooms, join conversations with custom aliases, and share links seamlessly in a beautiful dark-themed interface.

## ✨ Features

### 🏠 **Dynamic Room Management**
- Create unlimited chat rooms with custom titles
- Unique shareable URLs for each room (`/chat/[roomId]`)
- Room isolation - messages and presence tracking scoped per room
- Real-time room deletion with trash icon interface

### 💬 **Real-time Chat**
- Instant messaging with WebSocket integration
- Live presence tracking showing online users
- Automatic link detection and conversion to clickable links
- Message persistence with timestamp display

### 🎨 **Modern Dark Theme**
- Beautiful dark interface with #ffc100 yellow accents
- Responsive design for all screen sizes
- Consistent branding with integrated logo
- Smooth hover animations and transitions

### 🔒 **Security & Accessibility**
- Secure external link handling (`noopener noreferrer`)
- Icon-based UI with Heroicons for intuitive interactions
- Keyboard navigation support
- Cross-browser compatibility

## 🚀 Current Status

**✅ Fully Implemented:**
- Dynamic room creation and management
- Real-time messaging and presence tracking
- Automatic link detection and hyperlinking
- Modern dark theme with yellow accent system
- Logo integration and professional branding
- Icon-based delete functionality
- Responsive design across all devices

**🎯 Production Ready:**
All core functionality is complete and ready for deployment.

## 🛠️ Tech Stack

- **Frontend:** Next.js 15.3.2 with React 19
- **Styling:** Tailwind CSS v4 with dark theme
- **Real-time:** Socket.io for WebSocket communication
- **Database:** PostgreSQL with Prisma ORM
- **Icons:** Heroicons for UI elements
- **Link Detection:** Linkifyjs for automatic URL conversion

### Key Dependencies
```json
{
  "@heroicons/react": "^2.2.0",
  "@prisma/client": "^6.8.2",
  "linkifyjs": "^4.3.1", 
  "linkify-react": "^4.3.1",
  "next": "15.3.2",
  "react": "^19.0.0",
  "socket.io": "^4.8.1",
  "socket.io-client": "^4.8.1"
}
```

## Documentation

- [Functional Requirements](docs/FUNCTIONAL.md) - Complete functional specifications and features
- [Architecture](docs/ARCHITECTURE.md) - Detailed project architecture and technical design
- [Standards & Guidelines](docs/CLAUDE.md) - Development standards and project guidelines
- [Research for Libraries and Packages](docs/RESEARCH.md) - Research for libraries that solve the problems we need to tackle
- [Critical Analysis of Research](docs/FLAWS.md) - What it says on the tin

## Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
