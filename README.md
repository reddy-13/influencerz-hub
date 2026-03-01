# 🚀 InfluenceHub

**InfluenceHub** is a highly scalable, full-stack Admin Dashboard and Metrics Console built for influencer network management. Engineered to handle large datasets natively through advanced architectures, it utilizes Multi-Core Node.js clustering, `Cache-Control` proxy directives, React/Vite optimizations, and Docker containerization.

![Project Status](https://img.shields.io/badge/Status-Active-success)
![Node Version](https://img.shields.io/badge/Node.js-v18+-blue)
![React Version](https://img.shields.io/badge/React-v18-61DAFB)
![MongoDB Version](https://img.shields.io/badge/MongoDB-v6+-47A248)

---

## ✨ Enterprise Features

- **Extreme Scalability:** Backend wrapped in `cluster` forks utilizing every core on the host CPU. MongoDB utilizes connection pooling and `estimatedDocumentCount()` for O(1) aggregations across millions of rows.
- **Fast Pagination Protocol:** Frontend utilizes decoupled "in-place" table loading states with interceptor-level 60-second transparent data deduplication caches.
- **Security Primitives:** Complete JWT authorization flows locked inside unbreakable `httpOnly` secure cookies.
- **MacOS Hardened:** Native configurations bound to `PORT 5050` to automatically route around internal Apple MacOS AirPlay collisions (Port 5000).

---

## 🏗 Directory Structure
The repository is set up natively as a Monorepo:
```bash
/influencerz-hub
├── /frontend      # Client (React, Vite, TS, Axios Interceptors)
├── /backend       # Server (Node.js, Express, MongoDB, Mongoose)
├── /docker        # Infrastructure (Container Bindings, Volumes)
```

---

## 🛠️ Local Development Setup

### 1. Backend Initialization

Navigate to the `backend` directory and install dependencies:
```bash
cd backend
npm install
```

Configure your `.env` file (`backend/.env`):
```env
PORT=5050
MONGO_URI=mongodb://127.0.0.1:27017/influencehub
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
```

Start the MongoDB container infrastructure via Docker:
```bash
cd ../docker
docker-compose up -d
```

Seed the database with 500 realistic randomized users and the **Master Admin**:
```bash
cd ../backend
node src/scripts/seedUsers.js
```

Start the Backend Server Cluster:
```bash
npm run dev
```

### 2. Frontend Initialization

Navigate to the structured `frontend` directory and install dependencies:
```bash
cd ../frontend
npm install
```

Start the Vite development server:
```bash
npm run dev
```
*Note: Vite operates on `http://localhost:5173` but internally proxies all `/api` calls safely to `http://localhost:5050` bypassing typical CORS pre-flight OPTIONS blocks!*

---

## 🔐 Default Admin Credentials

Because the seeding script was executed manually, it unconditionally generates a static **Master Admin** account to instantly access the Super Admin Dashboard:

- **Email:** `admin@influencehub.com`
- **Password:** `password123`

---

## 🐳 Docker Deployment
To launch the full stack entirely through Docker networks (excluding frontend proxying during dev phase):

```bash
cd docker
docker-compose down -v
docker-compose up -d --build
```
This forces a clean network bridge targeting `5050` utilizing pure `node:latest` container binaries!