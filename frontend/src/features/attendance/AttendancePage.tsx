import { Box, Typography, Paper, Button } from '@mui/material';
import { Add } from '@mui/icons-material';

const AttendancePage = () => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Attendance Management</Typography>
        <Button variant="contained" startIcon={<Add />}>
          Mark Attendance
        </Button>
      </Box>
      
      <Paper sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
        <Typography variant="h6" gutterBottom>
          Attendance feature coming soon
        </Typography>
        <Typography>
          Select a class, date, and lesson to mark student attendance.
          Use "Mark Full Day Absent" for students missing all lessons.
        </Typography>
      </Paper>
    </Box>
  );
};

export default AttendancePage;

