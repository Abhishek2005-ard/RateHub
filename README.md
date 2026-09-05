# RateHub (RateMyStore)

A store rating platform where users can browse stores, submit ratings, and manage their profiles. Admins can manage users and stores through a dashboard, and store owners can view their store metrics and rating breakdowns.

## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS, Framer Motion
- **Backend:** Express.js (MVC pattern), Node.js
- **Database:** PostgreSQL (Supabase Cloud / Local)
- **Auth:** JWT + bcrypt password hashing

## Project Architecture

```
RateHub/
├── frontend/               # Standalone React.js Frontend
│   ├── src/
│   │   ├── components/     # Admin, Auth, Dashboards, Rating Explorer
│   │   ├── context/        # Auth Context Provider
│   │   ├── App.jsx         # App Routing & Views
│   │   └── main.jsx        # Entry Point
│   ├── public/             # Static Assets
│   ├── index.html          # HTML Template
│   ├── package.json        # Frontend Dependencies
│   └── vite.config.js      # Vite Configuration
│
├── backend/                # Standalone Express.js MVC Backend
│   ├── config/             # Supabase PostgreSQL Pool Connection
│   ├── controllers/        # Auth, Admin, User & Owner Controllers
│   ├── middlewares/        # JWT Authentication Middleware
│   ├── models/             # User & Store Data Access Layer
│   ├── routes/             # REST API Route Handlers
│   ├── schema.sql          # PostgreSQL DDL
│   ├── server.js           # Express Entry Point (Port 5000)
│   └── .env                # Environment Variables
│
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL / Supabase account

### Setup & Running

1. **Start Backend API:**
   ```bash
   cd backend
   npm install
   npm start
   ```

2. **Start Frontend App:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

Frontend runs on `http://localhost:5173`, backend runs on `http://localhost:5000`.

## Test Accounts

| Role         | Email               | Password  |
|--------------|---------------------|-----------|
| Admin        | admin@ratehub.dev   | admin123  |
| Store Owner  | owner@heritage.com  | owner123  |
| Normal User  | user@ratehub.dev    | user123   |
