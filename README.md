# CTP RED CORP - Real Estate Management Platform

A modern, full-stack real estate management platform built with React, TypeScript, and Express.

## 🏗️ Project Structure

```
CTPREDCORP/
├── src/
│   ├── admin/                 # Admin-specific components
│   │   ├── components/        # Admin UI components
│   │   └── pages/            # Admin pages
│   ├── components/
│   │   ├── layout/           # Layout components (Header, Footer, etc.)
│   │   ├── shared/           # Shared/reusable components
│   │   └── ui/               # UI library components (shadcn/ui)
│   ├── config/               # Configuration files
│   ├── data/                 # Static data and constants
│   ├── hooks/                # Custom React hooks
│   ├── lib/
│   │   └── api/             # API client and services
│   ├── pages/                # Page components
│   │   ├── admin/           # Admin pages
│   │   └── sustainability/  # Sustainability pages
│   ├── services/             # Legacy services (to be migrated)
│   ├── types/                # TypeScript type definitions
│   ├── utils/                # Utility functions
│   ├── App.tsx              # Main app component with routing
│   └── main.tsx             # Application entry point
├── backend/
│   ├── config/              # Database and other configs
│   ├── routes/              # API route handlers
│   ├── scripts/             # Utility scripts
│   └── server.js            # Express server
└── public/                  # Static assets
```

## 🚀 Features

- **Modern Architecture**: Feature-based organization with clear separation of concerns
- **React Router**: Proper client-side routing (no more hash-based navigation)
- **TypeScript**: Full type safety across the application
- **API Layer**: Centralized API client with service pattern
- **Custom Hooks**: Reusable hooks for data fetching and state management
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Admin Portal**: Secure admin dashboard for property management
- **Real-time Data**: Dynamic property and unit management

## 📦 Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible component primitives
- **Vite** - Build tool and dev server

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MySQL** - Database
- **JWT** - Authentication
- **Nodemailer** - Email service

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ and npm
- MySQL database

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd CTPREDCORP
```

2. Install dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

3. Configure environment variables
```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your configuration
# VITE_API_URL=http://localhost:5000
```

4. Set up the database
```bash
cd backend
npm run setup-admin
```

### Development

Run both frontend and backend concurrently:
```bash
npm run dev:all
```

Or run them separately:
```bash
# Frontend only (port 5173)
npm run dev

# Backend only (port 5000)
npm run dev:backend
```

### Building for Production

```bash
# Build frontend
npm run build

# Build backend dependencies
npm run build:backend

# Or build both
npm run build:all
```

## 📝 API Documentation

### Public Endpoints
- `GET /api/buildings` - Get all buildings
- `GET /api/buildings/:id` - Get building by ID
- `GET /api/units` - Get all units (with filters)
- `GET /api/units/:id` - Get unit by ID
- `POST /api/email/send-appointment` - Schedule appointment

### Admin Endpoints (requires authentication)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/appointments` - Get all appointments
- `POST /api/buildings` - Create building
- `PUT /api/buildings/:id` - Update building
- `DELETE /api/buildings/:id` - Delete building
- `POST /api/units` - Create unit
- `PUT /api/units/:id` - Update unit
- `DELETE /api/units/:id` - Delete unit

## 🔑 Key Improvements in This Refactor

1. **Routing**: Migrated from hash-based navigation to React Router for better SEO and user experience
2. **Architecture**: Feature-based organization instead of component-type organization
3. **Type Safety**: Comprehensive TypeScript types for all data structures
4. **API Layer**: Centralized API client with proper error handling
5. **Code Reusability**: Custom hooks for common operations
6. **Maintainability**: Clear separation between pages, features, and shared components
7. **Performance**: Code splitting and lazy loading ready

## 📄 License

Copyright © 2025 CTP RED CORP. All rights reserved.
