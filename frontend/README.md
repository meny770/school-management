# School Management Frontend

Modern React SPA for teachers built with Vite, TypeScript, MobX, and Material-UI.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running on port 3000

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env
```

Configure the API URL (defaults to http://localhost:3000/api):

```env
VITE_API_URL=http://localhost:3000/api
```

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at: **http://localhost:5173**

## 📁 Project Structure

```
frontend/
├── src/
│   ├── features/              # Feature-based modules
│   │   ├── auth/             # Authentication (Login)
│   │   ├── dashboard/        # Teacher dashboard
│   │   ├── attendance/       # Attendance management
│   │   ├── grades/           # Grades & comment templates
│   │   ├── events/           # Educational events
│   │   └── reportCards/      # Report card generation
│   │
│   ├── components/           # Shared components
│   │   └── layout/          # Layout components (DashboardLayout)
│   │
│   ├── stores/              # MobX state stores
│   │   ├── AuthStore.ts    # Authentication state
│   │   └── RootStore.ts    # Root store combining all stores
│   │
│   ├── services/            # API services
│   │   └── api.ts          # Axios client with JWT interceptor
│   │
│   ├── App.tsx             # Main app with routing
│   └── main.tsx            # Entry point
│
├── index.html              # HTML template
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies
```

## 🏗️ Architecture

### State Management (MobX)

**Why MobX over Redux/Zustand:**
- Simpler boilerplate for MVP
- Observable pattern fits well with React
- Automatic re-rendering with `observer`
- Great TypeScript support

**Store Structure:**
```typescript
RootStore
  └── AuthStore (authentication state)
  // Future stores can be added here
```

### Routing

React Router v6 with protected routes:
- `/login` - Public login page
- `/` - Protected dashboard layout with nested routes:
  - `/` - Dashboard (default)
  - `/attendance` - Attendance management
  - `/grades` - Grades & templates
  - `/events` - Educational events
  - `/report-cards` - Report cards

### API Client

Axios instance with:
- JWT token injection from localStorage
- Automatic 401 handling (logout + redirect)
- Base URL configuration
- Request/response interceptors

### UI Components

Material-UI (MUI) v5:
- Modern, accessible components
- Theming support (easy RTL for Hebrew)
- Responsive design out of the box
- Consistent design system

## 🔐 Authentication Flow

1. User enters credentials on login page
2. `AuthStore.login()` calls `/api/auth/login`
3. JWT token and user data stored in localStorage
4. Token automatically attached to all API requests
5. On 401 response, user is logged out and redirected

## 📦 Build for Production

```bash
# Build optimized bundle
npm run build

# Preview production build
npm run preview
```

Build output will be in `dist/` directory.

## 🧪 Development

### Code Style

```bash
# Lint code
npm run lint
```

### Adding a New Feature

1. Create feature directory in `src/features/yourFeature/`
2. Add page component (e.g., `YourFeaturePage.tsx`)
3. Add route in `App.tsx`
4. Add navigation item in `DashboardLayout.tsx`
5. (Optional) Create dedicated store in `src/stores/`
6. (Optional) Add API service methods

### Example: Adding Attendance Store

```typescript
// src/stores/AttendanceStore.ts
import { makeAutoObservable } from 'mobx';
import { apiClient } from '../services/api';

export class AttendanceStore {
  attendances: any[] = [];
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchAttendances(lessonId: string) {
    this.loading = true;
    try {
      const response = await apiClient.get(`/attendance?lessonId=${lessonId}`);
      this.attendances = response.data;
    } finally {
      this.loading = false;
    }
  }
}

// Add to RootStore
export class RootStore {
  authStore: AuthStore;
  attendanceStore: AttendanceStore;

  constructor() {
    this.authStore = new AuthStore();
    this.attendanceStore = new AttendanceStore();
  }
}
```

## 🎨 Theming & Localization

### RTL Support (for Hebrew)

Update theme in `App.tsx`:

```typescript
const theme = createTheme({
  direction: 'rtl',
  // ... other config
});
```

Wrap app with RTL provider:

```typescript
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';

const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

<CacheProvider value={cacheRtl}>
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
</CacheProvider>
```

### Custom Theme

Modify theme in `App.tsx`:

```typescript
const theme = createTheme({
  palette: {
    primary: {
      main: '#your-color',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});
```

## 🔧 Environment Variables

All environment variables must be prefixed with `VITE_`:

- `VITE_API_URL` - Backend API base URL (default: http://localhost:3000/api)

Access in code:

```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

## 📱 Responsive Design

Material-UI breakpoints:
- `xs`: 0px+
- `sm`: 600px+
- `md`: 900px+
- `lg`: 1200px+
- `xl`: 1536px+

Example usage:

```typescript
<Box sx={{ 
  display: { xs: 'block', md: 'flex' },
  p: { xs: 2, md: 3 }
}}>
  {/* Content */}
</Box>
```

## 🚨 Common Issues

### CORS Errors
- Ensure backend CORS_ORIGIN includes `http://localhost:5173`
- Check that backend is running on port 3000

### 401 Unauthorized
- Clear localStorage and login again
- Check that JWT token is valid
- Verify backend JWT_SECRET matches

### Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run build`

## 📚 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool and dev server
- **MobX 6** - State management
- **React Router 6** - Routing
- **Material-UI 5** - Component library
- **Axios** - HTTP client
- **date-fns** - Date utilities

## 🎯 Next Steps

MVP is scaffolded with:
- ✅ Authentication with JWT
- ✅ Protected routing
- ✅ Dashboard layout with navigation
- ✅ Stub pages for all features

**To complete the MVP**, implement:

1. **Attendance Page**:
   - Class/lesson selector
   - Student list with present/absent toggles
   - Mark full day absent button
   - API integration with backend

2. **Grades Page**:
   - Grade entry form
   - Comment template selector
   - Student grades list
   - API integration

3. **Events Page**:
   - Event creation form
   - Event list by student/teacher
   - Severity badges
   - API integration

4. **Report Cards Page**:
   - Wizard for report card creation
   - Subject lines management
   - Draft/publish workflow
   - API integration

5. **Dashboard Page**:
   - Real API calls to `/api/dashboard/teacher/:id`
   - Display actual stats
   - Quick action buttons

## 🤝 Contributing

1. Follow existing code patterns
2. Use functional components with hooks
3. Wrap components with `observer` when using MobX
4. Add TypeScript types for all props and state
5. Use Material-UI components for consistency

---

**Built with ❤️ for teachers**

