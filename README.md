# RateHub — Store Rating & User Management Platform

A full-stack web application for retail store discovery, user ratings, and store management built with **React.js**, **Express.js (MVC)**, **PostgreSQL (Supabase Cloud / Local)**, **JWT Authentication**, and **Bcrypt** password hashing.

---

## 🚀 Key Features by User Role

### 1. 🛡️ System Administrator (`admin`)
- **Dashboard Analytics**: Real-time statistics cards (Total Users, Total Stores, Total Ratings), monthly user trend chart, category breakdown, and system metrics.
- **User Management**: Search, filter, and paginate users by Name, Email, Address, or Role (`admin`, `store_owner`, `user`). View user details modal and register new users.
- **Store Management**: Search and filter stores by Name, Email, Address, or Category. Automatically computes overall average rating scores and review counts. Assign Store Owners and register new store branches.

### 2. 🏪 Store Owner (`store_owner`)
- **Merchant Portal**: Displays store name, email, physical address, and category.
- **Rating Score Breakdown**: Displays average rating score, total submitted reviews, and visual 1-to-5 star rating distribution progress bars (counts and percentages for 5★, 4★, 3★, 2★, 1★).
- **Customer Reviews Queue**: Displays recent reviews submitted for the owner's store.
- **Account Management**: Sidebar navigation with password change form (verifies current password with `bcrypt` and updates hash in database).

### 3. 👤 Normal User (`user`)
- **Account Registration & Login**: Client-side validation, password strength meter, and bcrypt hashed storage.
- **Store Explorer & Ratings**: Search stores by Name or Address with pagination.
- **Interactive 1–5 Star Rating Control**: Star hover preview, active rating indicator, optional written review comments, loading states, and instant average rating recalculation.
- **Single Rating Rule**: Enforced by PostgreSQL `UNIQUE(store_id, user_id)` constraint and atomic `UPSERT` queries (`ON CONFLICT (store_id, user_id) DO UPDATE`).

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion, Lucide Icons
- **Backend**: Node.js, Express.js (MVC Pattern), `pg` (PostgreSQL client)
- **Database**: PostgreSQL (Supabase Cloud with SSL support & local PostgreSQL fallback)
- **Authentication**: JSON Web Token (`jsonwebtoken`), `bcryptjs` password hashing

---

## 📁 Repository Architecture

```
RateHub/
├── frontend/               # React.js Single Page Application
│   ├── src/
│   │   ├── components/     # Admin, Auth, Dashboards, Rating Explorer
│   │   ├── context/        # Auth Context Manager
│   │   ├── App.jsx         # View Router & App State
│   │   └── main.jsx        # Entry Point
│   ├── public/             # Static Assets
│   ├── index.html          # HTML Template
│   ├── package.json        # Frontend Dependencies
│   └── vite.config.js      # Vite Bundler Config
│
├── backend/                # Express.js (MVC) Backend Application
│   ├── config/
│   │   └── db.js           # Supabase PostgreSQL Pool & DDL Auto-Init
│   ├── controllers/        # Auth, Admin, User & Owner Controllers
│   ├── middlewares/        # JWT Authentication & Role Authorization
│   ├── models/             # User & Store Data Access Layer
│   ├── routes/             # REST API Handlers (/api/auth, /api/admin, /api/user, /api/owner)
│   ├── schema.sql          # PostgreSQL DDL
│   ├── server.js           # Express Entry Point (Port 5000)
│   └── .env.example        # Environment Variables Template
│
└── README.md
```

---

## 🔑 Demo Login Accounts

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@ratehub.dev` | `admin123` | Full admin dashboard, user/store management |
| **Store Owner** | `owner@heritage.com` | `owner123` | Store metrics, 1-5 star breakdown, change password |
| **Normal User** | `user@ratehub.dev` | `user123` | Store listing, submit/modify 1-5 star ratings |

---

## 🚦 Getting Started & Local Setup

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure database credentials in .env if using a custom PostgreSQL database
npm start
```
The server runs at `http://localhost:5000`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The application runs at `http://localhost:5173`.

---

## 📡 REST API Endpoints

### Auth (`/api/auth`)
- `POST /api/auth/register` — Register a new normal user
- `POST /api/auth/login` — Sign in as Admin, Store Owner, or Normal User (returns JWT token)
- `GET /api/auth/me` — Retrieve currently authenticated user profile

### Admin (`/api/admin`) — *Requires Admin JWT*
- `GET /api/admin/stats` — Overall application statistics and rating breakdowns
- `GET /api/admin/users` — Paginated user directory (search by name, email, role filter)
- `POST /api/admin/users` — Create new user account
- `GET /api/admin/stores` — Paginated store directory with average ratings & owner lookup
- `POST /api/admin/stores` — Register new retail store branch

### Normal User (`/api/user`) — *Requires User JWT*
- `GET /api/user/stores` — Retrieve stores with overall rating average & user's submitted rating
- `POST /api/user/ratings` — Submit or modify a rating (1-5 stars) for a store

### Store Owner (`/api/owner`) — *Requires Store Owner JWT*
- `GET /api/owner/store` — Retrieve owner's store metrics, rating breakdown (1-5 stars), & customer reviews
- `POST /api/owner/change-password` — Verify current password & update to new bcrypt password hash
