import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { observer } from 'mobx-react-lite';
import {
  EventNote,
  Grade,
  Event,
  Warning,
} from '@mui/icons-material';

const DashboardPage = observer(() => {
  // TODO: Fetch real dashboard data from API
  const stats = {
    missingAttendance: 3,
    recentGrades: 12,
    recentEvents: 5,
    highSeverityEvents: 1,
  };

  const StatCard = ({ title, value, icon, color }: any) => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4">{value}</Typography>
          </Box>
          <Box sx={{ color, fontSize: 48 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Teacher Dashboard
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Welcome! Here's an overview of your recent activity.
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Missing Attendance"
            value={stats.missingAttendance}
            icon={<EventNote />}
            color="warning.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Recent Grades"
            value={stats.recentGrades}
            icon={<Grade />}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Recent Events"
            value={stats.recentEvents}
            icon={<Event />}
            color="info.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="High Priority Alerts"
            value={stats.highSeverityEvents}
            icon={<Warning />}
            color="error.main"
          />
        </Grid>
      </Grid>
    </Box>
  );
});

export default DashboardPage;

