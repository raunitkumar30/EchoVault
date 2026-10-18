# 🔐 EchoVault

**EchoVault** is a full-stack web application featuring secure JWT authentication via HTTP-only cookies, protected API middleware, and a persistent user post feed.

---

## 🌟 Features

- **Robust Authentication**:
  - Secure user registration and login with `bcrypt` password hashing.
  - JWT tokens issued and stored in `httpOnly` secure cookies (resistant to XSS).
  - Protected API routes using custom Express authentication middleware.
  - Clean logout flow that clears authentication cookies.
- **Persistent Feed**:
  - Authenticated users can create and view their posts.
  - Post documents linked to user ObjectIds with automatic timestamps.
- **Modern Frontend**:
  - Built with React 19, Vite, and React Router v7.
  - Polished dark UI with glassmorphism, responsive cards, and dynamic state.

---

## 🏗️ Architecture

```
EchoVault/
├── backend/
│   ├── controllers/
│   │   ├── auth.controller.js   # Register, Login, Me, Logout
│   │   └── post.controller.js   # Create post, Get user posts
│   ├── middleware/
│   │   └── auth.middleware.js   # JWT cookie verification
│   ├── models/
│   │   ├── user.model.js        # User schema (username, email, password)
│   │   └── post.model.js        # Post schema (user ref, content, timestamps)
│   ├── routes/
│   │   ├── auth.routes.js       # /api/auth/*
│   │   └── post.routes.js       # /api/posts/*
│   ├── src/
│   │   ├── db/db.js             # Mongoose connection
│   │   └── app.js               # Express application configuration
│   ├── server.js                # Server entry point (port 3000)
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Login.jsx        # Login page
    │   │   ├── Register.jsx     # Registration page
    │   │   └── Dashboard.jsx    # Protected user dashboard & post feed
    │   ├── App.jsx              # Routing configuration
    │   ├── main.jsx             # React entry point
    │   └── index.css            # Styles
    ├── index.html
    ├── vite.config.js           # Proxy /api -> http://localhost:3000
    └── package.json
```

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas URI)

### 2. Backend Setup
```bash
cd backend
npm install
# Ensure .env contains:
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret

npm start
```
*Backend runs on `http://localhost:3000`.*

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 🛡️ API Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new account | No |
| `POST` | `/api/auth/login` | Log in and receive HTTP-only cookie | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes (Cookie) |
| `POST` | `/api/auth/logout` | Clear auth cookie | Yes (Cookie) |
| `POST` | `/api/posts/create` | Create a new post | Yes (Cookie) |
| `GET` | `/api/posts` | Fetch user's stored posts | Yes (Cookie) |
| `PUT` | `/api/posts/:id` | Update an existing post (Ownership verified) | Yes (Cookie) |
| `DELETE` | `/api/posts/:id` | Delete a post (Ownership verified) | Yes (Cookie) |
