import { Box, Typography, Paper, Button } from '@mui/material';
import { Add } from '@mui/icons-material';

const EventsPage = () => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Educational Events</Typography>
        <Button variant="contained" startIcon={<Add />}>
          Log Event
        </Button>
      </Box>
      
      <Paper sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
        <Typography variant="h6" gutterBottom>
          Events feature coming soon
        </Typography>
        <Typography>
          Log daily notes, behavioral incidents, and other educational events.
          Set severity levels (LOW/MEDIUM/HIGH) and notify counselors or admins.
        </Typography>
      </Paper>
    </Box>
  );
};

export default EventsPage;

