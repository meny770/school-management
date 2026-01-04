# School Management Backend (NestJS)

RESTful API for the school management system, built with NestJS, TypeScript, TypeORM, and PostgreSQL.

## 📋 Prerequisites

- Node.js 18+ and npm
- Docker Desktop (for PostgreSQL)
- PostgreSQL 15+ (if not using Docker)

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` with your configuration (or use defaults for local development):

```env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=school_admin
DATABASE_PASSWORD=school_password
DATABASE_NAME=school_management

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production-minimum-32-characters
JWT_EXPIRATION=24h

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

### 3. Start PostgreSQL

Make sure PostgreSQL is running. If using Docker:

```bash
# From project root
cd ..
docker-compose up -d
```

Verify database is running:

```bash
docker-compose ps
```

### 4. Run Database Migrations

```bash
# Run migrations to create tables
npm run migration:run

# If you need to generate new migrations after entity changes:
npm run migration:generate -- src/migrations/MigrationName
```

### 5. Start Development Server

```bash
npm run start:dev
```

The API will be available at: **http://localhost:3000/api**

## 📁 Project Structure

```
backend/
├── src/
│   ├── auth/                    # Authentication & JWT
│   │   ├── decorators/         # Custom decorators (Roles, CurrentUser)
│   │   ├── dto/                # Login, Register DTOs
│   │   ├── guards/             # JWT & Roles guards
│   │   ├── strategies/         # Passport JWT strategy
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   │
│   ├── attendance/             # Attendance management
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── attendance.controller.ts
│   │   ├── attendance.service.ts
│   │   └── attendance.module.ts
│   │
│   ├── grades/                 # Grades & comment templates
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── grades.controller.ts
│   │   ├── grades.service.ts
│   │   └── grades.module.ts
│   │
│   ├── events/                 # Educational events
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── events.controller.ts
│   │   ├── events.service.ts
│   │   └── events.module.ts
│   │
│   ├── report-cards/           # Report cards
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── report-cards.controller.ts
│   │   ├── report-cards.service.ts
│   │   └── report-cards.module.ts
│   │
│   ├── dashboard/              # Teacher dashboard
│   │   ├── dashboard.controller.ts
│   │   ├── dashboard.service.ts
│   │   └── dashboard.module.ts
│   │
│   ├── common/                 # Shared entities & enums
│   │   ├── entities/
│   │   │   ├── user.entity.ts
│   │   │   ├── student.entity.ts
│   │   │   ├── class.entity.ts
│   │   │   └── lesson.entity.ts
│   │   └── enums/
│   │       └── index.ts
│   │
│   ├── config/                 # Configuration files
│   │   └── typeorm.config.ts
│   │
│   ├── app.module.ts           # Root module
│   └── main.ts                 # Entry point
│
├── test/                       # E2E tests
├── package.json
├── tsconfig.json
└── README.md
```

## 🔌 API Endpoints

All endpoints are prefixed with `/api`

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | Login with email/password | No |
| POST | `/api/auth/register` | Register new user (ADMIN only) | Yes (ADMIN) |

### Attendance

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/attendance` | Create/update attendance | Yes |
| POST | `/api/attendance/mark-full-day-absent` | Mark student absent for full day | Yes |
| GET | `/api/attendance?lessonId=&date=` | Get attendance records | Yes |
| GET | `/api/attendance/student/:id` | Get student attendance history | Yes |

### Grades

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/grades` | Submit a grade | Yes |
| GET | `/api/grades?studentId=&classId=&subject=` | Get grades | Yes |
| GET | `/api/grades/comment-templates` | Get comment templates | Yes |
| POST | `/api/grades/comment-templates` | Create comment template | Yes (TEACHER/ADMIN) |

### Educational Events

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/events` | Create educational event | Yes |
| GET | `/api/events?studentId=&teacherId=&from=&to=` | Get events | Yes |
| GET | `/api/events/:id` | Get event by ID | Yes |

### Report Cards

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/report-cards` | Create report card | Yes |
| POST | `/api/report-cards/:id/lines` | Add subject lines | Yes |
| GET | `/api/report-cards?studentId=` | Get report cards | Yes |
| GET | `/api/report-cards/:id` | Get report card by ID | Yes |
| PUT | `/api/report-cards/:id/publish` | Publish report card | Yes |

### Dashboard

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/dashboard/teacher/:id` | Get teacher summary | Yes |

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

## 🔧 Database Commands

```bash
# Generate migration after entity changes
npm run migration:generate -- src/migrations/AddNewField

# Create empty migration
npm run migration:create -- src/migrations/CustomMigration

# Run migrations
npm run migration:run

# Revert last migration
npm run migration:revert

# Seed demo data (optional)
npm run seed
```

## 📦 Build for Production

```bash
# Build the application
npm run build

# Start production server
npm run start:prod
```

## 🏗️ Architecture Patterns

### Module Structure
Each feature follows NestJS best practices:
- **Module**: Defines dependencies and exports
- **Controller**: Handles HTTP requests and routes
- **Service**: Contains business logic
- **DTOs**: Validates input data with class-validator
- **Entities**: TypeORM database models

### Authentication & Authorization
- **JWT Strategy**: Validates tokens and loads user
- **JwtAuthGuard**: Protects routes requiring authentication
- **RolesGuard**: Enforces role-based access control
- **@Roles() Decorator**: Specifies required roles per route
- **@CurrentUser() Decorator**: Injects authenticated user

### Validation
- **class-validator**: Automatic DTO validation
- **class-transformer**: Transforms plain objects to class instances
- **ValidationPipe**: Global validation configured in main.ts

## 🔐 Security Notes

For production deployment:

1. **Change JWT Secret**: Use a strong, random secret key
2. **Enable HTTPS**: Always use SSL/TLS certificates
3. **Rate Limiting**: Add rate limiting middleware
4. **Helmet**: Add security headers with helmet
5. **CSRF Protection**: Implement CSRF tokens if needed
6. **Environment Variables**: Never commit `.env` files
7. **Database**: Use connection pooling and prepared statements
8. **Logging**: Add proper logging and monitoring

## 🐛 Debugging

```bash
# Debug mode with Chrome DevTools
npm run start:debug

# Then open: chrome://inspect
```

## 📝 Code Style

```bash
# Format code
npm run format

# Lint code
npm run lint
```

## 🚨 Common Issues

### Database Connection Failed
- Ensure PostgreSQL is running: `docker-compose ps`
- Check `.env` database credentials
- Verify port 5432 is not in use

### Migration Errors
- Drop database and recreate: `docker-compose down -v && docker-compose up -d`
- Run migrations again: `npm run migration:run`

### Port Already in Use
- Change PORT in `.env`
- Kill process using port 3000: `lsof -ti:3000 | xargs kill`

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 🤝 Contributing

1. Follow existing code patterns
2. Write tests for new features
3. Use DTOs with validation
4. Add JSDoc comments for complex logic
5. Update API documentation

---

**Happy Coding! 🎉**

