import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { RootStoreContext, rootStore } from './stores/RootStore';
import { useStore } from './stores/RootStore';
import LoginPage from './features/auth/LoginPage';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardPage from './features/dashboard/DashboardPage';
import AttendancePage from './features/attendance/AttendancePage';
import GradesPage from './features/grades/GradesPage';
import EventsPage from './features/events/EventsPage';
import ReportCardsPage from './features/reportCards/ReportCardsPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  direction: 'ltr', // Change to 'rtl' for Hebrew/Arabic
});

const PrivateRoute = observer(({ children }: { children: JSX.Element }) => {
  const { authStore } = useStore();
  return authStore.isAuthenticated ? children : <Navigate to="/login" />;
});

function App() {
  return (
    <RootStoreContext.Provider value={rootStore}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <DashboardLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="attendance" element={<AttendancePage />} />
              <Route path="grades" element={<GradesPage />} />
              <Route path="events" element={<EventsPage />} />
              <Route path="report-cards" element={<ReportCardsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </RootStoreContext.Provider>
  );
}

export default App;

