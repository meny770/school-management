# School Management System (MVP)

A modern web application for educational management, focused on teachers' daily tasks.

## 🎯 Features

Teachers can:
1. **Manage Attendance** (נוכחות) - Track student presence/absence with justifications
2. **Enter and Review Grades** (ציונים) - Record grades with comment templates and detailed feedback
3. **Log Educational Events** (אירועים חינוכיים) - Document daily notes and behavioral events
4. **Manage Report Cards** (תעודות) - Create, edit, and publish student report cards
5. **View Dashboard** - See key alerts and summaries at a glance

## 🏗️ Architecture

**Frontend Choice: Vite + React** (over Next.js)

**Why Vite?**
- ⚡ Instant HMR and faster dev server
- 🎯 Simpler architecture for SPA with JWT auth
- 📦 Lighter bundle and optimized builds
- 🚀 Better suited for MVP without SSR complexity

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + TypeScript + Vite |
| **State Management** | MobX 6 |
| **UI Components** | Material-UI (MUI) v5 |
| **Backend** | NestJS + TypeScript |
| **Database** | PostgreSQL 15 |
| **ORM** | TypeORM |
| **Authentication** | JWT with role-based access (TEACHER, ADMIN, COUNSELOR) |
| **Infrastructure** | Docker + Docker Compose |

## 📁 Project Structure

```
school-management/
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── auth/           # Authentication & authorization
│   │   ├── attendance/     # Attendance management
│   │   ├── grades/         # Grades & comment templates
│   │   ├── events/         # Educational events
│   │   ├── report-cards/   # Report card generation
│   │   ├── dashboard/      # Teacher dashboard
│   │   ├── common/         # Shared entities (User, Student, Class, Lesson)
│   │   └── main.ts
│   ├── test/
│   ├── package.json
│   └── README.md
│
├── frontend/               # React SPA
│   ├── src/
│   │   ├── features/      # Feature-based modules
│   │   │   ├── auth/
│   │   │   ├── attendance/
│   │   │   ├── grades/
│   │   │   ├── events/
│   │   │   ├── reportCards/
│   │   │   └── dashboard/
│   │   ├── stores/        # MobX stores
│   │   ├── services/      # API clients
│   │   ├── components/    # Shared components
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── README.md
│
├── docker-compose.yml      # PostgreSQL container
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Docker Desktop (for PostgreSQL)
- Git

### 1. Start PostgreSQL

```bash
docker-compose up -d
```

This starts PostgreSQL on `localhost:5432` with:
- Database: `school_management`
- User: `school_admin`
- Password: `school_password`

### 2. Setup Backend

```bash
cd backend
npm install
npm run migration:run
npm run seed  # Optional: seed demo data
npm run start:dev
```

Backend runs on: **http://localhost:3000**

See [backend/README.md](./backend/README.md) for detailed setup.

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: **http://localhost:5173**

See [frontend/README.md](./frontend/README.md) for detailed setup.

## 🔐 Default Users (After Seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@school.com | admin123 |
| Teacher | teacher@school.com | teacher123 |
| Counselor | counselor@school.com | counselor123 |

## 📚 Core Domain Entities

### User Management
- **User**: System users with roles (TEACHER, ADMIN, COUNSELOR)
- **Student**: Student records linked to classes
- **Class**: Class/grade groups with homeroom teachers
- **Lesson**: Scheduled lessons with subject, time, and class

### Attendance (נוכחות)
- Track PRESENT/ABSENT status per lesson
- Support justified absences with comments
- **Business Rule**: "Mark full day absent" automatically updates all lessons for that student on the date

### Grades (ציונים)
- **Grade**: Numerical grade with "meets expectations" scale (1-5)
- **CommentTemplate**: Reusable feedback templates (BEHAVIOR/ACADEMIC/GENERAL)
- Support for strength notes and improvement areas

### Educational Events (אירועים חינוכיים)
- **EducationalEvent**: Log daily notes, behavioral incidents, or other events
- Severity levels: LOW, MEDIUM, HIGH
- Notification tracking to counselors/admins

### Report Cards (תעודות)
- **ReportCard**: Container for semester/year reports (DRAFT/PUBLISHED)
- **ReportCardLine**: Individual subject grades and comments
- Draft mode before publishing to students/parents

## 🔌 API Endpoints

### Authentication
- `POST /auth/register` - Register new user (ADMIN only)
- `POST /auth/login` - Login and get JWT token

### Attendance
- `POST /attendance` - Create/update attendance record
- `GET /attendance?lessonId=&date=` - Get attendance for lesson
- `GET /attendance/student/:id` - Get student attendance history
- `POST /attendance/mark-full-day-absent` - Mark student absent for entire day

### Grades
- `GET /comment-templates` - List all comment templates
- `POST /comment-templates` - Create template (ADMIN/TEACHER)
- `POST /grades` - Submit a grade
- `GET /grades?studentId=` - Get grades for student
- `GET /grades?classId=&subject=` - Get grades by class and subject

### Educational Events
- `POST /events` - Create new educational event
- `GET /events?studentId=` - Get events for student
- `GET /events?teacherId=` - Get events logged by teacher

### Report Cards
- `POST /report-cards` - Create new report card
- `POST /report-cards/:id/lines` - Add subject lines to report card
- `GET /report-cards?studentId=` - Get student report cards
- `PUT /report-cards/:id/publish` - Publish report card

### Dashboard
- `GET /dashboard/teacher/:id` - Get teacher summary data

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm run test              # Unit tests
npm run test:e2e          # E2E tests
npm run test:cov          # Coverage report
```

### Frontend Tests
```bash
cd frontend
npm run test
```

## 🛠️ Development

### Backend Development
- TypeScript with strict mode
- NestJS modules follow domain-driven design
- DTOs with class-validator for input validation
- TypeORM for database interactions
- JWT guards for route protection

### Frontend Development
- React functional components with hooks
- MobX for state management
- Material-UI for consistent design
- Feature-based folder structure
- Axios for API calls with JWT interceptor

## 📦 Database Migrations

```bash
cd backend

# Generate migration after entity changes
npm run migration:generate -- src/migrations/MigrationName

# Run migrations
npm run migration:run

# Revert last migration
npm run migration:revert
```

## 🐳 Docker Commands

```bash
# Start PostgreSQL
docker-compose up -d

# Stop PostgreSQL
docker-compose down

# View logs
docker-compose logs -f postgres

# Reset database (WARNING: deletes all data)
docker-compose down -v
docker-compose up -d
```

## 📝 Environment Variables

### Backend (.env)
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=school_admin
DATABASE_PASSWORD=school_password
DATABASE_NAME=school_management
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=24h
PORT=3000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
```

## 🚧 Roadmap (Post-MVP)

- [ ] Parent portal
- [ ] Student self-service portal
- [ ] SMS/Email notifications
- [ ] Advanced reporting and analytics
- [ ] Mobile app (React Native)
- [ ] Real-time updates (WebSockets)
- [ ] File attachments for events
- [ ] Bulk import/export (CSV)
- [ ] Multi-language support (Hebrew/English/Arabic)

## 📄 License

MIT

## 👥 Contributing

This is an MVP project. For production use, ensure you:
1. Change all default passwords and secrets
2. Enable HTTPS with proper certificates
3. Implement rate limiting
4. Add comprehensive logging and monitoring
5. Perform security audit
6. Add data backup procedures

---

**Built with ❤️ for teachers**

