# NotesHub - Student Portal

NotesHub is a comprehensive platform for students to manage assignments, share notes, and store lecture recordings.

## Features

- 📝 **Notes Management**: Create, edit, and share notes with rich text formatting using Quill.js
- ✅ **Task Tracking**: Manage assignments and track due dates
- 📅 **Calendar View**: Visualize deadlines and schedules
- 🎥 **Lecture Recording Storage**: Organize and access past lecture recordings by module

## Tech Stack

### Backend
- Node.js with Express
- TypeScript
- Prisma ORM
- SQLite database
- JWT Authentication

### Frontend
- React
- TypeScript
- Tailwind CSS
- React Router
- Quill.js for rich text editing
- Zustand for state management

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/noteshub.git
   cd noteshub
   ```

2. Install Backend Dependencies
   ```bash
   cd server
   npm install
   ```

3. Install Frontend Dependencies
   ```bash
   cd ../client
   npm install
   ```

### Setup

1. Create a `.env` file in the server directory with:
   ```
   DATABASE_URL="file:../dev.db"
   JWT_SECRET="your-secret-key"
   PORT=5000
   ```

2. Run the database migrations
   ```bash
   cd server
   npx prisma migrate dev
   ```

### Running the Application

1. Start the Backend Server
   ```bash
   cd server
   npm run dev
   ```

2. Start the Frontend Development Server
   ```bash
   cd client
   npm run dev
   ```

3. Access the application at `http://localhost:5173` (or the port shown in your terminal)

## Project Structure

```
noteshub/
├── server/                  # Backend Node.js application
│   ├── prisma/              # Prisma schema and migrations
│   ├── src/                 # Source code
│   │   ├── controllers/     # Request handlers
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Express middleware
│   │   └── utils/           # Helper functions
│   └── ...
├── client/                  # Frontend React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service calls
│   │   ├── store/           # Zustand stores
│   │   └── ...
│   └── ...
└── ...
```

## Deployment

The application is set up with GitHub Actions for CI/CD. Push to the main branch will automatically trigger the build and deployment process.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Open a pull request 