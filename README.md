# Yapli

<p align="center">
  <a href="https://yapli.chat" target="_blank" rel="noopener noreferrer">
    <img src="https://github.com/user-attachments/assets/798b27c8-c9fb-477f-afb2-8ff9a764ab82" alt="Yapli App Logo" width="100"><br>
    <strong>Visit Yapli</strong>
  </a>
</p>

Yapli is a modern, full-featured web-based chatroom application built with Next.js 15 and real-time WebSocket communication. Create dynamic chat rooms with authentication, join conversations with custom aliases, share links with rich previews, and enjoy a seamless chat experience in a beautiful theme-aware interface.

## ✨ Features

### 🏠 **Dynamic Room Management**

- Create unlimited chat rooms with custom titles (authenticated users)
- Unique 6-character shareable codes for easy room access
- Room isolation - messages and presence tracking scoped per room
- Real-time room deletion with intuitive UI controls

### 💬 **Real-time Chat & Messaging**

- Instant messaging with Socket.io WebSocket integration
- Live presence tracking showing online users per room
- Custom alias support for anonymous participation
- Message persistence with PostgreSQL database storage
- Timestamp display for all messages

### 🔗 **Rich Link Previews**

- Automatic link detection and conversion to clickable links
- Rich link previews with title, description, and images
- Favicon and site name extraction for enhanced context
- Async link preview generation for optimal performance

### 🎨 **Modern UI/UX**

- Dark/Light theme toggle with next-themes
- Responsive design optimized for all screen sizes
- Gradient-based color scheme with teal and blue accents
- Smooth animations and hover effects
- Professional branding with integrated Yapli logo

### 🔐 **Authentication System**

- Secure user registration with bcrypt password hashing
- JWT-based session management with NextAuth.js
- Protected routes for room creation and management

### 🔒 **Security & Performance**

- Secure external link handling (`noopener noreferrer`)
- Database relationships with proper foreign key constraints
- Environment-based configuration for production deployment
- Comprehensive error handling and validation

## 🚀 Current Status

**✅ Fully Implemented:**

- Complete authentication system with multiple OAuth providers
- Dynamic room creation and management with 6-character codes
- Real-time messaging and presence tracking via Socket.io
- Rich link previews with metadata extraction
- Dark/Light theme toggle with system preference detection
- PostgreSQL database with Prisma ORM integration
- Responsive design optimized for mobile and desktop
- Professional UI with gradient themes and smooth animations

**🎯 Production Ready:**
All core functionality is implemented and thoroughly tested. The application includes proper error handling, security measures, and is ready for production deployment.

## 🛠️ Tech Stack

- **Frontend:** Next.js 15.3.2 with React 19 and TypeScript
- **Authentication:** NextAuth.js with multiple OAuth providers
- **Styling:** Tailwind CSS v4 with dark/light theme support
- **Real-time:** Socket.io for WebSocket communication
- **Database:** PostgreSQL with Prisma ORM
- **Security:** bcrypt for password hashing
- **UI Components:** Heroicons for consistent iconography
- **Link Processing:** Linkifyjs for URL detection and rich previews
- **Theme Management:** next-themes for system preference detection

### Key Dependencies

```json
{
  "@auth/prisma-adapter": "^2.9.1",
  "@heroicons/react": "^2.2.0",
  "@prisma/client": "^6.8.2",
  "bcryptjs": "^3.0.2",
  "link-preview-js": "^3.1.0",
  "linkifyjs": "^4.3.1",
  "linkify-react": "^4.3.1",
  "next": "15.3.2",
  "next-auth": "^4.24.11",
  "next-themes": "^0.4.6",
  "react": "^19.0.0",
  "socket.io": "^4.8.1",
  "socket.io-client": "^4.8.1"
}
```

## Documentation

- [Changelog](docs/CHANGELOG.md) - Project changelog and release notes
- [Standards & Guidelines](docs/CLAUDE.md) - Development standards and project guidelines
- [Error Documentation](docs/errors/) - Known issues and troubleshooting guides

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- OAuth app credentials (Google and/or GitHub - optional)

### Environment Setup

Create a `.env.local` file in the root directory:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/yapli"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"
```

### Installation & Development

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up the database:**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Deployment

1. **Build the application:**

   ```bash
   npm run build
   ```

2. **Run in production mode:**
   ```bash
   npm run start
   ```

The application uses a custom server (`server.js`) that handles both the Next.js app and Socket.io WebSocket connections.
