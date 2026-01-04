# Quick Setup Guide

This guide will help you get the entire School Management System running in minutes.

## 📋 Prerequisites

Ensure you have installed:
- Node.js 18+ (`node --version`)
- npm 9+ (`npm --version`)
- Docker Desktop (running)

## 🚀 Quick Start (5 minutes)

### 1. Start Database (Terminal 1)

```bash
cd school-management
docker-compose up -d

# Verify database is running
docker-compose ps
```

### 2. Setup Backend (Terminal 2)

```bash
cd school-management/backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Note: For MVP, you can use the defaults in .env
# In production, change JWT_SECRET and database credentials

# Start backend (will auto-sync database tables in development)
npm run start:dev
```

**Backend will be running on:** http://localhost:3000/api

### 3. Setup Frontend (Terminal 3)

```bash
cd school-management/frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start frontend
npm run dev
```

**Frontend will be running on:** http://localhost:5173

### 4. Access the Application

Open your browser and go to: **http://localhost:5173**

**Demo Login Credentials:**
- **Teacher**: teacher@school.com / teacher123
- **Admin**: admin@school.com / admin123
- **Counselor**: counselor@school.com / counselor123

*(Note: These users need to be created first - see Database Seeding below)*

## 🌱 Database Seeding (Optional but Recommended)

After backend is running, you can seed demo data:

```bash
cd backend
npm run seed
```

This will create:
- Demo users (teacher, admin, counselor)
- Sample students
- Sample classes
- Sample lessons
- Comment templates

## 📁 Project Structure Overview

```
school-management/
├── backend/           # NestJS API (Port 3000)
├── frontend/          # React SPA (Port 5173)
└── docker-compose.yml # PostgreSQL database
```

## 🔧 Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker-compose ps

# View database logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

### Backend Not Starting

```bash
# Check if port 3000 is available
lsof -i :3000

# Clear node_modules and reinstall
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Frontend Not Starting

```bash
# Check if port 5173 is available
lsof -i :5173

# Clear node_modules and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors

Ensure backend `.env` has:
```
CORS_ORIGIN=http://localhost:5173
```

## 📚 Development Workflow

### Making Changes

1. **Backend Changes**:
   - Edit files in `backend/src/`
   - Backend auto-reloads on save

2. **Frontend Changes**:
   - Edit files in `frontend/src/`
   - Frontend auto-reloads on save (HMR)

3. **Database Schema Changes**:
   ```bash
   cd backend
   # After modifying entities:
   npm run migration:generate -- src/migrations/YourMigrationName
   npm run migration:run
   ```

### Running Tests

**Backend:**
```bash
cd backend
npm run test          # Unit tests
npm run test:e2e      # E2E tests
npm run test:cov      # Coverage
```

**Frontend:**
```bash
cd frontend
npm run test
```

## 🛑 Stopping Everything

```bash
# Stop database
docker-compose down

# Stop backend (Ctrl+C in terminal)
# Stop frontend (Ctrl+C in terminal)
```

## 🗑️ Clean Reset

If you want to start fresh:

```bash
# Stop and remove database
docker-compose down -v

# Restart database
docker-compose up -d

# Backend will auto-sync tables on next start
```

## 📖 Next Steps

Now that your environment is running:

1. **Explore the API**: http://localhost:3000/api
2. **Read the docs**:
   - [Main README](./README.md)
   - [Backend README](./backend/README.md)
   - [Frontend README](./frontend/README.md)

3. **Implement MVP Features**:
   - Complete Attendance UI
   - Complete Grades UI
   - Complete Events UI
   - Complete Report Cards UI
   - Connect Dashboard to real API

## 🆘 Getting Help

- Check individual READMEs for detailed documentation
- Review error logs in terminal
- Ensure all prerequisites are installed
- Verify ports 3000, 5173, and 5432 are available

---

**Happy coding! 🎉**

